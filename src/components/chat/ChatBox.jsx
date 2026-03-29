import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  HiX,
  HiMinus,
  HiPaperAirplane,
  HiOutlineEmojiHappy,
  HiOutlinePlusCircle,
  HiCheckCircle,
  HiOutlineInformationCircle
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { SOCKET_ENDPOINT } from '../../utils/chatEndpoint';
import { useVideoCall } from '../../contexts/VideoCallContext';

const getInitials = (name) => {
  const safe = (name || 'User').trim();
  const parts = safe.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return safe.slice(0, 2).toUpperCase();
};

const formatMessageTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const ChatBox = ({ partnerId, partnerName, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const currentUserId = Number(user?.id);
  const partnerUserId = Number(partnerId);

  const {
    startCall, callActive, outgoingCallPending, incomingCall,
    callSecondsLeft, videoError
  } = useVideoCall();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [partnerPresence, setPartnerPresence] = useState({ isOnline: false, lastSeen: null });
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchHistory = async () => {
    const res = await api.get(`/messages/history/${partnerUserId}`);
    if (res.data?.success) {
      setMessages(res.data.data || []);
    }
  };

  const markAsRead = async () => {
    try {
      await api.patch(`/messages/read/${partnerUserId}`);
    } catch (_) { }
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUserId || !partnerUserId) return undefined;

    socketRef.current = io(SOCKET_ENDPOINT, { transports: ['websocket', 'polling'] });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_room', currentUserId);
      socketRef.current.emit('get_presence', { targetUserId: partnerUserId });
    });

    fetchHistory().catch((error) => console.error('Failed to fetch chat history', error));
    markAsRead();

    socketRef.current.on('receive_message', (message) => {
      const isCurrentConversation =
        (Number(message.sender_id) === partnerUserId && Number(message.receiver_id) === currentUserId) ||
        (Number(message.sender_id) === currentUserId && Number(message.receiver_id) === partnerUserId);

      if (!isCurrentConversation) return;

      setMessages((prev) => {
        const exists = prev.some(m => m.id === message.id);
        return exists ? prev : [...prev, message];
      });
      if (Number(message.sender_id) === partnerUserId) {
        markAsRead();
      }
    });

    socketRef.current.on('presence_state', (payload) => {
      if (Number(payload?.userId) !== partnerUserId) return;
      setPartnerPresence({
        isOnline: Boolean(payload?.isOnline),
        lastSeen: payload?.lastSeen || null
      });
    });

    socketRef.current.on('presence_update', (payload) => {
      if (Number(payload?.userId) !== partnerUserId) return;
      setPartnerPresence({
        isOnline: Boolean(payload?.isOnline),
        lastSeen: payload?.lastSeen || null
      });
    });

    socketRef.current.on('typing_update', (payload) => {
      if (Number(payload?.fromUserId) !== partnerUserId) return;
      setIsPartnerTyping(Boolean(payload?.isTyping));
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketRef.current?.emit('typing', {
        fromUserId: currentUserId,
        toUserId: partnerUserId,
        isTyping: false
      });
      socketRef.current?.disconnect();
    };
  }, [isAuthenticated, currentUserId, partnerUserId]);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isPartnerTyping, isMinimized]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !socketRef.current.connected || sending) return;

    setSending(true);
    socketRef.current.emit(
      'send_message',
      {
        sender_id: currentUserId,
        receiver_id: partnerUserId,
        content: newMessage.trim(),
        type: 'text'
      },
      (ack) => {
        setSending(false);
        if (ack?.success) {
          setNewMessage('');
          socketRef.current?.emit('typing', {
            fromUserId: currentUserId,
            toUserId: partnerUserId,
            isTyping: false
          });
        }
      }
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('typing', {
      fromUserId: currentUserId,
      toUserId: partnerUserId,
      isTyping: value.trim().length > 0
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', {
        fromUserId: currentUserId,
        toUserId: partnerUserId,
        isTyping: false
      });
    }, 1200);
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className={`fixed bottom-0 right-8 z-[100] flex flex-col transition-all duration-500 ease-in-out font-sans ${isMinimized
          ? 'w-72 h-16'
          : 'w-[400px] h-[600px] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.25)] rounded-t-[32px]'
        }`}
    >
      {/* Header */}
      <div
        className={`bg-[#041837] text-white p-4 flex justify-between items-center cursor-pointer select-none transition-all duration-500 ${isMinimized ? 'rounded-t-2xl' : 'rounded-t-[32px]'
          }`}
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-[14px] bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-black text-amber-500">{getInitials(partnerName)}</span>
            {partnerPresence.isOnline && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-sm" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs tracking-tight uppercase truncate max-w-[150px]">{partnerName}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              {partnerPresence.isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <HiMinus size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-8 w-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
          >
            <HiX size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#F8FAFC] flex flex-col gap-6 scrollbar-hide">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                <HiOutlineInformationCircle size={40} className="text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#041837] max-w-[200px]">
                  Bắt đầu cuộc trò chuyện nghiệp vụ pháp lý
                </p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isOwn = Number(msg.sender_id) === currentUserId;
              const showTime = idx === messages.length - 1 ||
                Math.abs(new Date(msg.created_at) - new Date(messages[idx + 1]?.created_at)) > 300000;

              return (
                <div key={msg.id || `${msg.sender_id}-${msg.created_at}`}
                  className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div
                    className={`max-w-[85%] px-5 py-3.5 shadow-sm text-sm leading-relaxed ${isOwn
                      ? 'bg-amber-500 text-[#041837] font-bold rounded-2xl rounded-tr-[4px] shadow-amber-500/10'
                      : 'bg-white border border-slate-50 text-slate-700 font-medium rounded-2xl rounded-tl-[4px] shadow-slate-200/50'
                      }`}
                  >
                    {msg.content}
                  </div>
                  {showTime && (
                    <div className={`mt-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${isOwn ? 'text-amber-600' : 'text-slate-300'}`}>
                      <span>{formatMessageTime(msg.created_at)}</span>
                      {isOwn && <HiCheckCircle size={10} className={msg.is_read ? 'text-emerald-500' : 'text-slate-200'} />}
                    </div>
                  )}
                </div>
              );
            })}

            {isPartnerTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-1.5 bg-white border border-slate-50 rounded-full px-4 py-3 shadow-xl shadow-slate-200/50">
                  <div className="h-1 w-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-1 w-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-1 w-1 bg-amber-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-50 rounded-b-none">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-3xl border-2 border-transparent focus-within:border-amber-500/20 focus-within:bg-white focus-within:ring-8 focus-within:ring-amber-500/5 transition-all transition-shadow">
              <button className="h-10 w-10 shrink-0 flex items-center justify-center text-slate-300 hover:text-amber-500 transition-colors">
                <HiOutlinePlusCircle size={24} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập nội dung..."
                className="flex-1 bg-transparent py-2 text-sm font-bold text-[#041837] outline-none placeholder:text-slate-300"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl transition-all shadow-xl ${newMessage.trim()
                    ? 'bg-amber-500 text-[#041837] shadow-amber-500/30 hover:bg-amber-600 active:scale-90'
                    : 'bg-slate-200 text-slate-400 opacity-50'
                  }`}
              >
                <HiPaperAirplane size={20} className="rotate-45 -translate-y-0.5" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">
                Bảo mật bởi chuẩn mã hóa TLS 1.3
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
