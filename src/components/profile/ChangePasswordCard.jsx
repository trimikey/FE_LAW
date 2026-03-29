import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

const ChangePasswordCard = () => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (!passwordRule.test(form.newPassword)) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (response.data?.success) {
        toast.success("Đổi mật khẩu thành công.");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể đổi mật khẩu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#041837] uppercase tracking-tight">Đổi mật khẩu</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nên cập nhật 3 tháng một lần để bảo mật</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 min-h-[1.5em] flex items-center">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 p-4 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
            placeholder="••••••••"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 whitespace-nowrap min-h-[1.5em] flex items-center">Mật khẩu mới</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 p-4 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 whitespace-nowrap min-h-[1.5em] flex items-center">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 p-4 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-14 rounded-2xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {saving ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordCard;
