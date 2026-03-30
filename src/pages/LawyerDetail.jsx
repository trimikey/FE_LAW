import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BannerSection from '../components/home/search_lawyer/BannerSection';
import ChatBox from '../components/chat/ChatBox';
import { useAuth } from '../contexts/AuthContext';
import { getLawyer } from '../services/api/lawyer.api';
import api from '../services/api';
import { HiPhone, HiUserGroup, HiVideoCamera, HiIdentification, HiAcademicCap, HiTranslate, HiCurrencyDollar, HiCheckCircle, HiChevronLeft, HiChevronRight, HiX, HiCalendar, HiShieldCheck, HiOfficeBuilding, HiStar } from 'react-icons/hi';
import { resolveAvatarUrl } from '../utils/avatar';
import { useVideoCall } from '../contexts/VideoCallContext';

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const pad = (value) => String(value).padStart(2, '0');
const getLocalDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const startOfLocalDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endOfLocalDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const sameLocalDate = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getConsultationTypeIcon = (type) => {
  if (type === 'video') return HiVideoCamera;
  if (type === 'phone') return HiPhone;
  return HiUserGroup;
};

const getTimePeriodLabel = (slot) => {
  const hour = new Date(slot.segmentStart || slot.start_time).getHours();
  return hour < 12 ? 'Buổi sáng' : 'Buổi chiều';
};

