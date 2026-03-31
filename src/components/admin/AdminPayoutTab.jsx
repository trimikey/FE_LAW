import React, { useState, useEffect } from 'react';
import { HiCheck, HiOutlineReceiptTax, HiPlus, HiRefresh, HiCheckCircle, HiCalendar, HiQrcode, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const BANK_BIN_MAPPING = {
    'MB': '970422',
    'MB Bank': '970422',
    'Vietcombank': '970436',
    'VCB': '970436',
    'Techcombank': '970407',
    'TCB': '970407',
    'Vietinbank': '970415',
    'BIDV': '970418',
    'Agribank': '970405',
    'TPBank': '970423',
    'VPBank': '970432',
    'ACB': '970416',
    'Sacombank': '970403'
};

const AdminPayoutTab = ({ payouts, loading, fetchPayouts, handleGeneratePayouts, handleConfirmPayout, handleUpdateBonus }) => {
    const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const [bonusModal, setBonusModal] = useState(null);
    const [bonusForm, setBonusForm] = useState({ amount: 0, notes: '' });
    const [qrModal, setQrModal] = useState(null);

    useEffect(() => {
        fetchPayouts(selectedMonth);
    }, [selectedMonth]);

    const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

    const onUpdateBonus = async (e) => {
        e.preventDefault();
        await handleUpdateBonus(bonusModal.id, bonusForm.amount, bonusForm.notes, selectedMonth);
        setBonusModal(null);
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-right duration-700 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                    <h1 className="text-4xl font-black text-[#041837] tracking-tight uppercase">Quản lý quyết toán</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Duyệt và tất toán doanh thu cho luật sư hàng tháng</p>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="rounded-2xl border-2 border-slate-100 px-4 py-3 text-xs font-bold text-[#041837] focus:border-[#041837] outline-none transition"
                    />
                    <button
                        onClick={() => handleGeneratePayouts(selectedMonth)}
                        disabled={loading}
                        className="flex items-center gap-3 rounded-2xl bg-[#041837] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl transition hover:bg-black active:scale-95 disabled:opacity-50"
                    >
                        <HiRefresh size={20} className={loading ? "animate-spin" : ""} />
                        Khởi tạo quyết toán
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
                {loading && payouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-12 w-12 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tính toán dữ liệu...</p>
                    </div>
                ) : payouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <HiOutlineReceiptTax size={48} />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Không có dữ liệu quyết toán cho tháng {selectedMonth}</p>
                            <p className="text-xs text-slate-400 italic mt-2">Vui lòng nhấn nút "Khởi tạo quyết toán" để hệ thống tính toán doanh thu</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4 text-left">Luật sư</th>
                                    <th className="pb-4 text-center">Khách đã trả</th>
                                    <th className="pb-4 text-center">Luật sư nhận (85%)</th>
                                    <th className="pb-4 text-center">Thưởng thêm</th>
                                    <th className="pb-4 text-center">Tổng thanh toán</th>
                                    <th className="pb-4 text-center">Trạng thái</th>
                                    <th className="pb-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold">
                                {payouts.map((p) => (
                                    <tr key={p.id} className="group hover:bg-slate-50/50 transition duration-300">
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black">
                                                    {p.lawyer?.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#041837]">{p.lawyer?.full_name}</p>
                                                    <p className="text-[8px] text-slate-400 uppercase tracking-widest">{p.lawyer?.email}</p>
                                                    {p.lawyer?.lawyer?.bank_account_number ? (
                                                        <div className="mt-1 flex flex-col gap-0.5 border-t border-slate-50 pt-1 pointer-events-auto">
                                                            <p className="text-[7.5px] font-black text-amber-600 uppercase tracking-tighter">
                                                                {p.lawyer.lawyer.bank_name}
                                                            </p>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigator.clipboard.writeText(p.lawyer.lawyer.bank_account_number);
                                                                    toast.success('Đã sao chép STK!');
                                                                }}
                                                                className="text-[10px] text-[#041837] hover:underline text-left"
                                                            >
                                                                {p.lawyer.lawyer.bank_account_number}
                                                            </button>
                                                            <p className="text-[8px] text-slate-400 italic">
                                                                {p.lawyer.lawyer.bank_account_name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-1 flex flex-col gap-0.5 border-t border-slate-50 pt-1">
                                                            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest italic animate-pulse">Chưa cập nhật NH</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center text-xs text-slate-400">{formatMoney(p.total_revenue)}</td>
                                        <td className="py-6 text-center text-xs text-[#041837]">{formatMoney(p.lawyer_earning)}</td>
                                        <td className="py-6 text-center">
                                            {p.bonus_amount > 0 ? (
                                                <span className="text-xs text-amber-500">+{formatMoney(p.bonus_amount)}</span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setBonusModal(p);
                                                        setBonusForm({ amount: 0, notes: p.notes || '' });
                                                    }}
                                                    disabled={p.status === 'paid'}
                                                    className="text-[9px] text-slate-300 hover:text-amber-500 uppercase tracking-widest"
                                                >
                                                    Thêm thưởng
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-6 text-center">
                                            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs">
                                                {formatMoney(Number(p.lawyer_earning) + Number(p.bonus_amount))}
                                            </div>
                                        </td>
                                        <td className="py-6 text-center">
                                            {p.status === 'paid' ? (
                                                <div className="flex items-center justify-center gap-1 text-emerald-500">
                                                    <HiCheckCircle size={16} />
                                                    <span className="text-[10px] uppercase tracking-widest">Đã tất toán</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1 text-amber-500 animate-pulse">
                                                    <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                                                    <span className="text-[10px] uppercase tracking-widest">Chờ thanh toán</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 text-right space-x-2">
                                            {p.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => setQrModal(p)}
                                                        className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-amber-600 transition inline-flex items-center gap-2"
                                                    >
                                                        <HiQrcode size={14} />
                                                        Thanh toán QR
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Xác nhận đã chuyển khoản ${formatMoney(Number(p.lawyer_earning) + Number(p.bonus_amount))} cho luật sư ${p.lawyer?.full_name}?`)) {
                                                                handleConfirmPayout(p.id, p.notes, selectedMonth);
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-emerald-600 transition"
                                                    >
                                                        Xác nhận tất toán
                                                    </button>
                                                </>
                                            )}
                                            {p.status === 'paid' && (
                                                <span className="text-[9px] text-slate-300 uppercase tracking-widest italic font-bold">
                                                    Ngày {new Date(p.paid_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bonus Modal - Premium Floating Style */}
            {bonusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041837]/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                <HiPlus size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Thưởng thêm (KPI)</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cộng thưởng cho luật sư {bonusModal.lawyer?.full_name}</p>
                            </div>
                        </div>

                        <form onSubmit={onUpdateBonus} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số tiền thưởng (VNĐ)</label>
                                <input
                                    type="number"
                                    required
                                    value={bonusForm.amount}
                                    onChange={(e) => setBonusForm({ ...bonusForm, amount: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold text-[#041837] focus:border-amber-500 outline-none transition"
                                    placeholder="Ví dụ: 500000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ghi chú / Lý do thưởng</label>
                                <textarea
                                    value={bonusForm.notes}
                                    onChange={(e) => setBonusForm({ ...bonusForm, notes: e.target.value })}
                                    rows="3"
                                    className="w-full rounded-2xl border-2 border-slate-100 p-4 font-bold text-[#041837] focus:border-amber-500 outline-none transition resize-none"
                                    placeholder="Vượt KPI tư vấn tháng 3..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setBonusModal(null)}
                                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#041837] transition"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition active:scale-95"
                                >
                                    Lưu thưởng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VietQR Modal */}
            {qrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041837]/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[48px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative">
                        <button
                            onClick={() => setQrModal(null)}
                            className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition"
                        >
                            <HiX size={28} />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                                <HiQrcode size={32} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-[#041837] uppercase tracking-tight">VietQR Payout</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Quét mã bằng App Ngân hàng bất kỳ</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 aspect-square flex items-center justify-center overflow-hidden">
                                {(() => {
                                    const acc = qrModal.lawyer?.lawyer?.bank_account_number;
                                    const bank = qrModal.lawyer?.lawyer?.bank_name;

                                    if (!acc || !bank) {
                                        return (
                                            <div className="text-center p-6 space-y-4">
                                                <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                                                    <HiX size={24} />
                                                </div>
                                                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest leading-relaxed">
                                                    Luật sư chưa cập nhật<br />thông tin ngân hàng
                                                </p>
                                            </div>
                                        );
                                    }

                                    const bin = BANK_BIN_MAPPING[bank] || '970422'; // Default to MB if not found
                                    const amount = Math.round(Number(qrModal.lawyer_earning) + Number(qrModal.bonus_amount));
                                    const info = encodeURIComponent(`Quyet toan ${qrModal.month} LS ${qrModal.lawyer?.full_name}`);
                                    const name = encodeURIComponent(qrModal.lawyer?.lawyer?.bank_account_name || '');

                                    const qrUrl = `https://img.vietqr.io/image/${bin}-${acc}-compact2.jpg?amount=${amount}&addInfo=${info}&accountName=${name}`;

                                    return <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain" />;
                                })()}
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-left">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Luật sư</p>
                                        <p className="text-xs font-black text-[#041837] truncate">{qrModal.lawyer?.full_name}</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-2xl text-left">
                                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Số tiền</p>
                                        <p className="text-xs font-black text-emerald-600">{formatMoney(Number(qrModal.lawyer_earning) + Number(qrModal.bonus_amount))}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (window.confirm("Bạn đã chuyển tiền thành công qua ngân hàng?")) {
                                            handleConfirmPayout(qrModal.id, qrModal.notes, selectedMonth);
                                            setQrModal(null);
                                        }
                                    }}
                                    className="w-full py-5 bg-[#041837] text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition active:scale-95"
                                >
                                    Tôi đã chuyển khoản xong
                                </button>
                                <p className="text-[8px] text-slate-400 italic">Nhấn nút trên để hệ thống ghi nhận trạng thái "Đã tất toán"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayoutTab;
