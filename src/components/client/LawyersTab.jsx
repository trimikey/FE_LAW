import {
  HiSearch,
  HiStar,
  HiLocationMarker,
  HiAcademicCap,
  HiChevronRight,
  HiCalendar,
  HiVideoCamera,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineSparkles,
  HiCheckCircle,
  HiArrowRight
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import bannerImg from '../../assets/back_gr_luat.png';
import { resolveAvatarUrl } from '../../utils/avatar';
import defaultAvatar from '../../assets/default_lawyer_avatar.png';

export default function LawyersTab({
  lawyers,
  searchLawyers,
  setSelectedLawyer,
  setShowBookConsultation,
  bookConsultationFromSlot
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Premium Search Hero */}
      <div className="relative overflow-hidden rounded-[50px] bg-[#041837] text-white shadow-2xl">
        <div className="absolute inset-0">
          <img src={bannerImg} alt="Banner" className="h-full w-full object-cover opacity-20 mix-blend-overlay rotate-1 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#041837] via-transparent to-amber-500/10" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-12 py-16">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="mb-6 flex items-center justify-center lg:justify-start gap-3">
              <span className="h-px w-10 bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Expert Legal Connection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 uppercase leading-tight">Tìm kiếm<br /><span className="text-amber-500 italic">Cố vấn pháp lý</span></h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-lg mb-10">
              Kết nối trực tiếp với đội ngũ luật sư hàng đầu, chuyên gia trong nhiều lĩnh vực tư vấn doanh nghiệp, dân sự và hình sự.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {['HÌNH SỰ', 'DÂN SỰ', 'HỢP ĐỒNG', 'DOANH NGHIỆP'].map(tag => (
                <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-white/60 hover:text-amber-500 hover:border-amber-500 transition-all cursor-pointer">{tag}</span>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[450px]">
            <div className="p-8 rounded-[40px] bg-white text-[#041837] shadow-3xl">
              <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <HiOutlineSearch className="text-amber-500" />
                Bộ lọc chuyên gia
              </h3>
              <div className="relative mb-6">
                <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tên luật sư hoặc lĩnh vực..."
                  className="w-full py-5 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-amber-500 focus:bg-white outline-none font-bold placeholder:text-slate-300 transition-all text-sm"
                  onChange={(e) => searchLawyers(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trực tuyến ngay</span>
                  <div className="h-4 w-10 bg-emerald-100 rounded-full relative p-0.5">
                    <div className="h-3 w-3 bg-emerald-500 rounded-full shadow-sm" />
                  </div>
                </div>
                <button className="w-full py-5 rounded-2xl bg-[#041837] text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-amber-500 hover:text-[#041837] transition-all active:scale-95">
                  Áp dụng lọc ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lawyers List Grid */}
      <div className="space-y-10">
        <div className="flex items-center justify-between px-6">
          <h2 className="text-2xl font-black text-[#041837] uppercase tracking-tight">Danh sách chuyên gia ({lawyers.length})</h2>
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <HiOutlineSparkles className="text-amber-500 h-4 w-4" />
            Đề xuất tốt nhất
          </div>
        </div>

        {lawyers.length === 0 ? (
          <div className="rounded-[50px] border-2 border-dashed border-slate-100 bg-white py-40 text-center">
            <HiOutlineSearch className="mx-auto h-20 w-20 text-slate-100 mb-8" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">Không tìm thấy luật sư phù hợp với tìm kiếm của bạn</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="group relative bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm hover:shadow-3xl transition-all duration-700 overflow-hidden border-b-8 border-b-transparent hover:border-b-amber-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-[120px] -z-0 transition-all group-hover:bg-amber-50 duration-700" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-10 mb-10">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-[40px] bg-[#041837] text-amber-500 flex items-center justify-center font-black text-4xl shadow-2xl transition-transform group-hover:rotate-6 overflow-hidden">
                      {lawyer.avatar ? (
                        <img
                          src={resolveAvatarUrl(lawyer.avatar)}
                          alt={lawyer.full_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                          }}
                        />
                      ) : (
                        <img src={defaultAvatar} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-[14px] border-4 border-white flex items-center justify-center text-white shadow-xl">
                      <HiCheckCircle className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="min-w-0 text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                      <h3 className="font-black text-3xl text-[#041837] tracking-tight truncate uppercase italic">{lawyer.full_name}</h3>
                      <div className="inline-flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full text-amber-600 font-black text-[9px] w-fit mx-auto sm:mx-0">
                        <HiStar className="h-3 w-3" />
                        <span>RATINGS: 4.9</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{lawyer.email}</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                        <HiLocationMarker className="h-3 w-3 text-rose-500" />
                        {lawyer.lawyer?.law_firm || 'CHUYÊN GIA TỰ DO'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <HiAcademicCap className="h-5 w-5 text-blue-500" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chuyên môn</p>
                    </div>
                    <p className="text-xs font-black text-[#041837] line-clamp-1 uppercase tracking-tight">{lawyer.lawyer?.specialties || 'TƯ VẤN QUỐC TẾ'}</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <HiVideoCamera className="h-5 w-5 text-rose-500" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tư vấn trực tuyến</p>
                    </div>
                    <p className="text-xs font-black text-[#041837] uppercase tracking-tight">CÓ SẴN NGAY</p>
                  </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex -space-x-3">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className={`h-10 w-10 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-md ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-amber-500' : 'bg-[#041837]'}`}>
                        {i + 1}
                      </div>
                    ))}
                    <div className="h-10 px-4 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest">+120 LS</div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => navigate(`/lawyer/${lawyer.id}`)} className="flex-1 px-8 py-4 rounded-2xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                      Xem hồ sơ
                    </button>
                    <button
                      onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                      className="px-8 py-4 rounded-2xl bg-amber-500 text-[#041837] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all shadow-xl active:scale-95 flex items-center gap-2"
                    >
                      ĐẶT LỊCH NGAY
                      <HiArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
