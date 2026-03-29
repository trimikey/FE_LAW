import React, { useState } from 'react';
import {
    HiOutlineBell,
    HiOutlineChatAlt,
    HiOutlineVideoCamera,
    HiChevronRight,
    HiOutlineSearch,
    HiOutlineUserCircle
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { resolveAvatarUrl } from '../../utils/avatar';

const DashboardHeader = ({ unreadMessagesCount = 0, missedCallsCount = 0 }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const totalNotifications = unreadMessagesCount + missedCallsCount;

    return (
        <header className="flex h-24 items-center justify-between px-8 bg-white/50 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
            <div className="flex items-center gap-8 flex-1">
                <div className="relative group w-full max-w-md hidden md:block">
                    <HiOutlineSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhanh hồ sơ, văn bản..."
                        className="w-full rounded-2xl border-2 border-slate-50 bg-white/50 py-4 pl-16 pr-6 text-xs font-bold text-[#041837] placeholder:text-slate-300 focus:border-amber-500 focus:bg-white transition-all outline-none shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`group relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${isNotificationOpen ? 'bg-[#041837] text-amber-500 shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-[#041837] border border-slate-100'}`}
                    >
                        <HiOutlineBell className={`h-6 w-6 transition ${isNotificationOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
                        {totalNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white ring-4 ring-white shadow-lg animate-bounce">
                                {totalNotifications > 9 ? '9+' : totalNotifications}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)} />
                            <div className="absolute right-0 mt-6 w-96 transform rounded-[40px] bg-white p-6 shadow-2xl ring-1 ring-slate-100 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="mb-6 flex items-center justify-between px-2">
                                    <h3 className="text-xl font-black text-[#041837] tracking-tight">Thông báo mới</h3>
                                    <span className="rounded-xl bg-amber-50 px-3 py-1 text-[9px] font-black uppercase text-amber-600 tracking-widest">{totalNotifications} Tin mới</span>
                                </div>

                                <div className="space-y-3">
                                    {unreadMessagesCount > 0 && (
                                        <button
                                            onClick={() => { navigate('/dashboard?tab=messages'); setIsNotificationOpen(false); }}
                                            className="group flex w-full items-center gap-5 rounded-[28px] p-4 transition hover:bg-slate-50"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-transform group-hover:rotate-6">
                                                <HiOutlineChatAlt size={24} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-black text-[#041837] uppercase tracking-tight">Tin nhắn chưa đọc</p>
                                                <p className="mt-1 text-[11px] font-bold text-slate-400 capitalize">Bạn có {unreadMessagesCount} tin nhắn mới đang chờ</p>
                                            </div>
                                            <HiChevronRight className="h-5 w-5 text-slate-200" />
                                        </button>
                                    )}

                                    {missedCallsCount > 0 && (
                                        <button
                                            className="group flex w-full items-center gap-5 rounded-[28px] p-4 transition hover:bg-slate-50"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 transition-transform group-hover:rotate-6">
                                                <HiOutlineVideoCamera size={24} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-black text-[#041837] uppercase tracking-tight">Cuộc gọi nhỡ</p>
                                                <p className="mt-1 text-[11px] font-bold text-slate-400 capitalize">Có {missedCallsCount} cuộc gọi video bị bỏ lỡ</p>
                                            </div>
                                            <HiChevronRight className="h-5 w-5 text-slate-200" />
                                        </button>
                                    )}

                                    {totalNotifications === 0 && (
                                        <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <HiOutlineBell size={32} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hiện không có thông báo mới</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-50">
                                    <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-all">Xem tất cả hoạt động</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="h-10 w-px bg-slate-100 hidden sm:block" />

                {/* Profile Placeholder */}
                <button className="flex items-center gap-4 group">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-black text-[#041837] uppercase tracking-tight">{user?.full_name || 'Thành viên Hệ thống'}</p>
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5">{user?.role_name?.toUpperCase() || 'Verified Account'}</p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-[#041837] p-0.5 shadow-xl transition-transform group-hover:scale-110">
                        <div className="h-full w-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center text-[#041837]">
                            {user?.avatar ? (
                                <img
                                    src={resolveAvatarUrl(user.avatar)}
                                    alt={user.full_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = `<span class="font-black text-lg">${user.full_name?.charAt(0) || 'U'}</span>`;
                                    }}
                                />
                            ) : (
                                <span className="font-black text-lg">{user?.full_name?.charAt(0) || <HiOutlineUserCircle size={32} />}</span>
                            )}
                        </div>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
