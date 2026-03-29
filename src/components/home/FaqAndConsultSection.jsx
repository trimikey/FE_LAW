import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import logoHieuLuat from '../../assets/Logo_Hieuluat2-removebg-preview.png';

const faqs = [
  {
    question: "Làm thế nào để đăng ký luật sư tư vấn và gửi tài liệu đến luật sư?",
    answer:
      "Bạn chỉ cần đăng ký tài khoản, chọn luật sư phù hợp và gửi nội dung vụ việc kèm tài liệu trực tiếp trên nền tảng."
  },
  {
    question: "Đăng ký tài khoản và gửi hồ sơ có mất phí không?",
    answer:
      "Việc đăng ký tài khoản và gửi hồ sơ hoàn toàn miễn phí. Bạn chỉ thanh toán khi sử dụng dịch vụ tư vấn chính thức."
  },
  {
    question: "Tôi có thể yêu cầu tư vấn từ nhiều luật sư cho cùng một vấn đề không?",
    answer:
      "Có. Bạn có thể gửi yêu cầu đến nhiều luật sư để so sánh và lựa chọn phương án phù hợp nhất."
  }
];

const FaqAndConsultSection = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Chủ đề câu hỏi",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("Vui lòng điền đầy đủ các trường thông tin.");
      return;
    }

    try {
      setLoading(true);
      // Map frontend fields to backend expected fields
      const inquiryData = {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        content: `[${form.subject}] ${form.message}`
      };

      const response = await api.post("/inquiries", inquiryData);
      if (response.data.success) {
        toast.success("Yêu cầu của bạn đã được gửi thành công!");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "Chủ đề câu hỏi",
          message: ""
        });
      }
    } catch (error) {
      console.error("Home inquiry submission error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT - FAQ */}
      <div className="bg-gradient-to-b from-[#2f4f75] to-[#1f3655] text-white px-8 lg:px-20 py-20">
        <h3 className="text-3xl font-extrabold mb-4">
          CÂU HỎI THƯỜNG GẶP
        </h3>
        <p className="text-gray-200 mb-10 max-w-md">
          Giải đáp những thắc mắc phổ biến nhất từ khách hàng, giúp bạn hiểu rõ
          hơn về dịch vụ của chúng tôi.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/20 pb-4">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg"
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                {faq.question}
                <span className="text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <p className="mt-3 text-gray-200 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="bg-gray-100 px-8 lg:px-20 py-20 relative">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-8">
          GIẢI ĐÁP MIỄN PHÍ
        </h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Tên"
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            placeholder="Số điện thoại"
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>Chủ đề câu hỏi</option>
            <option>Dân sự</option>
            <option>Hình sự</option>
            <option>Doanh nghiệp</option>
            <option>Hôn nhân gia đình</option>
          </select>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tin nhắn"
            rows={4}
            className="md:col-span-2 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-fit bg-yellow-500 text-white font-semibold px-6 py-3 rounded hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "ĐANG GỬI..." : "GỬI NGAY →"}
          </button>
        </form>

        {/* LOGO MỜ */}
        <div className="absolute bottom-8 right-8 opacity-10 hidden lg:block">
          <img
            src={logoHieuLuat}
            alt="Hiểu Luật"
            className="w-40 h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default FaqAndConsultSection;
