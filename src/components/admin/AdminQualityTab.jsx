import { useEffect } from 'react';
import { HiStar, HiExclamation, HiChatAlt, HiCheckCircle, HiEye, HiEyeOff, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { resolveAvatarUrl } from '../../utils/avatar';

const AdminQualityTab = ({ stats, reviews = [], pagination, loading, onPageChange, handleToggleReviewVisibility }) => {
    useEffect(() => {
        if (!reviews.length && onPageChange) {
            onPageChange(1);
        }
    }, []);

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="px-4">
                <h1 className="text-4xl font-black text-[#041837] tracking-tight uppercase">Chất lượng & Issue</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    Quản lý phản hồi và giải quyết các khiếu nại khách hàng
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Review Stats */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform text-amber-500">
                        <HiStar className="h-48 w-48" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Chất lượng luật sư</h3>
                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-7xl font-black text-[#041837] tracking-tighter">{stats?.reviews?.total || 0}</span>
                            <div className="pb-3 px-4 py-1 bg-amber-500 text-[#041837] rounded-xl text-[10px] font-black uppercase tracking-widest h-fit">
                                Tổng đánh giá
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                            Tất cả phản hồi từ khách hàng dành cho luật sư trên hệ thống. Kiểm tra định kỳ để đảm bảo uy tín của nền tảng.
                        </p>
                    </div>
                </div>

                {/* Issues Stats */}
                <div className="bg-[#041837] rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform text-white">
                        <HiExclamation className="h-48 w-48" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-8">Vụ việc cần can thiệp</h3>
                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-7xl font-black text-white tracking-tighter">{stats?.issues?.total || 0}</span>
                            <div className="pb-3 px-4 py-1 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest h-fit">
                                Cảnh báo xử lý
                            </div>
                        </div>
                        <p className="text-sm text-white/60 font-medium leading-relaxed max-w-md">
                            Số lượng vụ việc đang trong trạng thái xem xét hoặc bị huỷ cần sự can thiệp và phân xử từ đội ngũ quản trị viên.
                        </p>
                    </div>
                </div>
            </div>

            {/* List of Reviews */}
            <div className="bg-white rounded-[50px] border border-slate-100 shadow-sm overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                )}
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h2 className="text-2xl font-black text-[#041837] uppercase tracking-tight">Chi tiết đánh giá gần đây</h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng {pagination?.total || 0} đánh giá</span>
                </div>

                <div className="divide-y divide-slate-50">
                    {reviews.length === 0 ? (
                        <div className="p-20 text-center">
                            <p className="text-slate-400 font-black uppercase tracking-widest italic">Chưa có đánh giá nào</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col md:flex-row gap-8">
                                {/* Roles info */}
                                <div className="md:w-64 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl overflow-hidden border-2 border-slate-50">
                                            <img src={resolveAvatarUrl(review.clientUser?.avatar)} alt="Client" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</p>
                                            <p className="text-[11px] font-black text-[#041837] uppercase truncate">{review.clientUser?.full_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl overflow-hidden border-2 border-slate-50">
                                            <img src={resolveAvatarUrl(review.lawyerUser?.avatar)} alt="Lawyer" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Luật sư</p>
                                            <p className="text-[11px] font-black text-[#041837] uppercase truncate">{review.lawyerUser?.full_name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-500' : 'text-slate-100'}`} />
                                        ))}
                                        <span className="ml-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                        {review.comment || "Không có nội dung nhận xét."}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="md:w-48 flex items-center justify-end">
                                    <button
                                        onClick={() => handleToggleReviewVisibility(review.id, review.is_hidden)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${review.is_hidden
                                            ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white'
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white'
                                            }`}
                                    >
                                        {review.is_hidden ? <HiEyeOff /> : <HiEye />}
                                        {review.is_hidden ? 'Đang ẩn' : 'Đang hiện'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Trang {currentPage} / {totalPages}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <HiChevronLeft size={20} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
                                    if (page === 2 || page === totalPages - 1) return <span key={page} className="text-slate-300">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        disabled={loading}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${page === currentPage ? 'bg-[#041837] text-white' : 'border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <HiChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* List of Issues */}
            <div className="bg-[#041837] rounded-[50px] shadow-2xl overflow-hidden text-white">
                <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Vụ việc cần xử lý gấp</h2>
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] animate-pulse">Cần can thiệp</span>
                </div>

                <div className="divide-y divide-white/10">
                    {(!stats?.recentIssues || stats.recentIssues.length === 0) ? (
                        <div className="p-20 text-center">
                            <p className="text-white/40 font-black uppercase tracking-widest italic">Hệ thống đang ổn định, không có vụ việc cần xử lý</p>
                        </div>
                    ) : (
                        stats.recentIssues.map((issue) => (
                            <div key={issue.id} className="p-10 hover:bg-white/5 transition-all group flex flex-col md:flex-row gap-8">
                                <div className="md:w-64">
                                    <span className="px-3 py-1 bg-rose-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest inline-block mb-3">
                                        {issue.status === 'cancelled' ? 'Đã hủy' : 'Đang khiếu nại'}
                                    </span>
                                    <h4 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-rose-400 transition-colors">
                                        CASE #{issue.id.toString().padStart(4, '0')}
                                    </h4>
                                    <p className="text-[10px] font-bold text-white/40 uppercase mt-1">
                                        Cập nhật: {new Date(issue.updated_at).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-[9px] font-black text-white/40 uppercase mb-1">Khách hàng</p>
                                        <p className="text-xs font-bold">{issue.client?.full_name}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-[9px] font-black text-amber-500 uppercase mb-1">Luật sư đảm nhận</p>
                                        <p className="text-xs font-bold">{issue.lawyer?.full_name || 'Chưa nhận'}</p>
                                    </div>
                                </div>

                                <div className="md:w-48 flex items-center justify-end">
                                    <button className="px-8 py-4 rounded-2xl bg-white text-[#041837] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-xl">
                                        Phân xử
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bottom Info Section */}
            <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 italic font-bold text-slate-400 text-center uppercase tracking-[0.3em] text-[10px]">
                Dữ liệu được cập nhật từ phản hồi trực tiếp của khách hàng qua hệ thống
            </div>
        </div>
    );
};

export default AdminQualityTab;
