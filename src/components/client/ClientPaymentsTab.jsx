import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCurrencyDollar, HiBriefcase, HiCalendar, HiReceiptTax, HiSearch, HiFilter } from 'react-icons/hi';

const ClientPaymentsTab = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/client/transactions');
            if (res.data.success) {
                setPayments(res.data.data.transactions);
            }
        } catch (error) {
            console.error('Fetch payments error:', error);
            toast.error('Lỗi khi tải lịch sử thanh toán');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        p.case?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatMoney = (amount) => {
        return new Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:rotate-12 transition-transform">
                        <HiCurrencyDollar size={80} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổng chi tiêu</p>
                    <h3 className="text-3xl font-black text-[#041837]">
                        {formatMoney(payments.reduce((sum, p) => sum + Number(p.amount || 0), 0))}
                    </h3>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:rotate-12 transition-transform">
                        <HiReceiptTax size={80} />
                    </div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Giao dịch thành công</p>
                    <h3 className="text-3xl font-black text-[#041837]">
                        {payments.filter(p => p.status === 'success' || p.status === 'completed').length}
                    </h3>
                </div>
                <div className="bg-[#041837] p-8 rounded-[40px] text-white shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:rotate-12 transition-transform">
                        <HiFilter size={80} />
                    </div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Phương thức phổ biến</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Thanh toán Online</h3>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã giao dịch, vụ việc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 text-[#041837] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
                        Xuất báo cáo PDF
                    </button>
                </div>
            </div>

            {/* Transactions Table/List */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-w-0">
                {loading ? (
                    <div className="flex py-32 items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="py-40 text-center flex flex-col items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                            <HiCurrencyDollar size={40} className="text-slate-200" />
                        </div>
                        <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Không tìm thấy giao dịch nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin giao dịch</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dịch vụ / Vụ việc</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Số tiền</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày tạo</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                    {payment.payment_method === 'momo' ? 'M' : payment.payment_method === 'payos' ? 'P' : '$'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-[#041837] uppercase truncate">#{payment.transaction_id || payment.order_code || 'Giao dịch mới'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{payment.payment_method || 'Online'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-[#041837]">
                                                    {payment.case ? (
                                                        <><HiBriefcase className="text-slate-400" size={14} /> <span className="text-sm font-bold">{payment.case.title}</span></>
                                                    ) : payment.consultation ? (
                                                        <><HiCalendar className="text-slate-400" size={14} /> <span className="text-sm font-bold">Lịch tư vấn ({new Date(payment.consultation.scheduled_at).toLocaleDateString('vi-VN')})</span></>
                                                    ) : (
                                                        <span className="text-sm font-bold text-slate-400">Dịch vụ pháp lý</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-emerald-600 tabular-nums">{formatMoney(payment.amount)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{new Date(payment.created_at).toLocaleDateString('vi-VN')}</p>
                                            <p className="text-[10px] text-slate-300 mt-1">{new Date(payment.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${payment.status === 'success' || payment.status === 'completed' || payment.status === 'PAID'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : payment.status === 'pending' || payment.status === 'PENDING'
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {payment.status === 'success' || payment.status === 'completed' || payment.status === 'PAID' ? 'Thành công' :
                                                    payment.status === 'pending' || payment.status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientPaymentsTab;
