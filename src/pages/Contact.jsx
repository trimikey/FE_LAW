import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import BannerSection from "../components/home/search_lawyer/BannerSection";
import contactVisual from "../assets/anh-phai_luat.png";
import PartnerSection from "../components/home/PartnerSection";
import Footer from "../components/home/Footer";
import CtaSection from "../components/home/CTASection";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    content: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.content) {
      toast.error("Vui lòng điền đầy đủ các trường thông tin.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/inquiries", form);
      if (response.data.success) {
        toast.success(response.data.message || "Gửi yêu cầu thành công!");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          content: ""
        });
      }
    } catch (error) {
      console.error("Inquiry submission error:", error);
      toast.error(error.response?.data?.message || "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BannerSection
        title="Liên hệ và kết nối tư vấn"
        subtitle="Gửi yêu cầu cho đội ngũ Hiểu Luật để được sắp xếp luật sư phù hợp và phản hồi nhanh trong ngày làm việc."
        eyebrow="Hỗ trợ khách hàng"
        breadcrumb="Trang chủ / Liên hệ"
        rightImage={contactVisual}
        compact
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Thông tin văn phòng</h2>
            <p className="mt-2 text-slate-500">Chúng tôi hỗ trợ tư vấn trực tuyến, đặt lịch video và xử lý hồ sơ pháp lý theo tiến độ minh bạch.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Hotline</p>
                <p className="mt-2 text-lg font-bold text-slate-900">0345 142 309</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Email</p>
                <p className="mt-2 text-lg font-bold text-slate-900">hieuluat@gmail.com</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Địa chỉ</p>
                <p className="mt-2 text-lg font-bold text-slate-900">123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Giờ làm việc</p>
                <p className="mt-2 text-lg font-bold text-slate-900">08:00 - 17:30, Thứ 2 đến Thứ 7</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Gửi yêu cầu tư vấn</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <input
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0a2b57] focus:ring-4 focus:ring-blue-50"
                placeholder="Họ và tên"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0a2b57] focus:ring-4 focus:ring-blue-50"
                placeholder="Email"
              />
              <input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0a2b57] focus:ring-4 focus:ring-blue-50"
                placeholder="Số điện thoại"
              />
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0a2b57] focus:ring-4 focus:ring-blue-50"
                rows="5"
                placeholder="Nội dung cần tư vấn"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex rounded-2xl bg-[#f1b136] px-6 py-3 font-semibold text-slate-950 transition hover:bg-[#df9f22] disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi thông tin"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <PartnerSection />
      </div>

      <div className="relative z-20 mt-10">
        <CtaSection />
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
