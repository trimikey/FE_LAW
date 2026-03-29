import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import api from '../services/api';

const VideoCallContext = createContext();

const ICE_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
const VIDEO_CALL_STORAGE_KEY = 'lawyer_platform_active_video_call';

export const VideoCallProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const currentUserId = Number(user?.id);
    const socket = useSocket();

    const [incomingCall, setIncomingCall] = useState(null);
    const [outgoingCallPending, setOutgoingCallPending] = useState(false);
    const [callActive, setCallActive] = useState(false);
    const [activePartner, setActivePartner] = useState(null);
    const [callSecondsLeft, setCallSecondsLeft] = useState(0);
    const [callStatusText, setCallStatusText] = useState('');
    const [videoError, setVideoError] = useState('');
    const [quota, setQuota] = useState(null);
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const countdownRef = useRef(null);
    const lastCallStartedAtRef = useRef(null);
    const hasAttemptedResumeRef = useRef(false);

    const persistSession = (partner, extra = {}) => {
        if (typeof window === 'undefined' || !partner?.id) return;
        sessionStorage.setItem(
            VIDEO_CALL_STORAGE_KEY,
            JSON.stringify({
                id: partner.id,
                name: partner.name,
                caseCode: partner.caseCode || '',
                caseTitle: partner.caseTitle || '',
                caseContext: partner.caseContext || null,
                ...extra
            })
        );
    };

    const readPersistedSession = () => {
        if (typeof window === 'undefined') return null;
        const raw = sessionStorage.getItem(VIDEO_CALL_STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (_) {
            sessionStorage.removeItem(VIDEO_CALL_STORAGE_KEY);
            return null;
        }
    };

    const clearPersistedSession = () => {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(VIDEO_CALL_STORAGE_KEY);
    };

    const fetchQuota = async (partnerId) => {
        if (!partnerId) return;
        try {
            const res = await api.get(`/messages/video-call/quota/${partnerId}`);
            if (res.data?.success) {
                setQuota(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch video call quota:', error);
        }
    };

    const cleanupPeerConnection = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
    };

    const cleanupStreams = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    const resetCallState = () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setOutgoingCallPending(false);
        setIncomingCall(null);
        setCallActive(false);
        setActivePartner(null);
        setCallSecondsLeft(0);
        setCallStatusText('');
        cleanupPeerConnection();
        cleanupStreams();
        clearPersistedSession();
    };

    const ensureLocalStream = async () => {
        if (localStreamRef.current) return localStreamRef.current;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getAudioTracks().forEach((track) => {
                track.enabled = micEnabled;
            });
            stream.getVideoTracks().forEach((track) => {
                track.enabled = cameraEnabled;
            });
            localStreamRef.current = stream;
            setCameraEnabled(true);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            return stream;
        } catch (error) {
            console.warn('Initial camera access failed, trying audio only:', error);
            if (error.name === 'NotReadableError' || error.name === 'TrackStartError' || error.message.includes('Device in use')) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
                    audioStream.getAudioTracks().forEach((track) => {
                        track.enabled = micEnabled;
                    });
                    localStreamRef.current = audioStream;
                    setCameraEnabled(false);
                    setVideoError('Máy ảnh đang được sử dụng. Đã chuyển sang chế độ Chỉ dùng âm thanh.');
                    return audioStream;
                } catch (innerError) {
                    setVideoError('Không thể truy cập camera hoặc micro.');
                    throw innerError;
                }
            }
            setVideoError('Không thể truy cập camera hoặc micro.');
            throw error;
        }
    };

    const createPeerConnection = async (targetUserId) => {
        cleanupPeerConnection();
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        pc.onicecandidate = (event) => {
            if (!event.candidate) return;
            socket?.emit('webrtc_ice_candidate', {
                toUserId: targetUserId,
                candidate: event.candidate
            });
        };

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        const stream = await ensureLocalStream();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        return pc;
    };

    const startCall = async (partner) => {
        setVideoError('');
        setActivePartner(partner);
        setIsOverlayOpen(true);
        persistSession(partner, { state: 'requesting' });

        if (!socket?.connected) {
            setVideoError('Máy chủ chưa sẵn sàng. Vui lòng kiểm tra kết nối.');
            return;
        }

        setOutgoingCallPending(true);
        socket.emit('video_call_request', {
            fromUserId: currentUserId,
            toUserId: partner.id
        });
    };

    const acceptCall = () => {
        if (!incomingCall) return;
        socket?.emit('video_call_accept', {
            callerId: incomingCall.callerId,
            calleeId: currentUserId
        });
    };

    const declineCall = () => {
        if (!incomingCall) return;
        socket?.emit('video_call_decline', {
            callerId: incomingCall.callerId,
            calleeId: currentUserId
        });
        setIncomingCall(null);
    };

    const endCall = () => {
        if (activePartner) {
            socket?.emit('video_call_end', { peerId: activePartner.id });
        }
        resetCallState();
        setIsOverlayOpen(false);
    };

    useEffect(() => {
        if (activePartner?.id) {
            fetchQuota(activePartner.id);
        }
    }, [activePartner?.id]);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId || !socket?.connected || hasAttemptedResumeRef.current) return;

        const persistedSession = readPersistedSession();
        if (!persistedSession?.id) return;

        hasAttemptedResumeRef.current = true;
        setActivePartner((prev) => prev || persistedSession);
        setIsOverlayOpen(true);
        socket.emit('video_call_resume_request', {
            userId: currentUserId,
            partnerId: Number(persistedSession.id)
        });
    }, [isAuthenticated, currentUserId, socket?.connected]);

    useEffect(() => {
        if (!localStreamRef.current) return;

        localStreamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = micEnabled;
        });

        localStreamRef.current.getVideoTracks().forEach((track) => {
            track.enabled = cameraEnabled;
        });
    }, [micEnabled, cameraEnabled]);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId || !socket) return undefined;

        const handleIncoming = (payload) => {
            setIncomingCall({ callerId: Number(payload.callerId), callerName: payload.callerName });
            setIsOverlayOpen(true);
        };

        const handleStarted = async (payload) => {
            const partnerId = Number(payload.callerId) === currentUserId ? Number(payload.calleeId) : Number(payload.callerId);
            setOutgoingCallPending(false);
            setIncomingCall(null);
            setCallActive(true);
            setIsOverlayOpen(true);
            lastCallStartedAtRef.current = Date.now();
            const allowed = Number(payload.allowedSeconds || 0);
            setCallSecondsLeft(allowed);
            setCallStatusText('Đang kết nối');

            const persistedSession = readPersistedSession();
            const resolvedPartner =
                activePartner?.id === partnerId
                    ? activePartner
                    : persistedSession?.id === partnerId
                        ? persistedSession
                        : { id: partnerId, name: persistedSession?.name || `Người dùng #${partnerId}` };

            setActivePartner(resolvedPartner);
            persistSession(resolvedPartner, { state: 'active' });

            if (countdownRef.current) clearInterval(countdownRef.current);
            countdownRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - lastCallStartedAtRef.current) / 1000);
                setCallSecondsLeft(Math.max(0, allowed - elapsed));
            }, 1000);

            await ensureLocalStream();
            if (Number(payload.callerId) === currentUserId) {
                const pc = await createPeerConnection(partnerId);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('webrtc_offer', { toUserId: partnerId, sdp: offer });
            }
        };

        const handleOffer = async ({ fromUserId, sdp }) => {
            const pc = await createPeerConnection(fromUserId);
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc_answer', { toUserId: fromUserId, sdp: answer });
        };

        const handleAnswer = async ({ sdp }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
            }
        };

        const handleIce = async ({ candidate }) => {
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (_) {
                    // ignore bad candidate race
                }
            }
        };

        const handleEnded = () => {
            resetCallState();
        };

        const handleDeclined = () => {
            resetCallState();
            setVideoError('Đối tác đã từ chối cuộc gọi.');
        };

        const handleCallError = (payload) => {
            const message = payload?.message || 'Không thể bắt đầu cuộc gọi.';

            if (message === 'Cuộc gọi không còn hoạt động.') {
                resetCallState();
                setIsOverlayOpen(false);
                return;
            }

            setVideoError(payload?.message || 'Không thể bắt đầu cuộc gọi.');
            const persistedSession = readPersistedSession();
            if (persistedSession?.id && message.includes('already active')) {
                socket.emit('video_call_resume_request', {
                    userId: currentUserId,
                    partnerId: Number(persistedSession.id)
                });
                return;
            }

            resetCallState();
            setVideoError(message);
            setIsOverlayOpen(true);
        };

        const handleLimitReached = (payload) => {
            resetCallState();
            setVideoError(payload?.message || 'Đã hết thời lượng cuộc gọi.');
            setIsOverlayOpen(true);
        };

        socket.on('video_call_incoming', handleIncoming);
        socket.on('video_call_started', handleStarted);
        socket.on('webrtc_offer', handleOffer);
        socket.on('webrtc_answer', handleAnswer);
        socket.on('webrtc_ice_candidate', handleIce);
        socket.on('video_call_ended', handleEnded);
        socket.on('video_call_declined', handleDeclined);
        socket.on('video_call_error', handleCallError);
        socket.on('video_call_limit_reached', handleLimitReached);

        return () => {
            socket.off('video_call_incoming', handleIncoming);
            socket.off('video_call_started', handleStarted);
            socket.off('webrtc_offer', handleOffer);
            socket.off('webrtc_answer', handleAnswer);
            socket.off('webrtc_ice_candidate', handleIce);
            socket.off('video_call_ended', handleEnded);
            socket.off('video_call_declined', handleDeclined);
            socket.off('video_call_error', handleCallError);
            socket.off('video_call_limit_reached', handleLimitReached);
        };
    }, [isAuthenticated, currentUserId, socket]);

    return (
        <VideoCallContext.Provider
            value={{
                incomingCall,
                outgoingCallPending,
                callActive,
                activePartner,
                callSecondsLeft,
                callStatusText,
                videoError,
                micEnabled,
                cameraEnabled,
                quota,
                isOverlayOpen,
                setIsOverlayOpen,
                localVideoRef,
                remoteVideoRef,
                setMicEnabled,
                setCameraEnabled,
                startCall,
                acceptCall,
                declineCall,
                endCall,
                ensureLocalStream
            }}
        >
            {children}
        </VideoCallContext.Provider>
    );
};

export const useVideoCall = () => useContext(VideoCallContext);
