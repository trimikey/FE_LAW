import { useNavigate } from 'react-router-dom';
import {
    HiChartPie,
    HiCollection,
    HiInbox,
    HiLogout,
    HiUserGroup,
    HiVideoCamera,
    HiCalendar,
    HiViewGrid,
    HiCurrencyDollar,
    HiStar,
    HiChatAlt
} from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/Logo_Hieuluat2-removebg-preview.png';

const DashboardSidebar = ({ activeTab, setActiveTab, role, unreadMessagesCount = 0 }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const lawyerMenuItems = [
        { key: 'overview', label: 'Tổng quan', icon: HiChartPie },
        { key: 'orders', label: 'Giao dịch', icon: HiCurrencyDollar },
        { key: 'inquiries', label: 'Yêu cầu tư vấn', icon: HiUserGroup },
        { key: 'dossiers', label: 'Hồ sơ khách hàng', icon: HiCollection },
        { key: 'cases', label: 'Vụ việc', icon: HiViewGrid },
        { key: 'consultations', label: 'Lịch tư vấn', icon: HiCalendar },
        { key: 'availability', label: 'Lịch trống', icon: HiInbox },
        { key: 'reviews', label: 'Đánh giá', icon: HiStar },
        { key: 'messages', label: 'Tin nhắn', icon: HiInbox },
        { key: 'video', label: 'Gọi video', icon: HiVideoCamera }
    ];

    const clientMenuItems = [
        { key: 'overview', label: 'Tổng quan', icon: HiChartPie },
        { key: 'inquiries', label: 'Yêu cầu tư vấn', icon: HiUserGroup },
        { key: 'cases', label: 'Vụ việc của tôi', icon: HiViewGrid },
        { key: 'consultations', label: 'Lịch tư vấn', icon: HiCalendar },
        { key: 'messages', label: 'Tin nhắn', icon: HiInbox },
        { key: 'payments', label: 'Thanh toán', icon: HiCurrencyDollar },
        { key: 'reviews', label: 'Đánh giá của tôi', icon: HiStar },
        { key: 'video', label: 'Gọi video', icon: HiVideoCamera }
    ];

    const adminMenuItems = [
        { key: 'overview', label: 'Tổng quan', icon: HiChartPie },
        { key: 'users', label: 'Người dùng', icon: HiUserGroup },
        { key: 'lawyers', label: 'Duyệt luật sư', icon: HiCollection },
        { key: 'transactions', label: 'Giao dịch', icon: HiViewGrid },
        { key: 'payouts', label: 'Quyết toán', icon: HiCurrencyDollar },
        { key: 'quality', label: 'Đánh giá & Issue', icon: HiStar },
        { key: 'inquiries', label: 'Yêu cầu tư vấn', icon: HiChatAlt }
    ];

    const menuItems = role === 'lawyer' ? lawyerMenuItems : (role === 'admin' ? adminMenuItems : clientMenuItems);
    const profilePath = role === 'lawyer' ? '/lawyer/profile' : (role === 'admin' ? '/admin/profile' : '/client/profile');

    return (
        <aside
            className="fixed left-0 z-40 w-64 overflow-hidden border-r border-slate-800/40 bg-[linear-gradient(180deg,#061f3f_0%,#0a2950_60%,#071b35_100%)] text-slate-100 shadow-[20px_0_60px_-35px_rgba(15,23,42,0.45)] transition-all duration-300"
            style={{ top: '140px', height: 'calc(100vh - 140px)' }}
            aria-label="Sidebar"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(241,177,54,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_28%)]" />

            <div className="relative flex h-full flex-col overflow-y-auto px-4 py-8 pb-40">
                {/* Minimalist Header */}
                <div className="mb-8 px-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,179,1,0.6)]"></span>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500/80">Hệ thống Hiểu Luật</span>
                    </div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">Bảng điều khiển</h2>
                </div>

                <div className="mb-4 px-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500/70">Điều hướng chính</h2>
                </div>

                <ul className="space-y-1.5 font-medium">
                    {menuItems.map((item) => (
                        <li key={item.key}>
                            <button
                                type="button"
                                onClick={() => setActiveTab(item.key)}
                                className={`group flex w-full items-center rounded-2xl px-3 py-3 text-sm transition ${activeTab === item.key
                                    ? 'bg-white text-slate-900 shadow-[0_12px_32px_-24px_rgba(255,255,255,0.95)]'
                                    : 'text-slate-200/90 hover:bg-white/8 hover:text-white'
                                    }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 transition ${activeTab === item.key ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-100'
                                        }`}
                                />
                                <span className="ml-3 flex-1 whitespace-nowrap text-left">{item.label}</span>
                                {item.key === 'messages' && unreadMessagesCount > 0 && (
                                    <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white shadow-lg animate-pulse">
                                        {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 px-2">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Tiện ích</h2>
                </div>

                <ul className="mt-2 space-y-1.5 font-medium">
                    <li>
                        <button
                            type="button"
                            onClick={() => {
                                if (role === 'lawyer') {
                                    navigate(profilePath);
                                } else {
                                    setActiveTab('profile');
                                }
                            }}
                            className={`group flex w-full items-center rounded-2xl px-3 py-3 text-sm transition ${activeTab === 'profile'
                                ? 'bg-white text-slate-900 shadow-[0_12px_32px_-24px_rgba(255,255,255,0.95)]'
                                : 'text-slate-200/90 hover:bg-white/8 hover:text-white'
                                }`}
                        >
                            <HiUserGroup className={`h-5 w-5 transition ${activeTab === 'profile' ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-100'
                                }`} />
                            <span className="ml-3 flex-1 whitespace-nowrap text-left">Hồ sơ cá nhân</span>
                        </button>
                    </li>
                </ul>

                <div className="mt-auto rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur">
                    <button
                        type="button"
                        onClick={logout}
                        className="group flex w-full items-center rounded-2xl px-3 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10 hover:text-white"
                    >
                        <HiLogout className="h-5 w-5 text-rose-300 transition group-hover:text-white" />
                        <span className="ml-3 flex-1 whitespace-nowrap text-left">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
