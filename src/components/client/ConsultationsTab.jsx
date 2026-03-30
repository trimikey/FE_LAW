import { useMemo, useState } from 'react';
import {
  HiCalendar,
  HiClock,
  HiUser,
  HiChevronRight,
  HiFilter,
  HiPlus,
  HiOutlineDocumentText,
  HiExternalLink,
  HiChevronLeft,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalendar,
  HiStar,
  HiX
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { resolveAvatarUrl } from '../../utils/avatar';
import defaultAvatar from '../../assets/default_lawyer_avatar.png';

const SummaryCard = ({ consultations }) => {
  const stats = useMemo(() => {
    const total = consultations.length;
    const completed = consultations.filter(c => ['completed', 'confirmed', 'in_progress'].includes(c.status)).length;
    const pending = consultations.filter(c => c.status === 'pending').length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, pending, percent };
  }, [consultations]);

  const currentMonth = new Date().toLocaleString('vi-VN', { month: '2-digit' });

  return (
    <div className="bg-[#0c2144] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] transform group-hover:scale-110 transition-transform">
        <HiCalendar size={120} />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-black mb-6 tracking-tight uppercase">Tóm lược tháng {currentMonth}</h3>

        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng lịch hẹn</span>
          <span className="text-4xl font-black">{String(stats.total).padStart(2, '0')}</span>
        </div>

        <div className="h-2 w-full bg-white/10 rounded-full mb-10 overflow-hidden">
          <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${stats.percent}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hoàn thành</p>
            <p className="text-2xl font-black">{String(stats.completed).padStart(2, '0')}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang chờ</p>
            <p className="text-2xl font-black">{String(stats.pending).padStart(2, '0')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReminderCard = () => (
  <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
    <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-slate-50 rounded-full opacity-50 transition-transform group-hover:scale-110" />
    <div className="relative z-10">
      <h3 className="text-lg font-black text-[#041837] mb-3 tracking-tight">Lời nhắc quan trọng</h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
        Chuẩn bị hồ sơ pháp lý cho buổi tư vấn với LS. Nguyễn Văn Thành về tranh chấp đất đai.
      </p>
      <button className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors">
        Xem tài liệu đính kèm <HiExternalLink size={14} />
      </button>
    </div>
  </div>
);

const CalendarCard = ({ consultations = [] }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArr = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: (firstDay === 0 ? 6 : firstDay - 1) }, (_, i) => i);

  // Helper to check if a day has a consultation
  const hasConsultation = (day) => {
    return consultations.some(c => {
      const d = new Date(c.scheduled_at);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-[#041837] uppercase tracking-wider">
          {viewDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 mt-1"
          >
            <HiChevronLeft size={20} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 mt-1"
          >
            <HiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <span key={day} className="text-[10px] font-black text-slate-300 uppercase">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {emptyDays.map(i => <div key={`empty-${i}`} className="h-9" />)}
        {daysArr.map(day => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasAppt = hasConsultation(day);

          return (
            <div
              key={day}
              className="relative h-9 flex items-center justify-center"
            >
              <div
                className={`h-8 w-8 flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-pointer
                  ${isToday && 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'}
                  ${!isToday && 'hover:bg-slate-50 text-slate-500'}
                `}
              >
                {day}
              </div>
              {hasAppt && (
                <div className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,179,1,0.6)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ConsultationsTab = ({ consultations = [], onBookNew }) => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, consultation: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewClick = (e, consultation) => {
    e.stopPropagation();
    setReviewModal({ isOpen: true, consultation });
    setReviewData({ rating: 5, comment: '' });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewModal.consultation?.lawyer?.lawyer?.id) {
      toast.error('Không tìm thấy thông tin luật sư');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await api.post(`/client/lawyers/${reviewModal.consultation.lawyer.lawyer.id}/reviews`, reviewData);
      if (res.data.success) {
        toast.success('Gửi đánh giá thành công!');
        setReviewModal({ isOpen: false, consultation: null });
      }
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 2xl:grid-cols-[1fr,360px] gap-12">

        {/* Left Column: Main List */}
        <div className="space-y-8 min-w-0">
          <div className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-4 rounded-[32px] border border-white">
            <div className="flex items-center gap-3 px-4">
              <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse shadow-sm" />
              <span className="text-xs font-black uppercase tracking-widest text-[#041837]">
                Danh sách lịch hẹn ({consultations.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toast('Tính năng lọc sẽ sớm ra mắt', { icon: '🔍' })}
                className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#041837] border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <HiFilter size={16} /> Lọc
              </button>
              <button
                onClick={onBookNew}
                className="flex items-center gap-2 rounded-2xl bg-[#041837] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black transition-all active:scale-95"
              >
                <HiPlus size={16} className="text-amber-500" /> Đặt lịch mới
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {consultations.length === 0 ? (
              <div className="rounded-[50px] border-4 border-dashed border-slate-100 bg-white py-40 text-center flex flex-col items-center justify-center">
                <HiCalendar className="h-20 w-20 text-slate-100 mb-6 shrink-0" />
                <p className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">Chưa có lịch tư vấn nào</p>
              </div>
            ) : (
              consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="group relative bg-white rounded-[40px] border border-slate-50 p-8 shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-10">

                    {/* 1. Lawyer Bio */}
                    <div className="flex items-center gap-6 lg:w-[35%] min-w-0">
                      <div className="relative h-20 w-20 shrink-0 rounded-[30px] bg-slate-900 border-4 border-slate-50 shadow-2xl overflow-hidden group-hover:rotate-6 transition-transform">
                        {consultation.lawyer?.avatar ? (
                          <img src={resolveAvatarUrl(consultation.lawyer.avatar)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <img src={defaultAvatar} alt="" className="h-full w-full object-cover" />
                        )}
                        <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-slate-900 bg-emerald-500 shadow-sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight truncate group-hover:text-amber-600 transition-colors">
                          {consultation.lawyer?.full_name || 'Luật sư ẩn danh'}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 truncate mt-1 lowercase">{consultation.lawyer?.email || 'N/A'}</p>
                      </div>
                    </div>

                    {/* 2. Schedule */}
                    <div className="flex items-center gap-6 lg:w-[30%] shrink-0">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors">
                        <HiClock size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-black text-[#041837] tabular-nums leading-none">
                          {new Date(consultation.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase">
                          {new Date(consultation.scheduled_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    {/* 3. Pricing & Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-10 lg:w-[35%] shrink-0 border-t lg:border-t-0 pt-6 lg:pt-0">
                      <div className="text-right">
                        <p className="text-xl font-black text-emerald-600 whitespace-nowrap leading-none tabular-nums">
                          {Number(consultation.fee || 800000).toLocaleString('vi-VN')} VNĐ
                        </p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                          ${consultation.status === 'completed'
                            ? 'bg-blue-50 text-blue-600'
                            : consultation.status === 'in_progress'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse'
                              : (consultation.status === 'confirmed' && new Date(consultation.scheduled_at) < new Date())
                                ? 'bg-red-50 text-red-600 animate-pulse border border-red-200'
                                : consultation.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-orange-50 text-orange-600'}`}
                        >
                          {consultation.status === 'completed'
                            ? 'Hoàn thành'
                            : consultation.status === 'in_progress'
                              ? 'ĐÃ THAM GIA'
                              : (consultation.status === 'confirmed' && new Date(consultation.scheduled_at) < new Date())
                                ? 'LỊCH ĐÃ BỊ TRỄ'
                                : consultation.status === 'confirmed'
                                  ? 'Đã xác nhận'
                                  : 'Đang chờ'}
                        </span>
                        {consultation.status === 'completed' && (
                          <button
                            onClick={(e) => handleReviewClick(e, consultation)}
                            className="mt-2 block w-full px-3 py-1.5 rounded-lg bg-amber-500 text-[#041837] text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm"
                          >
                            Đánh giá ngay
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#041837] text-white hover:bg-amber-500 hover:text-[#041837] transition-all shadow-lg active:scale-95"
                        title="Chi tiết lịch"
                      >
                        <HiChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-10">
          <SummaryCard consultations={consultations} />
          <ReminderCard />
          <CalendarCard consultations={consultations} />
        </div>
      </div>

      {/* Detail Modal */}
      {
        selectedConsultation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-white rounded-[50px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="bg-[#041837] p-10 text-white relative">
                  <button
                    onClick={() => setSelectedConsultation(null)}
                    className="absolute right-8 top-8 h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white text-white hover:text-[#041837] transition-all"
                  >
                    <HiPlus size={24} className="rotate-45" />
                  </button>
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-[30px] border-4 border-white/10 overflow-hidden shadow-2xl">
                      {selectedConsultation.lawyer?.avatar ? (
                        <img src={resolveAvatarUrl(selectedConsultation.lawyer.avatar)} className="h-full w-full object-cover" />
                      ) : (
                        <img src={defaultAvatar} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tight">{selectedConsultation.lawyer?.full_name}</h3>
                      <p className="text-amber-500 font-bold tracking-widest uppercase text-xs mt-1">Luật sư tư vấn chính</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">Thời gian</p>
                      <p className="text-lg font-black text-[#041837]">
                        {new Date(selectedConsultation.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(selectedConsultation.scheduled_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-2">Thời lượng</p>
                      <p className="text-lg font-black text-[#041837]">{selectedConsultation.duration || 60} PHÚT</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-3">Ghi chú & Yêu cầu</p>
                    <div className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-8 rounded-[32px] italic">
                      "{selectedConsultation.notes || selectedConsultation.description || 'Không có ghi chú thêm cho phiên tư vấn này.'}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tổng phí</p>
                      <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                        {Number(selectedConsultation.fee || 800000).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedConsultation(null)}
                      className="bg-[#041837] text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
                    >
                      Đóng thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Review Modal */}
      {
        reviewModal.isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#041837]/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#041837] text-white">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Đánh giá luật sư</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Phản hồi của bạn giúp chúng tôi cải thiện chất lượng</p>
                </div>
                <button
                  onClick={() => setReviewModal({ isOpen: false, consultation: null })}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                >
                  <HiX size={20} />
                </button>
              </div>

              <form onSubmit={submitReview} className="p-8 space-y-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="h-24 w-24 rounded-[32px] border-4 border-slate-50 overflow-hidden shadow-xl">
                    {reviewModal.consultation.lawyer?.avatar ? (
                      <img src={resolveAvatarUrl(reviewModal.consultation.lawyer.avatar)} className="h-full w-full object-cover" />
                    ) : (
                      <img src={defaultAvatar} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-black text-[#041837] uppercase">{reviewModal.consultation.lawyer?.full_name}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Luật sư hỗ trợ bạn</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mức độ hài lòng của bạn</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className={`p-2 transition-all transform hover:scale-110 active:scale-95 ${star <= reviewData.rating ? 'text-amber-500' : 'text-slate-200'}`}
                        >
                          <HiStar size={32} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nhận xét chi tiết</label>
                    <textarea
                      rows={4}
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      placeholder="Chia sẻ trải nghiệm của bạn về kiến thức chuyên môn, thái độ phục vụ của luật sư..."
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium leading-relaxed outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-[#041837] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingReview ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Đang gửi đánh giá...
                    </>
                  ) : (
                    'Gửi đánh giá ngay'
                  )}
                </button>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ConsultationsTab;

