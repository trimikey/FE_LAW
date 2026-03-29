import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiClock, HiCheckCircle, HiUserCircle, HiChatAlt2, HiPlus, HiX } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';

const ClientInquiriesTab = () => {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newInquiry, setNewInquiry] = useState({
        content: ''
    });

    const fetchMyInquiries = async () => {
        try {
            setLoading(true);
            const res = await api.get('/inquiries/my-inquiries');
            if (res.data?.success) {
                setInquiries(res.data.data.inquiries);
            }
        } catch (error) {
            console.error('Fetch inquiries error:', error);
            toast.error('Lỗi khi tải danh sách yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyInquiries();
    }, []);

    const handleCreateInquiry = async (e) => {
        e.preventDefault();
        if (!newInquiry.content.trim()) {
            toast.error('Vui lòng nhập nội dung yêu cầu');
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await api.post('/inquiries', {
                fullName: user.full_name,
                email: user.email,
                phone: user.phone || 'Chưa cập nhật',
                content: newInquiry.content
            });

            if (res.data.success) {
                toast.success('Gửi yêu cầu thành công!');
                setIsModalOpen(false);
                setNewInquiry({ content: '' });
                fetchMyInquiries();
            }
        } catch (error) {
            console.error('Create inquiry error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi gửi yêu cầu');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Section with Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-[#041837] uppercase tracking-tight">Yêu cầu tư vấn của bạn</h2>
                    <p className="text-slate-400 text-sm font-medium">Theo dõi và gửi các yêu cầu hỗ trợ pháp lý nhanh chóng</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#041837] font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95"
                >
                    <HiPlus className="h-4 w-4" />
                    Gửi yêu cầu mới
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="flex py-20 items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="rounded-[40px] border-2 border-dashed border-slate-100 bg-white py-32 text-center flex flex-col items-center justify-center">
                        <HiChatAlt2 className="h-16 w-16 text-slate-100 mb-6" />
                        <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px]">Bạn chưa gửi yêu cầu tư vấn nào</p>
                    </div>
                ) : (
                    inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="group relative bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            {/* Left accent color based on status */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all ${inquiry.status === 'pending' ? 'bg-amber-400' :
                                inquiry.status === 'contacted' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`} />

                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                            inquiry.status === 'contacted' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            {inquiry.status === 'pending' ? 'Đang chờ xử lý' :
                                                inquiry.status === 'contacted' ? 'Luật sư đang xử lý' : 'Đã hoàn thành'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Gửi ngày: {new Date(inquiry.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Nội dung yêu cầu của bạn</h3>
                                    <p className="p-6 bg-slate-50 rounded-3xl text-sm text-slate-600 font-medium italic leading-relaxed shadow-inner border border-slate-100">
                                        "{inquiry.content}"
                                    </p>
                                </div>

                                {/* Lawyer Section (Response) */}
                                <div className="lg:w-1/3 border-l border-slate-100 lg:pl-8 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <HiUserCircle className="h-6 w-6 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#041837]">Luật sư phản hồi</span>
                                    </div>

                                    {inquiry.assigned_lawyer ? (
                                        <div className="bg-white rounded-3xl space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
                                                    {inquiry.assigned_lawyer.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#041837] uppercase">{inquiry.assigned_lawyer.full_name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">Đã tiếp nhận yêu cầu</p>
                                                </div>
                                            </div>

                                            {inquiry.lawyer_reply && (
                                                <div className="mt-4 p-5 bg-emerald-50 rounded-[24px] border border-emerald-100/50">
                                                    <p className="text-xs font-bold text-[#041837] leading-relaxed">
                                                        {inquiry.lawyer_reply}
                                                    </p>
                                                </div>
                                            )}
                                            {!inquiry.lawyer_reply && inquiry.status === 'contacted' && (
                                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-dashed border-blue-200 text-center">
                                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest animate-pulse">Luật sư đang soạn phản hồi chuyên sâu...</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center py-6">
                                            <HiClock className="h-10 w-10 text-slate-100 mb-3" />
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">Đang chờ luật sư phù hợp tiếp nhận...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Inquiry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#041837]/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Gửi yêu cầu tư vấn mới</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Hệ thống sẽ kết nối bạn với luật sư phù hợp</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all"
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateInquiry} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Họ và tên</p>
                                        <p className="font-bold text-[#041837]">{user?.full_name}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email liên hệ</p>
                                        <p className="font-bold text-[#041837]">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung cần tư vấn</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={newInquiry.content}
                                        onChange={(e) => setNewInquiry({ content: e.target.value })}
                                        placeholder="Mô tả chi tiết vấn đề pháp lý của bạn để nhận được phản hồi chính xác nhất..."
                                        className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm font-medium leading-relaxed outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-5 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-[#041837] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        'Gửi yêu cầu ngay'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientInquiriesTab;
