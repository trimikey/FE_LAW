import { useVideoCall } from '../../contexts/VideoCallContext';
import { HiVideoCamera, HiClock, HiUser, HiShieldCheck } from 'react-icons/hi';

const VideoChatTab = ({ conversations = [] }) => {
    const { startCall, setIsOverlayOpen } = useVideoCall();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Main Hero Call Section */}
            <div className="relative overflow-hidden rounded-[48px] bg-[#041837] p-16 text-center shadow-2xl transition-all group">
                {/* Visual Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] -ml-64 -mb-64 animate-pulse delay-700" />

                <div className="relative z-10">
                    <div className="w-28 h-28 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 flex items-center justify-center mx-auto mb-10 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                        <HiVideoCamera size={56} className="text-amber-500" />
                    </div>

                    <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Secure Connection</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Trực tuyến cùng Luật sư</h2>
                    <p className="text-slate-400 max-w-lg mx-auto mb-12 text-lg font-medium leading-relaxed">
                        Kết nối ngay lập tức thông qua cuộc gọi Video HD được bảo mật tuyệt đối.
                        Trao đổi hồ sơ và giải quyết vấn đề pháp lý mọi lúc, mọi nơi.
                    </p>

                    <button
                        onClick={() => {
                            if (conversations.length > 0) {
                                startCall({ id: conversations[0].partnerId, name: conversations[0].partnerName });
                            } else {
                                setIsOverlayOpen(true);
                            }
                        }}
                        className="bg-amber-500 hover:bg-amber-600 text-[#041837] font-black py-5 px-16 rounded-[24px] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-amber-500/30 active:scale-95 transform"
                    >
                        Bắt đầu gọi tư vấn ngay
                    </button>

                    <div className="mt-10 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest">
                            <HiShieldCheck className="h-4 w-4 text-emerald-500" />
                            Mã hóa đầu cuối
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest">
                            <HiVideoCamera className="h-4 w-4 text-blue-500" />
                            Chất lượng HD 4K
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Contacts */}
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-[#041837] tracking-tight">Liên hệ tiêu biểu</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lịch sử kết nối gần nhất</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                            <HiClock size={24} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {conversations.length > 0 ? (
                            conversations.slice(0, 4).map((conv) => (
                                <div key={conv.partnerId} className="flex items-center justify-between p-4 rounded-[28px] bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:border-slate-100 border border-transparent transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#041837] rounded-2xl flex items-center justify-center text-amber-500 font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">
                                            {conv.partnerName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-black text-[#041837] text-base">{conv.partnerName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sẵn sàng kết nối</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => startCall({ id: conv.partnerId, name: conv.partnerName })}
                                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-amber-600 hover:bg-[#041837] hover:text-white transition-all shadow-sm"
                                    >
                                        <HiVideoCamera size={24} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <HiUser className="h-16 w-16 text-slate-100 mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chưa có dữ liệu hội thoại</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features / Side Card */}
                <div className="bg-[#f5b301] rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl shadow-amber-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                        <HiShieldCheck size={120} className="text-[#041837]" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-[#041837] rounded-3xl flex items-center justify-center text-amber-500 mb-8 shadow-xl mx-auto">
                            <HiVideoCamera size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-[#041837] mb-4 tracking-tight">Ổn định & Riêng tư</h4>
                        <p className="text-[#041837]/60 font-medium text-sm leading-relaxed mb-10">
                            Hệ thống sử dụng hạ tầng Private Cloud giúp tốc độ ổn định xuyên suốt ngay cả trong điều kiện mạng yếu.
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#041837] font-black text-[9px] uppercase tracking-widest bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm">
                                <span className="h-2 w-2 rounded-full bg-[#041837] animate-ping" />
                                Online: 99.9%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoChatTab;
