import { useEffect, useMemo, useState } from 'react';
import { useVideoCall } from '../../contexts/VideoCallContext';
import {
    HiMicrophone,
    HiVideoCamera,
    HiOutlineMicrophone,
    HiOutlineVideoCamera,
    HiOutlineDesktopComputer,
    HiOutlineCog,
    HiOutlineDocumentText,
    HiOutlinePencilAlt,
    HiOutlineArrowRight,
    HiOutlineUser,
    HiOutlineClock,
    HiOutlinePhone
} from 'react-icons/hi';
import { MdCallEnd } from 'react-icons/md';

const formatClock = (seconds) => {
    const total = Math.max(0, Number(seconds || 0));
    const hh = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const ss = total % 60;
    return [hh, mm, ss].map((value) => String(value).padStart(2, '0')).join(':');
};

const VideoCallOverlay = () => {
    const {
        isOverlayOpen,
        setIsOverlayOpen,
        callActive,
        outgoingCallPending,
        incomingCall,
        activePartner,
        callSecondsLeft,
        videoError,
        micEnabled,
        cameraEnabled,
        localVideoRef,
        remoteVideoRef,
        setMicEnabled,
        setCameraEnabled,
        acceptCall,
        declineCall,
        endCall,
        ensureLocalStream
    } = useVideoCall();

    const [activeTab, setActiveTab] = useState('notes');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [note, setNote] = useState('');
    const [quickMessage, setQuickMessage] = useState('');

    useEffect(() => {
        let timer;
        if (callActive) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
            setQuickMessage('');
        }
        return () => clearInterval(timer);
    }, [callActive]);

    const caseContext = activePartner?.caseContext || {};
    const sharedDocuments = useMemo(() => {
        if (Array.isArray(caseContext.documents) && caseContext.documents.length > 0) {
            return caseContext.documents.slice(0, 4);
        }
        return [
            { name: 'Hop-dong-mau.pdf', meta: '2.4 MB • 12/03/2026' },
            { name: 'Bien-ban-trao-doi.docx', meta: '1.1 MB • 15/03/2026' }
        ];
    }, [caseContext.documents]);

    if (!isOverlayOpen) return null;

    if (!callActive) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#041837] text-white flex flex-col items-center justify-center px-6">
                {outgoingCallPending ? (
                    <div className="text-center max-w-xl">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-[#3f72ff]/30 bg-[#0c254d] shadow-2xl shadow-[#041837]/50">
                            <HiVideoCamera size={44} className="text-[#4f86ff]" />
                        </div>
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#f2b51d]">Đang kết nối cuộc gọi</p>
                        <h2 className="mb-4 text-4xl font-black leading-tight">Đang chờ {activePartner?.name || 'đối tác'} phản hồi</h2>
                        <p className="text-lg text-slate-300">Giữ nguyên cửa sổ này để bắt đầu phiên tư vấn ngay khi đối tác chấp nhận.</p>
                        <button
                            onClick={endCall}
                            className="mt-12 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-xl shadow-red-900/40 transition hover:scale-105 hover:bg-[#dc2626]"
                        >
                            <MdCallEnd size={30} />
                        </button>
                    </div>
                ) : incomingCall ? (
                    <div className="text-center max-w-xl">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-400/30 bg-emerald-500/10 shadow-2xl shadow-black/30">
                            <HiVideoCamera size={44} className="text-emerald-400" />
                        </div>
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-emerald-300">Cuộc gọi đến</p>
                        <h2 className="mb-4 text-4xl font-black leading-tight">{incomingCall.callerName || 'Đối tác'} đang gọi cho bạn</h2>
                        <p className="text-lg text-slate-300">Chấp nhận để bắt đầu tư vấn video trực tiếp.</p>
                        <div className="mt-12 flex items-center justify-center gap-6">
                            <button
                                onClick={acceptCall}
                                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 transition hover:scale-105 hover:bg-emerald-600"
                            >
                                <HiVideoCamera size={28} />
                            </button>
                            <button
                                onClick={declineCall}
                                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-xl shadow-red-900/40 transition hover:scale-105 hover:bg-[#dc2626]"
                            >
                                <MdCallEnd size={30} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center max-w-2xl">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-[#3f72ff]/20 bg-[#0c254d] shadow-2xl shadow-[#02101f]">
                            <HiVideoCamera size={42} className="text-[#4f86ff]" />
                        </div>
                        <h2 className="mb-5 text-5xl font-black leading-tight">Sẵn sàng để bắt đầu cuộc gọi?</h2>
                        <p className="mx-auto mb-10 max-w-2xl text-xl italic text-slate-300">
                            Vui lòng chọn một đối tác từ danh sách tin nhắn hoặc lịch sử cuộc gọi để bắt đầu tư vấn.
                        </p>
                        <button
                            onClick={() => setIsOverlayOpen(false)}
                            className="inline-flex items-center rounded-3xl bg-[#3466df] px-10 py-5 text-xl font-black uppercase tracking-wide text-white shadow-2xl shadow-blue-950/40 transition hover:bg-[#2555cb]"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                )}

                {videoError && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                        <div className="rounded-full border border-white/10 bg-[#dc2626] px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-2xl">
                            {videoError}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => ensureLocalStream()}
                                className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition flex items-center gap-2"
                            >
                                <HiOutlineCog /> BIỆN PHÁP KHÁC
                            </button>
                            <button
                                onClick={() => setIsOverlayOpen(false)}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition"
                            >
                                QUAY LẠI
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#f6f7fb]">
            <div className="h-8 bg-[#06264a] px-8 text-[12px] font-semibold text-white flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <span>(+84) 0938 744 798</span>
                    <span>HieuLuat@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                    <HiOutlinePhone size={14} />
                    <HiOutlineCog size={14} />
                </div>
            </div>

            <header className="flex h-[72px] items-center justify-between bg-[#e7ae2e] px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#0d2a4d] text-white shadow-sm">
                        <HiOutlineUser size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#08213f]/80">Đang trong cuộc gọi</p>
                        <h2 className="text-[26px] font-black leading-none text-[#041837]">
                            Tư vấn: {activePartner?.name || 'Khách hàng'} ({caseContext.caseCode || activePartner?.caseCode || '#CAS-2024-0082'})
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full bg-[#d89f1f] px-4 py-2 text-[#041837] shadow-inner">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                        <span className="text-base font-black tabular-nums">{formatClock(callSecondsLeft || elapsedTime)}</span>
                    </div>
                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d89f1f] text-[#041837] shadow-sm">
                        <HiOutlineUser size={20} />
                    </button>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <section className="relative flex-1 overflow-hidden bg-white">
                    <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover bg-[#eef2f8]" />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#102641]/10" />

                    <div className="absolute top-4 right-4 h-28 w-44 overflow-hidden rounded-xl bg-[#31435f] shadow-2xl ring-1 ring-black/10">
                        <video ref={localVideoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                        {!cameraEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#31435f] text-white/40">
                                <HiOutlineUser size={28} />
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">
                            Bạn (Luật sư)
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 rounded-xl bg-[#1c2433]/80 px-4 py-3 text-white shadow-xl backdrop-blur-md">
                        <p className="text-sm font-black">{activePartner?.name || 'Khách hàng'}</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/70">Khách hàng · Kết nối ổn định</p>
                    </div>
                </section>

                <aside className="flex w-[340px] flex-col border-l border-slate-200 bg-white">
                    <div className="flex h-14 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`flex-1 border-b-2 text-xs font-black uppercase tracking-[0.16em] transition ${activeTab === 'notes' ? 'border-[#e7ae2e] text-[#d39c1c]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="inline-flex items-center gap-2"><HiOutlinePencilAlt size={14} /> Meeting Notes</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`flex-1 border-b-2 text-xs font-black uppercase tracking-[0.16em] transition ${activeTab === 'docs' ? 'border-[#e7ae2e] text-[#d39c1c]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="inline-flex items-center gap-2"><HiOutlineDocumentText size={14} /> Documents</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
                        {activeTab === 'notes' ? (
                            <>
                                <section>
                                    <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Thông tin vụ việc</h4>
                                    <div className="rounded-2xl bg-[#f6f7fb] p-4">
                                        <p className="text-sm font-black text-[#16253f]">{caseContext.caseTitle || activePartner?.caseTitle || 'Tư vấn hợp đồng thương mại'}</p>
                                        <p className="mt-1 text-[11px] font-bold text-slate-400">Hồ sơ {caseContext.caseCode || activePartner?.caseCode || '#CAS-2024-0082'}</p>
                                    </div>
                                </section>

                                <section>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ghi chú cuộc gọi</h4>
                                        <span className="text-[10px] font-semibold italic text-slate-300">Tự động lưu...</span>
                                    </div>
                                    <textarea
                                        value={note}
                                        onChange={(event) => setNote(event.target.value)}
                                        placeholder="Nhập ghi chú quan trọng tại đây..."
                                        className="h-[260px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none transition focus:border-[#e7ae2e] focus:ring-4 focus:ring-[#e7ae2e]/10"
                                    />
                                </section>

                                <section>
                                    <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tài liệu đang chia sẻ</h4>
                                    <div className="space-y-3">
                                        {sharedDocuments.map((document, index) => (
                                            <div key={`${document.name}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f8fafc] p-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf4ff] text-[#3f72ff]">
                                                    <HiOutlineDocumentText size={20} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-[#16253f]">{document.name}</p>
                                                    <p className="text-[11px] text-slate-400">{document.meta || 'Tài liệu vụ việc'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <section>
                                <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tài liệu liên quan</h4>
                                <div className="space-y-3">
                                    {sharedDocuments.map((document, index) => (
                                        <div key={`${document.name}-docs-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff5d7] text-[#d39c1c]">
                                                <HiOutlineDocumentText size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-[#16253f]">{document.name}</p>
                                                <p className="text-[11px] text-slate-400">{document.meta || 'Tài liệu vụ việc'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="border-t border-slate-200 p-4">
                        <div className="relative">
                            <input
                                value={quickMessage}
                                onChange={(event) => setQuickMessage(event.target.value)}
                                type="text"
                                placeholder="Gửi tin nhắn nhanh cho khách hàng..."
                                className="w-full rounded-full border border-slate-200 bg-[#f8fafc] py-3 pl-4 pr-12 text-sm outline-none transition focus:border-[#e7ae2e] focus:ring-4 focus:ring-[#e7ae2e]/10"
                            />
                            <button className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#e7ae2e] text-white transition hover:bg-[#d39c1c]">
                                <HiOutlineArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <footer className="flex h-16 items-center justify-center gap-4 bg-[#06264a] px-8 shadow-[0_-6px_18px_rgba(0,0,0,0.18)]">
                <button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition ${micEnabled ? 'bg-[#16385f] text-white hover:bg-[#1b4677]' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                >
                    {micEnabled ? <HiMicrophone size={20} /> : <HiOutlineMicrophone size={20} />}
                </button>
                <button
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition ${cameraEnabled ? 'bg-[#16385f] text-white hover:bg-[#1b4677]' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                >
                    {cameraEnabled ? <HiVideoCamera size={20} /> : <HiOutlineVideoCamera size={20} />}
                </button>

                <div className="mx-2 h-9 w-px bg-white/15" />
                <button
                    onClick={endCall}
                    className="inline-flex items-center gap-3 rounded-2xl bg-[#ff5757] px-7 py-3 text-sm font-black text-white shadow-lg shadow-red-900/30 transition hover:bg-[#ef4444]"
                >
                    <MdCallEnd size={22} /> Kết thúc cuộc gọi
                </button>
            </footer>

            {videoError && (
                <div className="absolute top-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#dc2626] px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl">
                    {videoError}
                </div>
            )}
        </div>
    );
};

export default VideoCallOverlay;
