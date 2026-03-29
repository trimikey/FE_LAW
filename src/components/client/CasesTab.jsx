import {
  HiBriefcase,
  HiCalendar,
  HiPlus,
  HiChevronRight,
  HiOutlineTrash,
  HiArchive,
  HiRefresh,
  HiInformationCircle
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const CasesTab = ({ cases, onCreate, onDelete, onArchive, onRestore }) => {
  const navigate = useNavigate();

  const handleDelete = (e, caseId, title) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn vụ việc "${title}" không?`)) {
      onDelete(caseId);
    }
  };

  const handleArchive = (e, caseId, title) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có muốn đưa vụ việc "${title}" vào kho lưu trữ không? (Vụ việc sẽ tự động xóa sau 7 ngày)`)) {
      onArchive(caseId);
    }
  };

  const handleRestore = (e, caseId, title) => {
    e.stopPropagation();
    onRestore(caseId);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[40px] bg-[#041837] text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-amber-500/20" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-12 py-14">
          <div className="max-w-xl text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Quản trị dự án pháp lý</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">Danh mục <span className="text-amber-500">Vụ việc</span></h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              Dễ dàng quản lý, lưu trữ hoặc xóa các yêu cầu pháp lý không còn cần thiết để tối ưu hóa không gian làm việc.
            </p>
          </div>

          <button
            onClick={onCreate}
            className="group flex items-center gap-3 rounded-2xl bg-amber-500 px-10 py-5 text-xs font-black uppercase tracking-widest text-[#041837] shadow-xl shadow-amber-500/20 transition hover:bg-white active:scale-95"
          >
            <HiPlus className="h-5 w-5 transition group-hover:rotate-90" />
            Tạo vụ việc mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Empty State / Create Inline */}
        {cases.length === 0 && (
          <button
            onClick={onCreate}
            className="group relative rounded-[40px] border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px] transition-all hover:border-amber-500 hover:bg-amber-50/10"
          >
            <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white shadow-sm">
              <HiPlus className="w-10 h-10 text-slate-300 group-hover:text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-[#041837]">Khởi tạo vụ việc đầu tiên</span>
            <p className="mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Hệ thống luôn sẵn sàng hỗ trợ</p>
          </button>
        )}

        {cases.map((caseItem) => {
          const caseIdStr = `#VV-${new Date(caseItem.created_at).getFullYear()}-${String(caseItem.id).padStart(3, '0')}`;
          let progress = 0;
          let statusConfig = { text: 'CHỜ PHẢN HỒI', color: 'text-amber-600', bg: 'bg-amber-50', barColor: 'bg-amber-500' };

          if (caseItem.status === 'completed') {
            progress = 100;
            statusConfig = { text: 'HOÀN THÀNH', color: 'text-emerald-600', bg: 'bg-emerald-50', barColor: 'bg-emerald-500' };
          } else if (caseItem.status === 'in_progress') {
            progress = 65;
            statusConfig = { text: 'ĐANG XỬ LÝ', color: 'text-blue-600', bg: 'bg-blue-50', barColor: 'bg-blue-600' };
          } else if (caseItem.status === 'rejected') {
            statusConfig = { text: 'BỊ TỪ CHỐI', color: 'text-rose-600', bg: 'bg-rose-50', barColor: 'bg-rose-500' };
          }

          const isArchived = !!caseItem.archived_at;
          const canDelete = ['pending', 'rejected'].includes(caseItem.status) || isArchived;

          // Calculate remaining days for archived cases
          let remainingDays = 7;
          if (isArchived) {
            const archivedDate = new Date(caseItem.archived_at);
            const diffTime = Math.abs(new Date() - archivedDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            remainingDays = Math.max(0, 7 - diffDays);
          }

          return (
            <div
              key={caseItem.id}
              onClick={() => navigate(`/cases/${caseItem.id}`)}
              className={`group relative bg-white rounded-[40px] border ${isArchived ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100'} p-8 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -z-0 transition-all group-hover:bg-blue-50/50 duration-500" />

              {isArchived && (
                <div className="absolute top-0 left-0 w-full bg-amber-500/10 text-amber-700 py-2 px-10 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <HiInformationCircle className="w-3 h-3" />
                  Vụ việc đã được lưu trữ & Tự động xóa sau {remainingDays} ngày
                </div>
              )}

              <div className="relative z-10 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isArchived ? 'bg-amber-400' : 'bg-blue-500 animate-pulse'}`} />
                    <span className="text-[10px] font-black text-[#041837] uppercase tracking-widest opacity-40">{caseIdStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${statusConfig.bg} ${statusConfig.color} ring-1 ring-current/10 shadow-sm`}>
                      {statusConfig.text}
                    </span>
                  </div>
                </div>

                <h3 className={`font-black text-2xl mb-8 line-clamp-2 min-h-[4rem] leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors ${isArchived ? 'text-slate-400 italic strike' : 'text-[#041837]'}`}>
                  {caseItem.title}
                </h3>

                <div className="mb-8 p-6 rounded-3xl bg-slate-50 border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiến độ nghiệp vụ</span>
                    <span className="text-xs font-black text-[#041837]">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full ${statusConfig.barColor} transition-all duration-1000 shadow-[0_0_12px_rgba(0,0,0,0.1)]`} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-slate-50/80 p-2 rounded-2xl group-hover:bg-white transition-all">
                    {isArchived ? (
                      <button
                        onClick={(e) => handleRestore(e, caseItem.id, caseItem.title)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                        title="Khôi phục"
                      >
                        <HiRefresh className="h-4 w-4" />
                        Khôi phục
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleArchive(e, caseItem.id, caseItem.title)}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all"
                        title="Lưu trữ"
                      >
                        <HiArchive className="h-4 w-4" />
                        Lưu trữ
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={(e) => handleDelete(e, caseItem.id, caseItem.title)}
                        className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all pointer-events-auto shadow-sm active:scale-90"
                        title="Xóa vĩnh viễn"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <button className="h-14 w-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 hover:bg-blue-600 shadow-xl">
                    <HiChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CasesTab;
