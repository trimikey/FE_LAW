import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  MdHome,
  MdAccountCircle,
  MdKeyboardArrowDown,
  MdPhoneInTalk,
  MdEmail,
  MdSearch
} from 'react-icons/md';
import { FaFacebookF, FaTiktok } from 'react-icons/fa';
import { HiBell, HiChatAlt, HiInformationCircle } from 'react-icons/hi';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SOCKET_ENDPOINT } from '../../utils/chatEndpoint';
import logo from '../../assets/Logo_Hieuluat2-removebg-preview.png';

const HomeNavbar = ({ scrolled, isDashboard }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [showLawyerDropdown, setShowLawyerDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dismissedOverdueCount, setDismissedOverdueCount] = useState(() => {
    return parseInt(localStorage.getItem('dismissed_overdue_count') || '0', 10);
  });
  const [dismissedUnreadCount, setDismissedUnreadCount] = useState(() => {
    return parseInt(localStorage.getItem('dismissed_unread_count') || '0', 10);
  });
  const socketRef = useRef(null);

  const isClient = useMemo(() => user?.role_name === 'client', [user?.role_name]);
  const isLawyer = useMemo(() => user?.role_name === 'lawyer', [user?.role_name]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !isClient) {
      setUnreadCount(0);
      return;
    }

    let mounted = true;

    const fetchUnread = async () => {
      try {
        const res = await api.get('/messages/conversations');
        const conversations = res.data?.data || [];
        const total = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        if (mounted) setUnreadCount(total);
      } catch {
        // silent
      }
    };

    const fetchStats = async () => {
      try {
        const endpoint = isClient ? '/client/dashboard/stats' : isLawyer ? '/lawyer/dashboard/stats' : null;
        if (!endpoint) return;

        const res = await api.get(endpoint);
        const stats = res.data?.data;
        if (mounted) {
          setOverdueCount(stats?.consultations?.overdue || 0);
        }
      } catch {
        // silent
      }
    };

    fetchUnread();
    fetchStats();
    const intervalId = setInterval(() => {
      fetchUnread();
      fetchStats();
    }, 15000);

    socketRef.current = io(SOCKET_ENDPOINT);
    socketRef.current.emit('join_room', user.id);
    socketRef.current.on('receive_message', (message) => {
      if (message?.receiver_id !== user.id || message?.sender_id === user.id) return;

      setUnreadCount((prev) => prev + 1);
      toast('Luật sư vừa gửi tin nhắn mới', { icon: '💬' });

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Tin nhắn mới từ luật sư', {
          body: message.content || 'Bạn có tin nhắn mới'
        });
      }
    });

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => { });
    }

    return () => {
      mounted = false;
      clearInterval(intervalId);
      socketRef.current?.off('receive_message');
      socketRef.current?.disconnect();
    };
  }, [isAuthenticated, user?.id, isClient]);

  const handleToggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    // If opening, mark current counts as "dismissed" for the badge
    if (nextState) {
      if (overdueCount > 0) {
        setDismissedOverdueCount(overdueCount);
        localStorage.setItem('dismissed_overdue_count', overdueCount.toString());
      }
      if (unreadCount > 0) {
        setDismissedUnreadCount(unreadCount);
        localStorage.setItem('dismissed_unread_count', unreadCount.toString());
      }
    }
  };

  const effectiveOverdueCount = Math.max(0, overdueCount - dismissedOverdueCount);
  const effectiveUnreadCount = Math.max(0, unreadCount - dismissedUnreadCount);
  const displayBadgeCount = effectiveUnreadCount + effectiveOverdueCount;

  // Cleanup: if actual counts are 0, reset dismissed state
  useEffect(() => {
    if (overdueCount === 0 && dismissedOverdueCount !== 0) {
      setDismissedOverdueCount(0);
      localStorage.setItem('dismissed_overdue_count', '0');
    }
    if (unreadCount === 0 && dismissedUnreadCount !== 0) {
      setDismissedUnreadCount(0);
      localStorage.setItem('dismissed_unread_count', '0');
    }
  }, [overdueCount, dismissedOverdueCount, unreadCount, dismissedUnreadCount]);

  return (
    <header className="fixed top-0 z-50 w-full transition-all duration-300">
      {!scrolled && (
        <div className="bg-[#061f3f] text-white text-[12px] py-2.5 overflow-hidden border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center gap-2">
                <MdPhoneInTalk className="text-[#f1b136]" size={16} />
                <span>(+84) 0938 744 798</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MdEmail className="text-[#f1b136]" size={16} />
                <span>HieuLuat@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-100">
              <div className="relative group hidden sm:block">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="w-32 rounded-md border border-white/20 bg-white/10 px-3 py-1 pr-8 text-xs transition-all focus:w-44 focus:border-[#f1b136] focus:bg-white/15 focus:outline-none"
                />
                <MdSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 group-hover:text-[#f1b136]" size={16} />
              </div>
              <a href="https://www.facebook.com/share/18Ldbbv8tY/?mibextid=wwXIfr" className="transition-colors hover:text-[#f1b136]"><FaFacebookF size={12} /></a>
              <a href="https://www.tiktok.com/@hieuluat" className="transition-colors hover:text-[#f1b136]"><FaTiktok size={12} /></a>
            </div>
          </div>
        </div>
      )}

      <nav className={`transition-all duration-300 ease-in-out ${scrolled ? 'h-16 border-b border-slate-200/70 bg-white/95 shadow-lg backdrop-blur' : 'h-20 bg-[#f1b136] shadow-md'}`}>
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link to="/" className={`transition-all duration-300 ${scrolled ? 'rounded-xl bg-white p-1.5' : 'rounded-xl bg-white p-2 shadow-sm'}`}>
            <img src={logo} alt="Hiểu Luật" className={`w-auto transition-all duration-300 ${scrolled ? 'h-11' : 'h-16'}`} />
          </Link>

          <div className={`hidden items-center space-x-6 font-bold uppercase tracking-tight lg:flex ${scrolled ? 'text-[14px] text-[#0a2447]' : 'text-[15px] text-white'}`}>
            <Link to="/" className="flex items-center gap-1 transition-colors hover:text-amber-100">
              <MdHome size={20} className="mb-0.5" /> Trang chủ
            </Link>
            <Link to="/about" className="transition-colors hover:text-amber-100">Về chúng tôi</Link>
            <Link to="/lawyer" className="transition-colors hover:text-amber-100">Tiện ích</Link>

            {isLawyer && (
              <div className="relative flex h-full items-center" onMouseEnter={() => setShowLawyerDropdown(true)} onMouseLeave={() => setShowLawyerDropdown(false)}>
                <button className={`flex items-center gap-1 py-2 transition-all ${showLawyerDropdown ? 'opacity-80 underline underline-offset-4' : ''}`}>
                  Dành cho luật sư
                  <MdKeyboardArrowDown />
                </button>
                {showLawyerDropdown && (
                  <div className="absolute left-0 top-full w-64 rounded-2xl border border-slate-200 bg-white py-4 text-xs shadow-2xl">
                    <div className="space-y-3 px-6 text-left">
                      <Link to="/lawyer/profile" className="block font-bold uppercase text-[#0a2447] hover:text-[#123d78]">Cập nhật hồ sơ luật sư</Link>
                      <Link to="/dashboard" className="block font-bold uppercase text-[#0a2447] hover:text-[#123d78]">Mở bảng điều khiển</Link>
                      <button onClick={logout} className="block w-full text-left font-bold uppercase text-[#0a2447] hover:text-[#123d78]">Đăng xuất</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isClient && (
              <div className="relative flex h-full items-center" onMouseEnter={() => setShowClientDropdown(true)} onMouseLeave={() => setShowClientDropdown(false)}>
                <button className={`flex items-center gap-1 py-2 transition-all ${showClientDropdown ? 'opacity-80 underline underline-offset-4' : ''}`}>
                  Dành cho khách hàng
                  <MdKeyboardArrowDown />
                </button>
                {showClientDropdown && (
                  <div className="absolute left-0 top-full w-64 rounded-2xl border border-slate-200 bg-white py-4 text-xs shadow-2xl">
                    <div className="space-y-3 px-6 text-left">
                      <Link to="/dashboard" className="block font-bold uppercase text-[#0a2447] hover:text-[#123d78]">Quản lý hồ sơ cá nhân</Link>
                      <Link to="/dashboard" className="block font-bold uppercase text-[#0a2447] hover:text-[#123d78]">Theo dõi tin nhắn và lịch tư vấn</Link>
                      <button onClick={logout} className="block w-full text-left font-bold uppercase text-[#0a2447] hover:text-[#123d78]">Đăng xuất</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link to="/contact" className={`flex items-center rounded-full px-6 py-2.5 transition-all duration-300 ${scrolled ? 'bg-[#f1b136] text-white shadow-sm hover:bg-[#de9d1f]' : 'border border-white/25 bg-white/10 hover:bg-white/15'}`}>
              Liên hệ
            </Link>
          </div>

          <div className="flex items-center space-x-6">


            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <button
                    onClick={handleToggleNotifications}
                    className={`relative flex items-center p-1 transition-all hover:scale-110 ${scrolled ? 'text-[#001a35]' : 'text-white'}`}
                    title="Thông báo"
                  >
                    <HiBell size={scrolled ? 24 : 28} />
                    {displayBadgeCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full border border-white bg-rose-500 text-[8px] font-black text-white">
                        {displayBadgeCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 mt-4 w-72 sm:w-80 transform rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Notification content stays same */}
                        <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-3">
                          <h3 className="text-sm font-black text-[#041837] uppercase tracking-tight">Thông báo quan trọng</h3>
                          <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[8px] font-black uppercase text-amber-600 tracking-widest">Mới</span>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {overdueCount > 0 && (
                            <Link to="/dashboard?tab=consultations" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-amber-50 bg-amber-50/30 border border-amber-100/50">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><HiInformationCircle size={18} /></div>
                              <div className="flex-1 text-left">
                                <p className="text-[11px] font-black text-[#041837] uppercase leading-tight">Lịch tư vấn trễ hạn</p>
                                <p className="mt-1 text-[10px] font-bold text-slate-500">Bạn có {overdueCount} hồ sơ</p>
                              </div>
                            </Link>
                          )}
                          {unreadCount > 0 && (
                            <Link to="/dashboard?tab=messages" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-blue-50 bg-blue-50/30 border border-blue-100/50">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><HiChatAlt size={18} /></div>
                              <div className="flex-1 text-left">
                                <p className="text-[11px] font-black text-[#041837] uppercase leading-tight">Tin nhắn mới</p>
                                <p className="mt-1 text-[10px] font-bold text-slate-500">Bạn có {unreadCount} phản hồi</p>
                              </div>
                            </Link>
                          )}
                          {!overdueCount && !unreadCount && <div className="py-8 text-center text-[9px] font-black text-slate-300 uppercase">Trống</div>}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Link to="/dashboard" className={`relative flex items-center p-1 transition-colors ${scrolled ? 'text-[#001a35]' : 'text-white'}`}>
                  <MdAccountCircle size={scrolled ? 28 : 32} />
                </Link>

                {/* Sandwich Button for Mobile */}
                {!isDashboard && (
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`lg:hidden p-1.5 rounded-lg border transition-all ${scrolled ? 'border-slate-200 text-[#001630]' : 'border-white/30 text-white'}`}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={`text-[13px] font-bold uppercase transition-colors ${scrolled ? 'text-[#001a35]' : 'text-white'}`}>
                  Đăng nhập
                </Link>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`lg:hidden p-1.5 rounded-lg border transition-all ${scrolled ? 'border-slate-200 text-[#001630]' : 'border-white/30 text-white'}`}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div className={`fixed inset-0 z-[60] transform bg-black/50 transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
          <div className={`absolute right-0 top-0 h-full w-[280px] bg-white p-8 shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-sm font-black text-[#041837] uppercase tracking-widest">Danh mục</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-rose-500"><svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <div className="flex flex-col space-y-4 font-bold text-slate-600 uppercase tracking-tight text-xs">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#f1b136] flex items-center gap-2"><MdHome size={18} /> Trang chủ</Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-[#f1b136]">Về chúng tôi</Link>
                <Link to="/lawyer" onClick={() => setIsMenuOpen(false)} className="hover:text-[#f1b136]">Tiện ích tìm kiếm</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#f1b136]">Liên hệ</Link>

                {isLawyer && (
                  <>
                    <div className="h-px bg-slate-100 my-2" />
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-amber-600">Bảng điều khiển Luật sư</Link>
                    <Link to="/lawyer/profile" onClick={() => setIsMenuOpen(false)}>Hồ sơ luật sư</Link>
                  </>
                )}

                {isClient && (
                  <>
                    <div className="h-px bg-slate-100 my-2" />
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-amber-600">Bảng điều khiển cá nhân</Link>
                  </>
                )}

                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-rose-500 mt-4">Đăng xuất</button>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-[#f1b136] text-white text-center py-3 rounded-xl mt-4">Đăng nhập ngay</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HomeNavbar;