const CalendarModal = ({
  open,
  onClose,
  selectedDate,
  onSelectDate,
  onSelectSlot,
  monthDate,
  onMonthChange,
  slotsByDate
}) => {
  if (!open) return null;

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);

  const cells = Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const selectedKey = selectedDate ? getLocalDateKey(selectedDate) : '';
  const slotList = selectedKey ? slotsByDate.get(selectedKey) || [] : [];
  const groupedSlots = slotList.reduce((acc, slot) => {
    const period = getTimePeriodLabel(slot);
    if (!acc[period]) acc[period] = [];
    acc[period].push(slot);
    return acc;
  }, {});
  const slotSections = [
    { key: 'Buổi sáng', slots: groupedSlots['Buổi sáng'] || [] },
    { key: 'Buổi chiều', slots: groupedSlots['Buổi chiều'] || [] }
  ].filter((section) => section.slots.length > 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041837]/60 p-0 md:p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full h-full md:h-auto md:max-w-6xl overflow-hidden md:rounded-[48px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col">
        <div className="flex items-center justify-between bg-[#041837] p-6 md:p-8 text-white relative overflow-hidden shrink-0">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10">
            <HiCalendar className="h-16 w-16 md:h-32 md:w-32" />
          </div>
          <div className="relative z-10">
            <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] mb-1 md:mb-2 block">Booking System</span>
            <h3 className="text-xl md:text-3xl font-black tracking-tight uppercase">Lịch làm việc</h3>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-amber-500 hover:text-[#041837] transition-all transform hover:rotate-90"
          >
            <HiX className="h-6 w-6 md:h-8 md:h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 md:gap-12 p-6 md:p-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xl font-black text-[#041837] tracking-tight uppercase">Chọn ngày tư vấn</h4>
                <div className="flex items-center gap-3">
                  <button onClick={() => onMonthChange(-1)} className="h-12 w-12 rounded-xl border border-slate-100 flex items-center justify-center text-[#041837] hover:bg-slate-50 shadow-sm transition-all group">
                    <HiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <span className="text-sm font-black text-[#041837] uppercase tracking-widest min-w-[140px] text-center">
                    {monthDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => onMonthChange(1)} className="h-12 w-12 rounded-xl border border-slate-100 flex items-center justify-center text-[#041837] hover:bg-slate-50 shadow-sm transition-all group">
                    <HiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[32px] p-6 border border-slate-100">
                <div className="mb-4 grid grid-cols-7 gap-1 text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">
                  {DAYS.map((day) => <div key={day} className="py-2">{day}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {cells.map((day) => {
                    const dayKey = getLocalDateKey(day);
                    const inMonth = day.getMonth() === month;
                    const isSelected = selectedKey === dayKey;
                    const hasSlot = (slotsByDate.get(dayKey) || []).length > 0;

                    return (
                      <button
                        key={dayKey}
                        onClick={() => onSelectDate(day)}
                        className={`h-12 w-full rounded-2xl text-xs font-black transition-all border-2 flex items-center justify-center relative overflow-hidden group
                        ${isSelected ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/20 scale-[1.05] z-10' :
                            hasSlot ? 'bg-white border-blue-50 text-[#041837] hover:border-amber-500' :
                              'bg-transparent border-transparent text-slate-200 cursor-not-allowed'}
                        ${!inMonth ? 'opacity-20' : 'opacity-100'}`}
                        disabled={!inMonth && !hasSlot}
                      >
                        {day.getDate()}
                        {hasSlot && !isSelected && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <HiShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Thông tin quan trọng</p>
                    <p className="text-xs font-bold text-[#041837] mt-1">Lịch tư vấn được mã hóa và xác nhận tức thì qua SMS/Email.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full bg-slate-50 rounded-[40px] p-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <HiVideoCamera size={200} />
              </div>
              <h4 className="relative z-10 mb-8 text-xl font-black text-[#041837] tracking-tight uppercase">Khung giờ khả dụng</h4>

              <div className="relative z-10 flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar max-h-[480px]">
                {!selectedDate ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-20">
                    <div className="h-24 w-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-slate-100 mb-6">
                      <HiCalendar size={48} />
                    </div>
                    <p className="text-sm font-black text-[#041837] uppercase tracking-widest px-8">Vui lòng chọn ngày phía bên trái để xem giờ trống</p>
                  </div>
                ) : slotList.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-20">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Rất tiếc, ngày này hiện chưa có lịch trống khả dụng</p>
                  </div>
                ) : (
                  <div className="space-y-10 pb-8">
                    {slotSections.map((section) => (
                      <div key={section.key}>
                        <div className="mb-6 flex items-center justify-between">
                          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 flex items-center gap-2">
                            <span className="block h-1 w-6 bg-amber-500 rounded-full" />
                            {section.key}
                          </h6>
                          <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-50 uppercase tracking-widest">
                            {section.slots.length} PHIÊN TRỐNG
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {section.slots.map((slot) => {
                            const TypeIcon = getConsultationTypeIcon(slot.consultation_type);
                            return (
                              <div key={slot.id} className="group flex items-center justify-between rounded-[24px] bg-white p-5 shadow-sm border-2 border-transparent hover:border-amber-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
                                <div className="flex items-center gap-5">
                                  <div className={`rounded-2xl p-4 transition-colors ${slot.consultation_type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <TypeIcon className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="text-lg font-black text-[#041837] tracking-tight">
                                      {slot.segmentStartLabel || new Date(slot.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                      {slot.segmentEndLabel ? ' - ' + slot.segmentEndLabel : ''}
                                    </p>
                                    <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-500">
                                      {slot.consultation_type === 'video' ? 'Video Conference' : slot.consultation_type === 'phone' ? 'Direct Call' : 'Offline Meeting'}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    onSelectSlot?.(slot);
                                    onClose();
                                  }}
                                  className="h-12 px-8 rounded-xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#041837] transition-all transform active:scale-95 shadow-lg shadow-blue-500/10"
                                >
                                  LỰA CHỌN
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const CheckoutModal = ({ open, onClose, lawyer, selectedSlot, onConfirm, loading, consultationFee }) => {
  if (!open) return null;

  const benefits = [
    { title: '60 phút tư vấn chuyên sâu', desc: 'Giải quyết triệt để các vấn đề pháp lý của bạn.' },
    { title: 'Bảo mật tuyệt đối', desc: 'Mọi thông tin trao đổi đều được mã hóa và bảo mật 100%.' },
    { title: 'Luật sư thực thụ', desc: 'Làm việc trực tiếp với Luật sư có chứng chỉ hành nghề xác thực.' },
    { title: 'Tiết kiệm thời gian', desc: 'Tư vấn mọi lúc mọi nơi qua Video Call cao cấp.' }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#041837]/80 p-4 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="w-full max-w-2xl overflow-hidden rounded-[48px] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100">
        <div className="bg-[#041837] p-10 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Thanh toán dịch vụ</p>
            <h3 className="text-3xl font-black tracking-tight uppercase">Xác nhận đặt lịch tư vấn</h3>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-4">Chi tiết hóa đơn</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Luật sư phụ trách</p>
                  <p className="text-sm font-black text-[#041837] uppercase">{lawyer?.user?.full_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Thời gian tư vấn</p>
                  <p className="text-sm font-black text-amber-600">
                    {selectedSlot ? (
                      `${new Date(selectedSlot.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(selectedSlot.start_time).toLocaleDateString('vi-VN')}`
                    ) : (
                      'Chưa chọn khung giờ'
                    )}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Tổng cộng thanh toán</p>
                  <p className="text-3xl font-black text-[#041837]">{consultationFee?.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-4">Quyền lợi của bạn</h4>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-3">
                    <HiCheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-[#041837] uppercase tracking-tight">{b.title}</p>
                      <p className="text-[9px] text-slate-400 font-medium leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-500 rounded-2xl flex items-center justify-center text-[#041837] shadow-lg shadow-amber-500/20">
              <HiShieldCheck size={28} />
            </div>
            <p className="text-[10px] font-bold text-[#041837] leading-relaxed italic">
              * Hệ thống sử dụng cổng thanh toán VietQR (PayOS) đảm bảo an toàn & kích hoạt lịch tư vấn ngay lập tức.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-16 rounded-[20px] bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-[2] h-16 rounded-[20px] bg-[#041837] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 hover:bg-black active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {loading ? 'ĐANG XỬ LÝ...' : `XÁC NHẬN THANH TOÁN • ${Math.round(consultationFee / 1000)}K`}
              <HiChevronRight className="h-4 w-4 text-amber-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LawyerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { startCall } = useVideoCall();

  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [slots, setSlots] = useState([]);
  const [buying, setBuying] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [quotaLoading, setQuotaLoading] = useState(false);

  const isClient = user?.role_name === 'client';
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getLawyer(id);
        const data = res.data?.data?.lawyer || res.data?.data || null;
        setLawyer(data);
      } catch (error) {
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  useEffect(() => {
    const lawyerUserId = Number(lawyer?.user_id || 0);
    if (!isAuthenticated || !isClient || !lawyerUserId) return;

    const run = async () => {
      try {
        const res = await api.get(`/client/lawyers/${lawyerUserId}/availability`);
        setSlots(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        setSlots([]);
      }
    };
    run();
  }, [isAuthenticated, isClient, lawyer?.user_id]);

  useEffect(() => {
    if (!isAuthenticated || !isClient || !lawyer?.user_id) return;
    const run = async () => {
      setQuotaLoading(true);
      try {
        const res = await api.get(`/messages/video-call/quota/${lawyer.user_id}`);
        if (res.data?.success) setQuotaInfo(res.data.data);
      } catch (error) { } finally { setQuotaLoading(false); }
    };
    run();
  }, [isAuthenticated, isClient, lawyer?.user_id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!isClient) {
      toast.error('Chỉ khách hàng mới có quyền bình luận');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post(`/client/lawyers/${id}/reviews`, {
        rating,
        comment: commentText
      });

      if (res.data.success) {
        toast.success('Gửi bình luận thành công!');
        setCommentText('');
        setRating(5);
        // Cập nhật lại danh sách review cục bộ
        const newReview = res.data.data;
        setLawyer(prev => {
          const newCount = prev.review_count + 1;
          const newRating = (prev.rating * prev.review_count + rating) / newCount;
          return {
            ...prev,
            rating: Math.round(newRating * 10) / 10,
            review_count: newCount,
            user: {
              ...prev.user,
              receivedReviews: [newReview, ...(prev.user?.receivedReviews || [])]
            }
          };
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialties = useMemo(() => {
    if (!lawyer?.specialties) return [];
    if (Array.isArray(lawyer.specialties)) return lawyer.specialties;
    try {
      const parsed = JSON.parse(lawyer.specialties);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return String(lawyer.specialties).split(',').map((x) => x.trim()).filter(Boolean);
    }
  }, [lawyer?.specialties]);

  const sortedSlots = useMemo(() => {
    return [...slots].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [slots]);

  const slotsByDate = useMemo(() => {
    const m = new Map();
    sortedSlots.forEach((slot) => {
      const start = new Date(slot.start_time);
      const end = new Date(slot.end_time);
      let cursor = startOfLocalDay(start);
      const lastDay = startOfLocalDay(end);
      while (cursor <= lastDay) {
        const dayKey = getLocalDateKey(cursor);
        const dayStart = startOfLocalDay(cursor);
        const dayEnd = endOfLocalDay(cursor);
        const segmentStart = sameLocalDate(cursor, start) ? start : dayStart;
        const segmentEnd = sameLocalDate(cursor, end) ? end : dayEnd;
        if (!m.has(dayKey)) m.set(dayKey, []);
        m.get(dayKey).push({
          ...slot,
          dayKey,
          segmentStart,
          segmentEnd,
          segmentStartLabel: sameLocalDate(segmentStart, dayStart) && !sameLocalDate(start, end) ? '00:00' : segmentStart.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          segmentEndLabel: sameLocalDate(segmentEnd, dayEnd) && !sameLocalDate(start, end) ? '23:59' : segmentEnd.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        });
        cursor = addDays(cursor, 1);
      }
    });
    return m;
  }, [sortedSlots]);

  const quickSlots = useMemo(() => sortedSlots.slice(0, 3), [sortedSlots]);
  const nextAvailableDateText = useMemo(() => {
    if (quickSlots.length === 0) return 'CHƯA CẬP NHẬT';
    const first = new Date(quickSlots[0].start_time);
    return first.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }, [quickSlots]);
  const consultationFee = Number(lawyer?.consultation_fee || 0);

  const purchaseVideoPackage = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!isClient) { toast.error('Chỉ tài khoản khách hàng mới đặt lịch tư vấn.'); return; }

    if (!selectedSlotId) {
      toast.error('Vui lòng chọn một khung giờ tư vấn trước khi tiếp tục.');
      // Scroll to booking section for better UX
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        setShowCalendar(true);
      }
      return;
    }

    // If we haven't shown checkout yet, show it
    if (!showCheckout) {
      setShowCheckout(true);
      return;
    }

    try {
      setBuying(true);
      localStorage.setItem('payos_return_path', window.location.pathname);
      const res = await api.post(`/messages/video-call/purchase/${lawyer.user_id}`, {
        paymentMethod: 'payos',
        slotId: selectedSlotId
      });
      const payUrl = res.data?.data?.payUrl;
      if (!payUrl) throw new Error('Không tạo được liên kết thanh toán VietQR');
      window.location.href = payUrl;
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Mua gói thất bại');
    } finally {
      setBuying(false);
      setShowCheckout(false);
    }
  };

  const getLicenseUrl = (path) => {
    if (!path) return null;
    const parts = String(path).split(/[\\/]/);
    const uploadIndex = parts.indexOf('uploads');
    if (uploadIndex !== -1) return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}/${parts.slice(uploadIndex).join('/')}`;
    return path;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-16 h-16 rounded-[24px] bg-[#041837] flex items-center justify-center animate-bounce shadow-2xl">
        <HiCheckCircle className="h-8 w-8 text-amber-500" />
      </div>
      <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Đang định danh Luật sư...</p>
    </div>
  );

  const licenseUrl = getLicenseUrl(lawyer.license_file);
  const paidSeconds = Number(quotaInfo?.paidRemainingSeconds || 0);
  const paidHours = Math.floor(paidSeconds / 3600);
  const paidMinutes = Math.floor((paidSeconds % 3600) / 60);


  return (
    <div className="bg-[#f8f9fb] min-h-screen pb-24 font-sans animate-in fade-in duration-1000">
      <BannerSection />

      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
        <button onClick={() => navigate('/lawyer')} className="mb-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-600 transition-colors">
          <HiChevronLeft className="h-4 w-4" /> QUAY LẠI KHO LUẬT SƯ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
          {/* Main Info */}
          <section className="space-y-10">
            <div className="bg-white rounded-3xl md:rounded-[48px] border border-slate-100 overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.1)]">
              <div className="h-40 md:h-64 bg-[#041837] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-amber-500/10" />
                <div className="absolute top-0 right-0 p-10 md:p-20 opacity-10 transform scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
                  <HiIdentification className="h-40 w-40 md:h-80 md:w-80 text-white" />
                </div>
              </div>
              <div className="px-6 md:px-10 pb-10 md:pb-12 -mt-16 md:-mt-24 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                  <div className="relative group mx-auto md:mx-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl md:rounded-[40px] border-[6px] md:border-[10px] border-white shadow-2xl overflow-hidden bg-slate-100">
                      <img
                        src={resolveAvatarUrl(lawyer.user?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.user?.full_name || 'Lawyer')}&background=random`}
                        alt={lawyer.user?.full_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.user?.full_name || 'Lawyer')}&background=041837&color=fff`;
                        }}
                      />
                    </div>
                    {lawyer.is_verified && (
                      <div className="absolute -bottom-2 -right-2 h-14 w-14 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
                        <HiCheckCircle size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block py-10">Xác thực bởi tư pháp</span>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight mb-2 uppercase break-all lg:break-normal lg:whitespace-nowrap">{lawyer.user?.full_name}</h1>
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <HiOfficeBuilding className="h-5 w-5 text-amber-500" />
                      {lawyer.law_firm || 'CHƯA CẬP NHẬT TRỤ SỞ'}
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <span className="h-1 w-6 bg-amber-500 rounded-full" /> TIỂU SỬ NGHIỆP VỤ
                  </h3>
                  <p className="text-lg leading-relaxed text-slate-600 font-medium">
                    {lawyer.bio || 'Tôi là luật sư chuyên cung cấp các giải pháp pháp lý tối ưu cho khách hàng trong các lĩnh vực Dân sự, Hình sự và Doanh nghiệp.'}
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {specialties.length > 0 ? (
                    specialties.map((tag) => (
                      <span key={tag} className="px-6 py-2.5 rounded-full bg-slate-50 text-slate-800 border-2 border-slate-100 text-xs font-semibold uppercase tracking-widest hover:border-amber-500 transition-colors cursor-default">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-300 font-bold uppercase text-xs tracking-widest">Chưa công bố chuyên môn đặc thù</span>
                  )}
                </div>

                <div className="mt-12 flex flex-wrap gap-5 py-8 border-t border-slate-50">
                  <button
                    onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } setShowChat(true); }}
                    className="h-16 px-12 rounded-[24px] bg-slate-900 text-white text-xs font-bold uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/30 hover:bg-black active:scale-95 transition-all flex items-center gap-3"
                  >
                    <HiTranslate size={20} className="text-amber-500" /> NHẮN TIN TRỰC TIẾP
                  </button>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="h-16 px-10 rounded-[24px] border-2 border-slate-100 text-slate-800 text-xs font-bold uppercase tracking-[0.3em] hover:border-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm flex items-center gap-3"
                  >
                    <HiCalendar size={20} /> LỊCH TRỐNG KHẢ DỤNG
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Tabs/Details */}
            <div className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-sm space-y-10">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight uppercase border-l-4 border-amber-500 pl-6">Thông số định danh nghiệp vụ</h2>
              <div className="grid sm:grid-cols-2 gap-8 text-slate-800">
                <div className="rounded-[32px] border-2 border-slate-50 bg-slate-50/30 p-8 shadow-inner group">
                  <div className="flex items-center gap-4 mb-4">
                    <HiAcademicCap className="h-6 w-6 text-amber-500" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Kinh nghiệm thực chiến</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{lawyer.years_of_experience || 0} <span className="text-sm">NĂM TRONG NGHỀ</span></p>
                </div>
                <div className="rounded-[32px] border-2 border-slate-50 bg-slate-50/30 p-8 shadow-inner">
                  <div className="flex items-center gap-4 mb-4">
                    <HiIdentification className="h-6 w-6 text-blue-500" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Số hiệu thẻ Luật sư</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{lawyer.bar_number || 'LS-XXXXX'}</p>
                </div>
                <div className="rounded-[32px] border-2 border-slate-50 bg-slate-50/30 p-8 shadow-inner">
                  <div className="flex items-center gap-4 mb-4">
                    <HiTranslate className="h-6 w-6 text-emerald-500" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Địa bàn hoạt động</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-800 truncate">{lawyer.address || "TOÀN QUỐC"}</p>
                </div>
                <div className="rounded-[32px] border-2 border-slate-50 bg-slate-50/30 p-8 shadow-inner">
                  <div className="flex items-center gap-4 mb-4">
                    <HiCurrencyDollar className="h-6 w-6 text-rose-500" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Phí tư vấn cơ sở</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-800 text-emerald-600">
                    {consultationFee ? consultationFee.toLocaleString('vi-VN') + ' đ' : 'THUẬN THẢO'} <span className="text-xs text-slate-400">/ 1 giờ</span>
                  </p>
                </div>
              </div>

              {licenseUrl && (
                <div className="pt-8 flex justify-center">
                  <a href={licenseUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white bg-slate-900 px-10 py-5 rounded-2xl shadow-xl shadow-blue-500/10 hover:bg-black transition-all">
                    <HiShieldCheck size={20} /> KIỂM TRA GIẤY PHÉP HÀNH NGHỀ
                  </a>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight uppercase border-l-4 border-amber-500 pl-6">Đánh giá từ khách hàng</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-amber-500">{lawyer.rating || '0.0'}</span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} className={`h-5 w-5 ${i < Math.round(lawyer.rating || 0) ? 'text-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">({lawyer.review_count || 0} đánh giá)</span>
                </div>
              </div>

              <div className="space-y-10">
                {/* Comment Form - "FB style" */}
                {isAuthenticated && isClient && (
                  <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 shadow-inner">
                    <div className="flex gap-6">
                      <img
                        src={resolveAvatarUrl(user?.avatar)}
                        alt={user?.full_name}
                        className="h-14 w-14 rounded-2xl object-cover bg-slate-200 border-2 border-white shadow-sm"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=041837&color=fff`; }}
                      />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Đánh giá của bạn:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`transition-all hover:scale-125 ${star <= rating ? 'text-amber-500' : 'text-slate-200'}`}
                              >
                                <HiStar className="h-6 w-6" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="relative group">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về luật sư này..."
                            className="w-full rounded-[24px] border-2 border-slate-100 bg-white p-6 text-sm font-medium text-[#041837] focus:border-amber-500 focus:outline-none transition-all min-h-[120px] shadow-sm resize-none"
                          />
                          <button
                            onClick={handleSubmitReview}
                            disabled={isSubmitting || !commentText.trim()}
                            className="absolute bottom-4 right-4 px-8 py-3 rounded-xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-[#041837] disabled:opacity-50 disabled:hover:bg-[#041837] disabled:hover:text-white transition-all transform active:scale-95 shadow-lg flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ĐANG GỬI...
                              </span>
                            ) : (
                              <>BÌNH LUẬN <HiChevronRight /></>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {lawyer.user?.receivedReviews && lawyer.user.receivedReviews.length > 0 ? (
                    lawyer.user.receivedReviews.map((review) => (
                      <div key={review.id} className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-amber-200">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={resolveAvatarUrl(review.clientUser?.avatar)}
                              alt={review.clientUser?.full_name}
                              className="h-12 w-12 rounded-2xl object-cover bg-slate-200"
                              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.clientUser?.full_name || 'C')}&background=041837&color=fff`; }}
                            />
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 uppercase">{review.clientUser?.full_name}</h4>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(review.created_at).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <HiStar key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-500' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                      <div className="h-16 w-16 bg-slate-100 rounded-[20px] flex items-center justify-center text-slate-300 mb-4">
                        <HiTranslate size={32} />
                      </div>
                      <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em]">Hiện chưa có phản hồi nào từ khách hàng</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Right Sidebar Booking */}
          <aside id="booking-section" className="space-y-8">
            <div className="bg-white rounded-[48px] border border-slate-100 p-8 sticky top-28 shadow-2xl shadow-blue-900/5 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <HiVideoCamera size={120} />
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-slate-800 tracking-tight uppercase mb-8">Video Consultation</h3>

              <div className="relative z-10 flex items-center justify-between p-7 rounded-[32px] bg-slate-900 text-white mb-10 shadow-2xl overflow-hidden group/call">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent translate-x-[-100%] group-hover/call:translate-x-[100%] transition-transform duration-1000" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500 mb-1">
                    Trực tuyến 1 giờ
                  </p>
                  <span className="text-3xl font-bold text-amber-500 tracking-tight">
                    {consultationFee?.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) return navigate('/login');
                    if (!isClient) return toast.error('Chỉ dành cho khách hàng');

                    const hasQuota = (Number(quotaInfo?.freeRemainingSeconds) + Number(quotaInfo?.paidRemainingSeconds)) > 0;
                    if (hasQuota) {
                      startCall({ id: lawyer.user_id, name: lawyer.user?.full_name });
                    } else {
                      purchaseVideoPackage();
                    }
                  }}
                  className="h-16 w-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-900 shadow-xl shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all relative"
                >
                  <div className="absolute inset-0 rounded-2xl bg-amber-500 animate-ping opacity-20" />
                  <HiVideoCamera size={32} />
                </button>
              </div>

              <div className="relative z-10 mb-10 space-y-4">
                <div className="p-6 rounded-[32px] border-2 border-blue-50 bg-blue-50/30">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">Hạn mức khả dụng</p>
                  {quotaLoading ? (
                    <p className="text-xs font-semibold text-slate-300 animate-pulse">CALCULATING QUOTA...</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span className="opacity-40 uppercase tracking-wider">Miễn phí:</span>
                        <span>{Math.floor(Number(quotaInfo?.freeRemainingSeconds || 0) / 60)} phút</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span className="opacity-40 uppercase tracking-wider">Đã mua:</span>
                        <span>{paidHours} giờ {paidMinutes} phút</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Lịch trống tiêu biểu</h4>
                  <span className="text-[8px] font-black px-3 py-1 bg-amber-50 text-amber-600 rounded-lg">GẦN NHẤT: {nextAvailableDateText}</span>
                </div>

                <div className="space-y-4">
                  {quickSlots.length > 0 ? (
                    quickSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full group flex items-center justify-between p-5 rounded-[24px] border-2 transition-all ${Number(selectedSlotId) === Number(slot.id)
                          ? 'border-amber-500 bg-amber-50/30'
                          : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${Number(selectedSlotId) === Number(slot.id) ? 'bg-amber-500 text-white' : 'bg-white text-slate-300 group-hover:text-amber-500'}`}>
                            {getConsultationTypeIcon(slot.consultation_type)({ className: 'h-5 w-5' })}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 tracking-tight">{new Date(slot.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                              {new Date(slot.start_time).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className={`h-6 w-6 rounded-full border-4 flex items-center justify-center transition-all ${Number(selectedSlotId) === Number(slot.id) ? 'border-amber-500 bg-amber-500' : 'border-white bg-slate-100 group-hover:border-slate-200'}`}>
                          {Number(selectedSlotId) === Number(slot.id) && <div className="h-2 w-2 rounded-full bg-white shadow-sm" />}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 rounded-[32px] border-2 border-dashed border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Không có lịch trống trong 24h tới</p>
                    </div>
                  )}
                </div>

                <button onClick={() => setShowCalendar(true)} className="w-full text-center text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors py-4">
                  DUYỆT TOÀN BỘ DANH MỤC LỊCH TRỐNG
                </button>

                <button
                  onClick={purchaseVideoPackage}
                  disabled={buying || !isClient}
                  className="w-full h-16 rounded-[28px] bg-[#041837] text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 hover:bg-black active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {buying ? 'ĐANG ĐIỀU HƯỚNG...' : `TIẾP TỤC ĐẶT LỊCH • ${Math.round(consultationFee / 1000)}K`}
                  <HiChevronRight className="h-6 w-6 text-amber-500" />
                </button>
              </div>
            </div>

            <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl flex items-center gap-5 group">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform">
                <HiShieldCheck size={28} />
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-emerald-100">Cổng thanh toán VietQR</p>
                <p className="text-xs font-bold">Kích hoạt phiên gọi tự động sau 3.5 giây nhận tiền.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CalendarModal
        open={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
        onSelectSlot={(slot) => setSelectedSlotId(slot.id)}
        monthDate={calendarMonth}
        onMonthChange={(step) => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + step, 1))}
        slotsByDate={slotsByDate}
      />

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        lawyer={lawyer}
        selectedSlot={slots.find(s => Number(s.id) === Number(selectedSlotId))}
        onConfirm={purchaseVideoPackage}
        loading={buying}
        consultationFee={consultationFee}
      />

      {showChat && (
        <ChatBox
          partnerId={lawyer.user_id}
          partnerName={lawyer.user?.full_name || 'Luật sư'}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default LawyerDetail;
