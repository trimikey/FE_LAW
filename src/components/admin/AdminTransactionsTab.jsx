import { useEffect } from 'react';
import { HiDownload, HiCalendar, HiCurrencyDollar, HiIdentification, HiTrendingUp, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const AdminTransactionsTab = ({ transactions, pagination, loading, onPageChange, lawyerKpi, kpiLoading, onFetchKPI }) => {
    useEffect(() => {
        if (!transactions.length && onPageChange) {
            onPageChange(1);
        }
    }, []);

    const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

    const handleExport = () => {
        if (!transactions.length) return;

        // Define CSV Headers
        const headers = ["Thời điểm", "Người gửi", "Email", "Giá trị (VNĐ)", "Phí hệ thống (15%)", "Trạng thái", "Mã giao dịch"];

        // Map data to rows
        const rows = transactions.map(tx => [
            new Date(tx.created_at).toLocaleString('vi-VN'),
            tx.user?.full_name || 'Khách hàng',
            tx.user?.email || '-',
            tx.amount,
            tx.amount * 0.15,
            tx.status,
            tx.transaction_id || '-'
        ]);

        // CSV String generation
        const csvContent = [
            "\uFEFF" + headers.join(","), // Add BOM for Excel UTF-8 support
            ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        // Download logic
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Bao_cao_tai_chinh_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;

    return (
        <div className="space-y-10 animate-in slide-in-from-right duration-700 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                    <h1 className="text-4xl font-black text-[#041837] tracking-tight uppercase">Nhật ký giao dịch</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Theo dõi dòng tiền và lịch sử thanh toán hệ thống</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-3 rounded-2xl bg-[#041837] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl transition hover:bg-black active:scale-95"
                >
                    <HiDownload size={20} className="text-amber-500" />
                    Xuất báo cáo tài chính
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="px-10 py-8 text-left whitespace-nowrap">Thời điểm</th>
                                <th className="px-10 py-8 text-left whitespace-nowrap">Người gửi</th>
                                <th className="px-10 py-8 text-left whitespace-nowrap">Giá trị giao dịch</th>
                                <th className="px-10 py-8 text-left whitespace-nowrap">Phí hệ thống (15%)</th>
                                <th className="px-10 py-8 text-left whitespace-nowrap">Trạng thái</th>
                                <th className="px-10 py-8 text-right whitespace-nowrap">Mã giao dịch</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <HiCalendar className="shrink-0" />
                                            <span className="text-xs font-bold text-slate-500">{new Date(tx.created_at).toLocaleString('vi-VN')}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                                {tx.user?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[#041837] uppercase">{tx.user?.full_name || 'Khách hàng'}</p>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{tx.user?.email || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 font-black text-[#041837]">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <HiCurrencyDollar size={18} />
                                            <span>{formatMoney(tx.amount)}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 font-black text-amber-600">
                                        <div className="flex items-center gap-2">
                                            <HiTrendingUp size={18} />
                                            <span>{formatMoney(tx.amount * 0.15)}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${tx.status === 'completed'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : tx.status === 'failed'
                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right font-mono text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                        {tx.transaction_id || '-'}
                                    </td>
                                </tr>
                            ))}
                            {!transactions.length && !loading && (
                                <tr>
                                    <td colSpan="6" className="px-10 py-20 text-center italic text-slate-400 font-bold uppercase tracking-widest">
                                        Chưa có giao dịch nào được ghi nhận
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Trang {currentPage} / {totalPages}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all font-black shadow-sm"
                            >
                                <HiChevronLeft size={20} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                // Chỉ hiển thị vài trang nếu quá nhiều
                                if (totalPages > 7) {
                                    if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                                        if (page === 2 || page === totalPages - 1) return <span key={page} className="text-slate-200">...</span>;
                                        return null;
                                    }
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        disabled={loading}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all shadow-sm ${page === currentPage ? 'bg-[#041837] text-white' : 'border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all font-black shadow-sm"
                            >
                                <HiChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Lawyer KPI Section */}
            <div className="pt-10 border-t-2 border-slate-50">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div>
                        <h2 className="text-2xl font-black text-[#041837] uppercase tracking-tight">KPI & Doanh thu luật sư</h2>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">Bảng xếp hạng hiệu suất tư vấn trong tháng</p>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
                    {!lawyerKpi ? (
                        <div className="text-center py-10">
                            <button
                                onClick={() => onFetchKPI()}
                                disabled={kpiLoading}
                                className="px-8 py-3 bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-amber-600 transition disabled:opacity-50"
                            >
                                {kpiLoading ? 'Đang tính toán...' : 'Xem bảng xếp hạng KPI tháng này'}
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="pb-4 text-left">Hạng</th>
                                        <th className="pb-4 text-left">Luật sư</th>
                                        <th className="pb-4 text-center">Số lượt tư vấn</th>
                                        <th className="pb-4 text-center">Số vụ việc</th>
                                        <th className="pb-4 text-right">Tổng doanh thu</th>
                                        <th className="pb-4 text-right">Phí hệ thống (15%)</th>
                                        <th className="pb-4 text-right text-emerald-600">Luật sư nhận</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-bold">
                                    {lawyerKpi.kpi.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-10 text-center italic text-slate-400">
                                                Không có dữ liệu doanh thu cho tháng này
                                            </td>
                                        </tr>
                                    ) : (
                                        lawyerKpi.kpi.map((item, index) => (
                                            <tr key={item.lawyerId} className="group">
                                                <td className="py-5 text-slate-300">#{index + 1}</td>
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">
                                                            {item.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-[#041837]">{item.fullName}</p>
                                                            <p className="text-[8px] text-slate-400 uppercase">{item.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 text-center text-xs">{item.consultationCount}</td>
                                                <td className="py-5 text-center text-xs">{item.caseCount || 0}</td>
                                                <td className="py-5 text-right text-xs">{formatMoney(item.totalRevenue)}</td>
                                                <td className="py-5 text-right text-xs text-amber-500">{formatMoney(item.adminFee)}</td>
                                                <td className="py-5 text-right text-xs text-emerald-600">
                                                    <div className="bg-emerald-50 inline-block px-3 py-1 rounded-lg">
                                                        {formatMoney(item.lawyerEarning)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTransactionsTab;
