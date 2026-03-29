import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { resolveAvatarUrl } from "../utils/avatar";
import ChangePasswordCard from "../components/profile/ChangePasswordCard";

const ClientHồ sơPage = () => {
  const navigate = useNavigate();
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

  const fetchHồ sơ = async () => {
    try {
      const response = await api.get("/client/my-profile");
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
    if (user && user.role_name !== "client") {
      toast.error("Trang này chỉ dành cho khách hàng.");
      navigate("/dashboard", { replace: true });
      return;
    }
    fetchHồ sơ();
  }, [user]);

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

      const response = await api.put("/client/my-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        toast.success("Cập nhật hồ sơ khách hàng thành công.");
        await fetchHồ sơ();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 sm:px-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ khách hàng</h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý thông tin cá nhân theo đúng vai trò khách hàng.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-gray-400">Avatar</span>
                )}
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Chọn ảnh đại diện
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                <p className="mt-2 text-xs text-gray-500">Định dạng hợp lệ: JPG, PNG, WEBP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu hồ sơ"}
              </button>
            </div>
          </form>
        </div>

        <ChangePasswordCard />
      </div>
    </div>
  );
};

export default ClientHồ sơPage;
