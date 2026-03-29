import { useEffect } from 'react';
import { HiUserGroup, HiChevronLeft, HiChevronRight, HiMail, HiPhone, HiClock } from 'react-icons/hi';

const AdminInquiriesTab = ({ inquiries, pagination, loading, onPageChange }) => {
    useEffect(() => {
        onPageChange(1);
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Customer Outreach</p>
                    <h2 className="text-4xl font-black text-[#041837] tracking-tight uppercase mt-2">Yêu cầu tư vấn hệ thống</h2>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#041837] text-amber-500 shadow-2xl">
                    <HiUserGroup size={28} />
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative min-h-[500px]">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="px-10 py-8">Khách hàng</th>
                                <th className="px-10 py-8">Liên hệ</th>
                                <th className="px-10 py-8">Nội dung yêu cầu</th>
                                <th className="px-10 py-8">Trạng thái</th>
                                <th className="px-10 py-8">Xử lý bởi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {inquiries.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={5} className="py-40 text-center">
                                        <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Chưa có dữ liệu yêu cầu tư vấn</p>
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <tr key={inquiry.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <div className="font-black text-[#041837] uppercase tracking-tight text-lg">{inquiry.full_name}</div>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <HiClock />
                                                <span>{new Date(inquiry.created_at).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                    <HiMail className="text-slate-300" />
                                                    <span>{inquiry.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-black text-amber-600">
                                                    <HiPhone className="text-amber-400" />
                                                    <span>{inquiry.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 max-w-md">
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed italic line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                                                "{inquiry.content}"
                                            </p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider ${inquiry.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    inquiry.status === 'contacted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full bg-current ${inquiry.status === 'pending' ? 'animate-pulse' : ''}`} />
                                                {inquiry.status === 'pending' ? 'Chờ xử lý' :
                                                    inquiry.status === 'contacted' ? 'Đang tư vấn' : 'Hoàn thành'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            {inquiry.assigned_lawyer ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[#041837] text-[10px]">
                                                        {inquiry.assigned_lawyer.full_name.charAt(0)}
                                                    </div>
                                                    <div className="text-[10px] font-black text-[#041837] uppercase tracking-tighter">
                                                        {inquiry.assigned_lawyer.full_name}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Chưa ai nhận</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {pagination.page} / {pagination.totalPages}</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page === 1 || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                            >
                                <HiChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 bg-white text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                            >
                                <HiChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInquiriesTab;
