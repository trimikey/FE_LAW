import React from 'react';
const isImage = (url) =>
    /\.(jpg|jpeg|png|webp)$/i.test(url);

const isPdf = (url) =>
    /\.pdf$/i.test(url);
const LawyerDetailModal = ({ lawyer, onClose, onVerify, onReject, onNegotiate, onUpdateFee }) => {
    if (!lawyer) return null;

    const [editingFee, setEditingFee] = React.useState(false);
    const [tempFee, setTempFee] = React.useState(Math.round(Number(lawyer.consultation_fee || 0) / 1.15));
    const [updatingFee, setUpdatingFee] = React.useState(false);

    React.useEffect(() => {
        setTempFee(Math.round(Number(lawyer.consultation_fee || 0) / 1.15));
    }, [lawyer.consultation_fee]);

    const handleSaveFee = async () => {
        setUpdatingFee(true);
        try {
            await onUpdateFee(lawyer.id, tempFee * 1.15);
            setEditingFee(false);
        } finally {
            setUpdatingFee(false);
        }
    };

    // Helper to convert absolute path to relative URL
    const getLicenseUrl = (path) => {
        if (!path) return null;
        const parts = path.split(/[\\/]/);
        const uploadIndex = parts.indexOf('uploads');
        if (uploadIndex !== -1) {
            return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}/${parts.slice(uploadIndex).join('/')}`;
        }
        return path;
    };

    const licenseUrl = getLicenseUrl(lawyer.license_file);

    const [negotiating, setNegotiating] = React.useState(false);
    const [negotiationMessage, setNegotiationMessage] = React.useState('');
    const [sending, setSending] = React.useState(false);

    const handleNegotiate = async () => {
        if (!negotiationMessage.trim()) return;
        setSending(true);
        try {
            await onNegotiate(lawyer.id, negotiationMessage);
            setNegotiating(false);
            setNegotiationMessage('');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col scale-in-center">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Chi tiết hồ sơ luật sư
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Thông tin cá nhân</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Họ tên:</span> {lawyer.user?.full_name}</p>
                                <p><span className="font-medium">Email:</span> {lawyer.user?.email}</p>
                                <p><span className="font-medium">SĐT:</span> {lawyer.user?.phone || 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Thông tin hành nghề</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Số thẻ LS:</span> {lawyer.bar_number}</p>
                                <p><span className="font-medium">Văn phòng:</span> {lawyer.law_firm || 'Chưa cập nhật'}</p>
                                <p><span className="font-medium">Kinh nghiệm:</span> {lawyer.years_of_experience ? `${lawyer.years_of_experience} năm` : 'Chưa cập nhật'}</p>
                                <div className="mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] underline">TÀI CHÍNH & ĐIỀU CHỈNH</p>
                                        {!editingFee ? (
                                            <button
                                                onClick={() => setEditingFee(true)}
                                                className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md"
                                            >
                                                THAY ĐỔI GIÁ
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingFee(false)}
                                                    className="text-[10px] font-bold text-slate-400 uppercase"
                                                >
                                                    HỦY
                                                </button>
                                                <button
                                                    onClick={handleSaveFee}
                                                    disabled={updatingFee}
                                                    className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md"
                                                >
                                                    {updatingFee ? '...' : 'LƯU'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {!editingFee ? (
                                        <div className="space-y-1">
                                            <p className="text-sm border-b border-amber-100 pb-1 mb-1">
                                                <span className="font-medium text-slate-500">Giá khách trả (115%):</span>
                                                <span className="float-right font-black text-emerald-600">{Number(lawyer.consultation_fee || 0).toLocaleString()}đ</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium text-slate-500">Lương luật sư (100%):</span>
                                                <span className="float-right font-black text-[#041837]">{Math.round(Number(lawyer.consultation_fee || 0) / 1.15).toLocaleString()}đ</span>
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-500">NHẬP LƯƠNG LUẬT SƯ (100%):</label>
                                                <input
                                                    type="number"
                                                    value={tempFee}
                                                    onChange={(e) => setTempFee(e.target.value)}
                                                    className="w-full mt-1 p-2 bg-white border border-amber-200 rounded-lg text-sm font-black outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div className="p-2 bg-white/50 rounded-lg border border-dashed border-amber-200">
                                                <p className="text-[10px] font-bold text-slate-400">DỰ KIẾN GIÁ HỆ THỐNG (115%):</p>
                                                <p className="text-lg font-black text-emerald-600">{(Number(tempFee) * 1.15).toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Chứng chỉ hành nghề</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Số chứng chỉ:</span> {lawyer.certificate_number || 'Chưa cập nhật'}</p>
                                    <p><span className="font-medium">Ngày cấp:</span> {lawyer.license_issued_date ? new Date(lawyer.license_issued_date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                                    <p><span className="font-medium">Ngày hết hạn:</span> {lawyer.license_expiry_date ? new Date(lawyer.license_expiry_date).toLocaleDateString('vi-VN') : '—'}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Chuyên môn</h3>
                                <p className="bg-gray-50 p-3 rounded-lg border">
                                    {lawyer.specialties || 'Chưa cập nhật'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tiểu sử</h3>
                        <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                            {lawyer.bio || 'Chưa có tiểu sử.'}
                        </p>
                    </div>

                    {/* License Image */}
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300">
                        {licenseUrl ? (
                            isImage(licenseUrl) ? (
                                <img
                                    src={licenseUrl}
                                    alt="Chứng chỉ hành nghề"
                                    className="max-w-full max-h-[500px] object-contain rounded shadow-sm"
                                />
                            ) : isPdf(licenseUrl) ? (
                                <iframe
                                    src={licenseUrl}
                                    title="Chứng chỉ hành nghề PDF"
                                    className="w-full h-[500px] rounded border"
                                />
                            ) : (
                                <a
                                    href={licenseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline font-medium"
                                >
                                    Tải file chứng chỉ
                                </a>
                            )
                        ) : (
                            <p className="text-gray-500 italic">Không có file chứng chỉ</p>
                        )}
                    </div>

                    {/* Negotiation Box */}
                    {negotiating && (
                        <div className="border-2 border-amber-200 bg-amber-50 p-6 rounded-2xl space-y-4 animate-in slide-in-from-bottom-5">
                            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Nội dung thương thảo mức phí</h3>
                            <textarea
                                value={negotiationMessage}
                                onChange={(e) => setNegotiationMessage(e.target.value)}
                                placeholder="Gửi yêu cầu điều chỉnh mức phí cho luật sư (ví dụ: Mức phí này hơi cao so với mặt bằng chung, vui lòng điều chỉnh xuống 800k...)"
                                className="w-full h-32 p-4 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setNegotiating(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-white rounded-lg transition"
                                >
                                    HỦY
                                </button>
                                <button
                                    onClick={handleNegotiate}
                                    disabled={sending || !negotiationMessage.trim()}
                                    className="px-6 py-2 bg-amber-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-amber-700 disabled:opacity-50 transition shadow-lg"
                                >
                                    {sending ? 'ĐANG GỬI...' : 'XÁC NHẬN GỬI MAIL'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t bg-gray-50 rounded-b-xl flex flex-wrap gap-3 justify-end items-center">
                    {!negotiating && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Đóng
                            </button>

                            <button
                                onClick={() => setNegotiating(true)}
                                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-bold border border-amber-200"
                            >
                                Thương thảo giá
                            </button>

                            <button
                                onClick={() => onReject(lawyer.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
                            >
                                Từ chối
                            </button>
                            <button
                                onClick={() => onVerify(lawyer.id)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Duyệt hồ sơ
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LawyerDetailModal;
