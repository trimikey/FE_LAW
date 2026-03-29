import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiUser, HiPhone, HiIdentification, HiOfficeBuilding, HiTranslate, HiClock, HiCurrencyDollar, HiAcademicCap, HiCloudUpload, HiCheckCircle, HiChevronRight } from 'react-icons/hi';
import { resolveAvatarUrl } from '../../utils/avatar';

const ProfileUpdateTab = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        fullName: '',
        phone: '',
        barNumber: '',
        certificateNumber: '',
        lawFirm: '',
        specialties: [],
        yearsOfExperience: '',
        bio: '',
        education: '',
        expectedSalary: '',
        city: '',
        avatar: '',
        bankName: '',
        bankAccountNumber: '',
        bankAccountName: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/lawyer/my-profile');
            if (res.data?.success) {
                const { user, lawyer } = res.data.data;
                let specs = [];
                try {
                    specs = typeof lawyer.specialties === 'string' ? JSON.parse(lawyer.specialties) : (lawyer.specialties || []);
                } catch (e) {
                    specs = [];
                }

                setProfile({
                    fullName: user.full_name || '',
                    phone: user.phone || '',
                    avatar: user.avatar || '',
                    barNumber: lawyer.bar_number || '',
                    certificateNumber: lawyer.certificate_number || '',
                    lawFirm: lawyer.law_firm || '',
                    specialties: specs,
                    yearsOfExperience: lawyer.years_of_experience || '',
                    bio: lawyer.bio || '',
                    education: lawyer.education || '',
                    expectedSalary: lawyer.consultation_fee ? Math.round(Number(lawyer.consultation_fee) / 1.15) : '',
                    city: lawyer.city || '',
                    bankName: lawyer.bank_name || '',
                    bankAccountNumber: lawyer.bank_account_number || '',
                    bankAccountName: lawyer.bank_account_name || ''
                });
                setAvatarPreview(resolveAvatarUrl(user.avatar));
            }
        } catch (error) {
            toast.error('Không thể lấy thông tin hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            Object.keys(profile).forEach(key => {
                if (key === 'specialties') {
                    formData.append(key, JSON.stringify(profile[key]));
                } else if (key === 'expectedSalary') {
                    formData.append('consultationFee', Number(profile.expectedSalary) * 1.15);
                } else {
                    formData.append(key, profile[key]);
                }
            });
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const res = await api.put('/lawyer/my-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data?.success) {
                toast.success('Cập nhật hồ sơ thành công');
                fetchProfile();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi cập nhật hồ sơ');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-24 animate-in fade-in duration-700">
            {/* Header / Banner Component */}
            <div className="relative h-64 rounded-[48px] overflow-hidden mb-16 shadow-2xl group">
                <div className="absolute inset-0 bg-[#041837] transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-amber-500/10" />

                {/* Decorative floating icon */}
                <div className="absolute top-1/2 right-20 -translate-y-1/2 opacity-10">
                    <HiIdentification className="h-48 w-48 text-white rotate-12" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-10 text-center">
                    <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Verification Center</span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Xác thực hồ sơ Luật sư</h1>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10">
                        <span>Hồ sơ công ty</span>
                        <HiChevronRight className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-500">Cập nhật thông tin nghiệp vụ</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                    <div>
                        <h2 className="text-3xl font-black text-[#041837] tracking-tight flex items-center gap-3">
                            <HiUser className="h-8 w-8 text-amber-500" />
                            Hồ sơ cá nhân & Đại diện
                        </h2>
                        <p className="mt-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cập nhật thông tin hiển thị với khách hàng tiềm năng</p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-amber-500 hover:bg-amber-600 text-[#041837] font-black py-4 px-10 text-xs tracking-widest uppercase rounded-[24px] shadow-2xl shadow-amber-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {saving ? 'Đang lưu...' : 'Lưu hồ sơ ngay'}
                        <HiCheckCircle className="h-4 w-4" />
                    </button>
                </div>

                {/* Avatar Section */}
                <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[32px] overflow-hidden border-8 border-slate-50 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                    <HiUser size={80} />
                                </div>
                            )}
                        </div>
                        <label className="absolute -bottom-4 -right-4 h-14 w-14 bg-[#041837] rounded-2xl flex items-center justify-center text-amber-500 shadow-xl cursor-pointer hover:bg-black transition-colors border-4 border-white">
                            <HiCloudUpload size={24} />
                            <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                        </label>
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-xl font-black text-[#041837] tracking-tight">Ảnh đại diện chuyên nghiệp</h3>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xl">Hệ thống khuyến khích sử dụng ảnh chân dung trang trọng để tăng tỷ lệ kết nối với khách hàng. Hỗ trợ định dạng JPG, PNG (tối đa 5MB).</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 rounded-lg uppercase tracking-widest">Đã xác minh email</span>
                            <span className="px-3 py-1 bg-amber-50 text-[9px] font-black text-amber-600 rounded-lg uppercase tracking-widest">Tài khoản cao cấp</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
                    {/* Column 1 */}
                    <div className="space-y-10">
                        {/* Section: Basic info */}
                        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <HiIdentification className="h-32 w-32 text-[#041837]" />
                            </div>
                            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className="block h-1 w-6 bg-amber-500 rounded-full"></span>
                                Thông tin cơ sở
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2 relative group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Họ & Tên hiển thị</label>
                                    <div className="relative">
                                        <input
                                            type="text" name="fullName" value={profile.fullName} onChange={handleChange}
                                            placeholder="VD: LS. Nguyễn Văn A"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all"
                                        />
                                        <HiUser className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Số điện thoại</label>
                                        <input
                                            type="text" name="phone" value={profile.phone} onChange={handleChange}
                                            placeholder="09xx xxx xxx"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tỉnh / Thành phố</label>
                                        <input
                                            type="text" name="city" value={profile.city} onChange={handleChange}
                                            placeholder="Hà Nội, TP. HCM..."
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Professional */}
                        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <HiAcademicCap className="h-32 w-32 text-[#041837]" />
                            </div>
                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className="block h-1 w-6 bg-blue-500 rounded-full"></span>
                                Bằng cấp & Nghiệp vụ
                            </h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Số thẻ luật sư</label>
                                        <input
                                            type="text" name="barNumber" value={profile.barNumber} onChange={handleChange}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-blue-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Số năm kinh nghiệm</label>
                                        <div className="relative">
                                            <input
                                                type="number" name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleChange}
                                                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-blue-500 focus:bg-white outline-none transition-all"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">NĂM</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Trường đào tạo / Chứng chỉ cao cấp</label>
                                    <input
                                        type="text" name="education" value={profile.education} onChange={handleChange}
                                        placeholder="Đại học Luật Hà Nội, Chứng chỉ tư vấn..."
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-10">
                        {/* Section: Organization & Fees */}
                        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <HiOfficeBuilding className="h-32 w-32 text-[#041837]" />
                            </div>
                            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className="block h-1 w-6 bg-emerald-500 rounded-full"></span>
                                Tổ chức & Tài chính
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tên tổ chức hành nghề (Law Firm)</label>
                                    <input
                                        type="text" name="lawFirm" value={profile.lawFirm} onChange={handleChange}
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tên ngân hàng</label>
                                        <input
                                            type="text" name="bankName" value={profile.bankName} onChange={handleChange}
                                            placeholder="MB Bank, VCB..."
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Số tài khoản</label>
                                        <input
                                            type="text" name="bankAccountNumber" value={profile.bankAccountNumber} onChange={handleChange}
                                            placeholder="123456789..."
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tên chủ tài khoản (Không dấu)</label>
                                    <input
                                        type="text" name="bankAccountName" value={profile.bankAccountName} onChange={handleChange}
                                        placeholder="NGUYEN VAN A"
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[20px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Lĩnh vực chuyên sâu (Cách nhau bằng dấu phẩy)</label>
                                    <textarea
                                        name="specialties"
                                        value={Array.isArray(profile.specialties) ? profile.specialties.join(', ') : profile.specialties}
                                        onChange={(e) => setProfile(p => ({ ...p, specialties: e.target.value.split(',').map(s => s.trim()) }))}
                                        placeholder="VD: Luật Doanh Nghiệp, Hình Sự, Dân Sự..."
                                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-6 py-4 text-sm font-bold text-[#041837] focus:border-emerald-500 focus:bg-white outline-none transition-all min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phí tư vấn bạn muốn nhận (VND)</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            name="expectedSalary"
                                            value={profile.expectedSalary}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[24px] px-6 py-4 text-sm font-black text-emerald-600 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner"
                                            placeholder="VD: 500000"
                                        />
                                        <HiCurrencyDollar className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-200 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>

                                    {profile.expectedSalary > 0 && (
                                        <div className="p-5 bg-emerald-50/50 rounded-[28px] border-2 border-emerald-100 space-y-3 shadow-inner">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-slate-500 uppercase tracking-widest">THU NHẬP LUẬT SƯ:</span>
                                                <span className="text-[#041837] bg-white px-3 py-1 rounded-lg shadow-sm">{Number(profile.expectedSalary).toLocaleString()}đ</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-slate-500 uppercase tracking-widest">PHÍ DỊCH VỤ HỆ THỐNG (15%):</span>
                                                <span className="text-amber-600 bg-white px-3 py-1 rounded-lg shadow-sm">{(Number(profile.expectedSalary) * 0.15).toLocaleString()}đ</span>
                                            </div>
                                            <div className="pt-3 border-t-2 border-dashed border-emerald-200 flex justify-between items-center text-[11px] font-black">
                                                <span className="text-[#041837] uppercase tracking-wider">GIÁ HIỂN THỊ TRÊN TẤT CẢ TIỆN ÍCH:</span>
                                                <span className="text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-xl shadow-md">{(Number(profile.expectedSalary) * 1.15).toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Section: Introduction */}
                        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <HiTranslate className="h-32 w-32 text-[#041837]" />
                            </div>
                            <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                <span className="block h-1 w-6 bg-rose-500 rounded-full"></span>
                                Giới thiệu & Chiến lược
                            </h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mô tả tiểu sử nghề nghiệp</label>
                                <textarea
                                    name="bio" value={profile.bio} onChange={handleChange}
                                    placeholder="Giới thiệu chi tiết về bản thân, các vụ việc đã thực hiện thành công và triết lý hành nghề..."
                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-6 py-6 text-sm font-medium text-slate-600 leading-8 focus:border-rose-500 focus:bg-white outline-none transition-all min-h-[220px]"
                                />
                            </div>
                        </section>
                    </div>
                </div>

                <div className="text-center pt-10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#041837] hover:bg-black text-white font-black py-6 px-20 text-xs tracking-[0.3em] uppercase rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'Đang đồng bộ dữ liệu...' : 'Xác nhận cập nhật hồ sơ'}
                    </button>
                    <p className="mt-6 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Mọi thay đổi sẽ được cập nhật ngay lập tức trên hệ thống tìm kiếm</p>
                </div>
            </form>
        </div>
    );
};

export default ProfileUpdateTab;
