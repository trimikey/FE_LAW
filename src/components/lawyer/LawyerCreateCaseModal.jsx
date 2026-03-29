import { useState, useEffect } from 'react';
import { HiSearch, HiCheckCircle, HiX } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LawyerCreateCaseModal = ({ isOpen, onClose, onSuccess, onAddClient }) => {
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        caseType: 'tax',
        priority: 'medium',
        estimatedFee: '2000000',
        notes: '',
        paymentMode: 'step_by_step',
        intakeData: {
            whatHappened: '',
            whenHappened: '',
            whoInvolved: '',
            receivedNotice: false,
            noticeType: ''
        }
    });

    const [accessRights, setAccessRights] = useState({
        viewProgress: true,
        uploadDocs: false,
        receiveNotifs: true,
        viewInvoices: false,
    });

    // Client Search logic
    useEffect(() => {
        const fetchClients = async () => {
            setSearching(true);
            try {
                const res = await api.get(`/lawyer/search-clients?search=${searchTerm}`);
                setSearchResults(res.data.data || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setSearching(false);
            }
        };

        if (isOpen) {
            const delayDebounceFn = setTimeout(() => {
                fetchClients();
            }, searchTerm ? 500 : 0);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchTerm, isOpen]);

    if (!isOpen) return null;

    const handleToggle = (key) => {
        setAccessRights((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCreateCase = async () => {
        if (!selectedClient) {
            toast.error('Vui lòng chọn khách hàng');
            return;
        }
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tên vụ việc');
            return;
        }

        const fee = Number(formData.estimatedFee);
        if (fee < 2000000) {
            toast.error('Phí dự kiến tối thiểu phải từ 2,000,000 VNĐ');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                clientId: selectedClient.id,
                ...formData,
                intakeData: formData.intakeData,
                accessRights // Optional: if you want to save these
            };

            const res = await api.post('/lawyer/cases', payload);

            if (res.data.success) {
                toast.success('Tạo vụ việc thành công!');
                if (onSuccess) onSuccess();
                onClose();
                // Reset form
                setSelectedClient(null);
                setSearchTerm('');
                setFormData({
                    title: '',
                    description: '',
                    caseType: 'tax',
                    priority: 'medium',
                    estimatedFee: '2000000',
                    notes: ''
                });
            }
        } catch (error) {
            console.error('Create case error:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo vụ việc');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">

                    <h2 className="text-xl font-bold text-gray-900 mb-6">Tạo vụ việc mới</h2>

                    {/* Client Search */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Tìm kiếm khách hàng hiện có <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (selectedClient) setSelectedClient(null);
                                }}
                                placeholder="Nhập tên, email hoặc số điện thoại..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />

                            {/* Search Results Dropdown / Quick List */}
                            {!selectedClient && (
                                <div className="mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                                    <div className="p-2 border-b border-gray-50 bg-slate-50/50">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">
                                            {searchTerm ? 'Kết quả tìm kiếm' : 'Danh sách khách hàng'}
                                        </p>
                                    </div>
                                    {searching ? (
                                        <div className="p-10 text-center">
                                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                            <p className="text-xs text-gray-500 font-medium italic">Đang tải danh sách...</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map(client => (
                                            <div
                                                key={client.id}
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setSearchTerm(client.full_name);
                                                    // Keep results but hide via selectedClient logic
                                                }}
                                                className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {client.full_name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{client.full_name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{client.email} {client.phone && `• ${client.phone}`}</p>
                                                </div>
                                                <div className="ml-auto opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">CHỌN</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center">
                                            <p className="text-sm text-gray-500">Không tìm thấy khách hàng nào</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedClient && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                        {selectedClient.full_name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-blue-900">{selectedClient.full_name}</span>
                                </div>
                                <button onClick={() => setSelectedClient(null)} className="text-blue-400 hover:text-blue-600 p-1">
                                    <HiX className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {!selectedClient && (
                            <p className="text-xs text-gray-500 mt-2.5">
                                Hoặc <button
                                    type="button"
                                    onClick={() => {
                                        if (onAddClient) onAddClient();
                                    }}
                                    className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    + Tạo khách hàng mới
                                </button>
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Tên vụ việc <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="VD: Tranh chấp quyền sử dụng đất..."
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        />
                    </div>

                    {/* Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Loại vụ việc <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.caseType}
                                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none cursor-pointer"
                            >
                                <option value="tax">Thuế</option>
                                <option value="tax_transfer">Thuế chuyển nhượng</option>
                                <option value="business">Kinh doanh</option>
                                <option value="corporate">Doanh nghiệp SME</option>
                                <option value="contract">Hợp đồng thương mại</option>
                                <option value="labor">Lao động và Nhân sự</option>
                                <option value="dispute">Tranh chấp kinh doanh</option>
                                <option value="other">Loại khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Mức độ ưu tiên <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none cursor-pointer"
                            >
                                <option value="urgent">Khẩn cấp</option>
                                <option value="high">Cao</option>
                                <option value="medium">Trung bình</option>
                                <option value="low">Thấp</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Dự kiến phí vụ việc (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={formData.estimatedFee}
                                onChange={(e) => setFormData({ ...formData, estimatedFee: e.target.value })}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Hình thức thanh toán <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.paymentMode}
                                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none cursor-pointer"
                            >
                                <option value="step_by_step">Theo từng giai đoạn</option>
                                <option value="lump_sum">Trọn gói (Sau khi hoàn việc)</option>
                            </select>
                        </div>
                    </div>

                    {/* Intake Section */}
                    <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                        <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
                            Thông tin tiếp nhận (Intake)
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-amber-700 uppercase mb-2 ml-1">Chuyện gì đã xảy ra?</label>
                                <textarea
                                    rows={2}
                                    value={formData.intakeData.whatHappened}
                                    onChange={(e) => setFormData({ ...formData, intakeData: { ...formData.intakeData, whatHappened: e.target.value } })}
                                    placeholder="Mô tả tóm tắt sự việc..."
                                    className="w-full p-4 bg-white border border-amber-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-amber-700 uppercase mb-2 ml-1">Khi nào xảy ra?</label>
                                    <input
                                        type="text"
                                        value={formData.intakeData.whenHappened}
                                        onChange={(e) => setFormData({ ...formData, intakeData: { ...formData.intakeData, whenHappened: e.target.value } })}
                                        placeholder="Ví dụ: Sáng thứ 2 tuần trước"
                                        className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-amber-700 uppercase mb-2 ml-1">Liên quan đến ai?</label>
                                    <input
                                        type="text"
                                        value={formData.intakeData.whoInvolved}
                                        onChange={(e) => setFormData({ ...formData, intakeData: { ...formData.intakeData, whoInvolved: e.target.value } })}
                                        placeholder="Tên cá nhân/tổ chức..."
                                        className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-8 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.intakeData.receivedNotice}
                                        onChange={(e) => setFormData({ ...formData, intakeData: { ...formData.intakeData, receivedNotice: e.target.checked } })}
                                        className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-sm font-bold text-amber-900">Đã nhận thông báo?</span>
                                </label>

                                {formData.intakeData.receivedNotice && (
                                    <div className="flex-1">
                                        <select
                                            value={formData.intakeData.noticeType}
                                            onChange={(e) => setFormData({ ...formData, intakeData: { ...formData.intakeData, noticeType: e.target.value } })}
                                            className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                                        >
                                            <option value="">-- Chọn loại thông báo --</option>
                                            <option value="tax_notice">Thông báo thuế</option>
                                            <option value="invitation">Giấy mời làm việc</option>
                                            <option value="sanction_decision">Quyết định xử phạt</option>
                                            <option value="other">Loại khác</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Access Rights */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-900 mb-4">
                            Quyền truy cập của khách hàng
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div
                                onClick={() => handleToggle('viewProgress')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${accessRights.viewProgress ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded shadow-sm border flex items-center justify-center shrink-0 ${accessRights.viewProgress ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'
                                    }`}>
                                    {accessRights.viewProgress && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">Xem tiến độ</h4>
                                    <p className="text-[10px] text-gray-500">Khách hàng có thể xem trạng thái vụ việc</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleToggle('uploadDocs')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${accessRights.uploadDocs ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded shadow-sm border flex items-center justify-center shrink-0 ${accessRights.uploadDocs ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'
                                    }`}>
                                    {accessRights.uploadDocs && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">Tải lên tài liệu</h4>
                                    <p className="text-[10px] text-gray-500">Cho phép bổ sung hồ sơ trực tuyến</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleToggle('receiveNotifs')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${accessRights.receiveNotifs ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded shadow-sm border flex items-center justify-center shrink-0 ${accessRights.receiveNotifs ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'
                                    }`}>
                                    {accessRights.receiveNotifs && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">Nhận thông báo</h4>
                                    <p className="text-[10px] text-gray-500">Gửi cập nhật qua Email/Zalo</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleToggle('viewInvoices')}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${accessRights.viewInvoices ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                <div className={`mt-0.5 w-4 h-4 rounded shadow-sm border flex items-center justify-center shrink-0 ${accessRights.viewInvoices ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'
                                    }`}>
                                    {accessRights.viewInvoices && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">Xem hóa đơn</h4>
                                    <p className="text-[10px] text-gray-500">Truy cập lịch sử thanh toán</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Mô tả chi tiết / Ghi chú nội bộ
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Nhập mô tả về vụ việc hoặc ghi chú nội bộ..."
                            className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-y min-h-[100px]"
                        ></textarea>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateCase}
                        disabled={loading}
                        className={`px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <HiCheckCircle className="w-5 h-5 text-white" />
                        )}
                        {loading ? 'Đang tạo...' : 'Xác nhận tạo vụ việc'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LawyerCreateCaseModal;
