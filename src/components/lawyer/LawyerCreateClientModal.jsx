import React, { useState } from 'react';
import { HiX, HiUser, HiMail, HiPhone, HiPlus } from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LawyerCreateClientModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/lawyer/clients', formData);
            toast.success('Tạo hồ sơ khách hàng thành công');
            setFormData({ fullName: '', email: '', phone: '' });
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating client:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tạo hồ sơ khách hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-xl overflow-hidden rounded-[50px] bg-white shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />

                <div className="flex items-center justify-between border-b border-slate-50 px-10 py-8">
                    <div>
                        <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase">Tạo hồ sơ khách hàng</h3>
                        <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đăng ký thành viên mới vào hệ thống</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                    >
                        <HiX className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Họ và tên khách hàng</label>
                            <div className="relative">
                                <HiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-14 py-4 font-bold text-[#041837] outline-none focus:border-amber-500 transition-all"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Địa chỉ Email</label>
                            <div className="relative">
                                <HiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-14 py-4 font-bold text-[#041837] outline-none focus:border-amber-500 transition-all"
                                    placeholder="client@example.com"
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 italic ml-4">* Email dùng để khách hàng đăng nhập. Mật khẩu mặc định: <span className="font-bold text-amber-600">Client@123</span></p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Số điện thoại</label>
                            <div className="relative">
                                <HiPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-14 py-4 font-bold text-[#041837] outline-none focus:border-amber-500 transition-all"
                                    placeholder="090x xxx xxx"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-5 rounded-2xl bg-[#041837] text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-[#041837] shadow-xl shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Đang khởi tạo...' : 'KÍCH HOẠT HỒ SƠ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LawyerCreateClientModal;
