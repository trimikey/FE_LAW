import { HiBriefcase, HiCalendar, HiCheckCircle, HiClock, HiArrowRight } from 'react-icons/hi';

const ActivityItem = ({ icon: Icon, title, description, time, colorClass, status }) => (
  <div className="group flex gap-6 p-6 rounded-[32px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-100 hover:shadow-xl transition-all duration-500">
    <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${colorClass}`}>
      <Icon className="h-7 w-7" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-black text-[#041837] uppercase tracking-tight truncate">{title}</h4>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ml-2">{time}</span>
      </div>
      <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed mb-2 italic">"{description}"</p>
      {status && (
        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status === 'completed' || status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
            status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
          }`}>
          {status === 'completed' ? 'Hoàn thành' : status === 'confirmed' ? 'Xác nhận' : status === 'pending' ? 'Chờ xử lý' : status}
        </span>
      )}
    </div>
  </div>
);

const OverviewTab = ({ stats, recentCases = [], recentConsultations = [] }) => {
  if (!stats) return (
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-dashed border-slate-200">
      <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
        <HiBriefcase className="h-10 w-10 text-slate-300" />
      </div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu thống kê nào.</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Cases Card */}
        <div className="group relative overflow-hidden rounded-[32px] border border-white bg-white p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <HiBriefcase className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black tracking-widest text-blue-600 ring-1 ring-blue-200 uppercase">
              Hồ sơ pháp lý
            </div>
          </div>
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng vụ việc</p>
          <div className="flex items-baseline gap-3 mt-2">
            <h3 className="text-4xl font-extrabold text-[#041837] tracking-tight">{stats.cases.total}</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{stats.cases.active} đang xử lý</span>
          </div>
        </div>

        {/* Upcoming Consultations Card */}
        <div className="group relative overflow-hidden rounded-[32px] border border-white bg-white p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-inner group-hover:bg-amber-500 group-hover:text-[#041837] transition-colors">
              <HiCalendar className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-4 py-1.5 text-[10px] font-black tracking-widest text-amber-600 ring-1 ring-amber-200 uppercase">
              Lịch trực tuyến
            </div>
          </div>
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Lịch tư vấn sắp tới</p>
          <h3 className="text-4xl font-extrabold text-[#041837] mt-2 tracking-tight">{stats.consultations.upcoming}</h3>
        </div>

        {/* Completed Cases Card */}
        <div className="group relative overflow-hidden rounded-[32px] border border-white bg-white p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition hover:shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <HiCheckCircle className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black tracking-widest text-emerald-600 ring-1 ring-emerald-200 uppercase">
              Đã giải quyết
            </div>
          </div>
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Vụ việc hoàn thành</p>
          <h3 className="text-4xl font-extrabold text-[#041837] mt-2 tracking-tight">{stats.cases.total - stats.cases.active}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 rounded-[40px] border border-white bg-white p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <HiClock className="h-40 w-40 text-[#041837]" />
          </div>
          <div className="relative z-10">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-[#041837] tracking-tight">Cập nhật hoạt động</h3>
                <p className="text-slate-400 font-medium text-sm mt-1">Dòng thời gian các hoạt động gần đây của bạn</p>
              </div>
              <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-all">
                Xem tất cả <HiArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {(() => {
                const activities = [
                  ...recentCases.map(c => ({
                    id: `case-${c.id}`,
                    type: 'case',
                    title: `Vụ việc mới: ${c.title}`,
                    description: c.description || 'Không có mô tả chi tiết.',
                    time: new Date(c.created_at),
                    icon: HiBriefcase,
                    colorClass: 'bg-blue-600 text-white',
                    status: c.status
                  })),
                  ...recentConsultations.map(c => ({
                    id: `appt-${c.id}`,
                    type: 'consultation',
                    title: `Đặt lịch với: ${c.lawyer?.full_name || 'Luật sư'}`,
                    description: `Kiểu tư vấn: ${c.consultation_type === 'video' ? 'Video Call' : c.consultation_type}.`,
                    time: new Date(c.created_at),
                    icon: HiCalendar,
                    colorClass: 'bg-amber-500 text-[#041837]',
                    status: c.status
                  }))
                ].sort((a, b) => b.time - a.time).slice(0, 4);

                if (activities.length === 0) {
                  return (
                    <div className="flex h-72 flex-col items-center justify-center rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 p-10">
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <HiClock className="h-8 w-8 text-slate-300 animate-pulse" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa có hoạt động gần đây của bạn.</p>
                    </div>
                  );
                }

                return activities.map(activity => (
                  <ActivityItem
                    key={activity.id}
                    {...activity}
                    time={activity.time.toLocaleDateString('vi-VN')}
                  />
                ));
              })()}
            </div>
          </div>
        </div>

        <div className="rounded-[40px] border border-white bg-white p-10 shadow-xl">
          <h3 className="text-2xl font-black text-[#041837] tracking-tight mb-8">Trung tâm thông báo</h3>
          <div className="space-y-6">
            <div className="group flex gap-4 p-5 rounded-3xl bg-blue-50/50 border border-blue-100 transition hover:bg-white hover:shadow-xl">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black">!</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">Cập nhật tin nhắn</p>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">Nhớ kiểm tra cập nhật mới nhất từ luật sư trong trung tâm tin nhắn để không bỏ lỡ thông tin quan trọng.</p>
              </div>
            </div>

            <div className="group flex gap-4 p-5 rounded-3xl bg-emerald-50/50 border border-emerald-100 transition hover:bg-white hover:shadow-xl">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">✓</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">Hồ sơ khách hàng</p>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">Hồ sơ cá nhân đầy đủ và minh bạch giúp luật sư hỗ trợ bạn tốt hơn và nhanh hơn.</p>
              </div>
            </div>

            <div className="group flex gap-4 p-5 rounded-3xl bg-amber-50/50 border border-amber-100 transition hover:bg-white hover:shadow-xl">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-black">★</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-1">Đánh giá dịch vụ</p>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">Bạn có thể đánh giá luật sư sau khi vụ việc hoàn thành để giúp cộng đồng tốt hơn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
