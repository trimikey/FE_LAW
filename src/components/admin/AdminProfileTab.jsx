import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { resolveAvatarUrl } from "../../utils/avatar";
import ChangePasswordCard from "../profile/ChangePasswordCard";
import { HiUser, HiPhone, HiMail, HiCloudUpload, HiCheckCircle, HiLockClosed, HiShieldCheck } from "react-icons/hi";

const AdminProfileTab = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
    });

    const fetchProfile = async () => {
        try {
            const response = await api.get("/admin/my-profile");
            if (response.data?.success) {
                const profileUser = response.data.data?.user;
                setForm({
                    fullName: profileUser?.full_name || "",
                    phone: profileUser?.phone || "",
                    email: profileUser?.email || "",
                });
                setAvatarPreview(resolveAvatarUrl(profileUser?.avatar));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Không thể lấy thông tin hồ sơ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("phone", form.phone);
            if (avatarFile) formData.append("avatar", avatarFile);

            const response = await api.put("/admin/my-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data?.success) {
                toast.success("Cập nhật hồ sơ thành công.");
                await fetchProfile();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi cập nhật hồ sơ.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-8 bg-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">System Administrator</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#041837] tracking-tight uppercase">Hồ sơ quản trị</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-[#041837] hover:bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-10">
                    <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm text-center">
                        <div className="relative group mx-auto w-48 h-48 mb-8">
                            <div className="w-full h-full rounded-[48px] overflow-hidden border-8 border-slate-50 shadow-2xl transition-transform group-hover:scale-[1.02] duration-500 bg-slate-100 flex items-center justify-center">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <HiUser className="h-20 w-20 text-slate-300" />
                                )}
                            </div>
                            <label className="absolute -bottom-4 -right-4 h-14 w-14 bg-amber-500 rounded-2xl flex items-center justify-center text-[#041837] shadow-xl cursor-pointer hover:bg-[#041837] hover:text-white transition-all border-4 border-white">
                                <HiCloudUpload size={24} />
                                <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                            </label>
                        </div>
                        <h3 className="text-2xl font-black text-[#041837] uppercase tracking-tight mb-2">{form.fullName || 'Quản trị viên'}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{form.email}</p>
                        <div className="flex justify-center gap-2">
                            <span className="px-3 py-1 bg-red-50 text-[9px] font-black text-red-600 rounded-lg uppercase tracking-widest border border-red-100 flex items-center gap-1">
                                <HiShieldCheck className="h-3 w-3" />
                                ROOT ADMIN
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 rounded-lg uppercase tracking-widest border border-blue-100">
                                Hệ thống
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform group-hover:scale-110 transition-transform">
                            <HiLockClosed className="h-32 w-32 text-[#041837]" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-[#041837] uppercase tracking-tight mb-4">Bảo mật hệ thống</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">Bạn đang truy cập với quyền quản trị viên cao nhất. Hãy bảo mật mật khẩu của mình cẩn thận.</p>
                            <ChangePasswordCard />
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-sm relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                            <HiShieldCheck className="h-64 w-64 text-[#041837]" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-[#041837] uppercase tracking-tight mb-10">Thông tin quản trị</h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Họ và tên đầy đủ</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={form.fullName}
                                                onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))}
                                                className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 p-5 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
                                            />
                                            <HiUser className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 h-5 w-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Số điện thoại liên hệ</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={form.phone}
                                                onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                                                className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 p-5 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
                                            />
                                            <HiPhone className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 h-5 w-5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Địa chỉ Email Quản trị</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={form.email}
                                            disabled
                                            className="w-full rounded-2xl border-2 border-slate-50 bg-slate-100 p-5 text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                                        />
                                        <HiMail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 h-5 w-5" />
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <div className="p-6 rounded-3xl bg-red-50 border border-red-100">
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                            Cảnh báo bảo mật
                                        </p>
                                        <p className="text-xs text-red-700/80 font-medium leading-relaxed italic">
                                            Mọi thay đổi trong hồ sơ quản trị sẽ được ghi lại trong nhật ký hệ thống (Audit Log). Hãy đảm bảo các thông tin này là chính xác để phục vụ việc xác thực 2 lớp nếu cần.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileTab;
