import { Link } from "react-router-dom";
import lawBadge from "../../assets/Logo_Hieuluat2-removebg-preview.png"; // ảnh hình lục giác

const MarketingSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT - IMAGE */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={lawBadge}
              alt="Đăng ký ngay"
              className="w-[420px] lg:w-[480px] opacity-90"
            />
       
          </div>
        </div>

        {/* RIGHT - CONTENT */}
        <div>
          <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-snug mb-6">
            Hiểu Luật – NƠI KHÁCH HÀNG <br />
            <span className="text-blue-700">GẶP GỠ LUẬT SƯ</span>
          </h3>

          <p className="text-gray-600 leading-relaxed mb-6">
            Bạn đang cần tìm một luật sư đáng tin cậy để hỗ trợ giải quyết vấn đề
            pháp lý?  Hiểu Luật giúp bạn kết nối nhanh chóng với luật sư phù
            hợp mà không mất nhiều thời gian và công sức.
          </p>

          <ul className="space-y-3 text-gray-700 mb-8">
            {[
              "Luật sư đăng ký và hoàn thiện hồ sơ cá nhân trên nền tảng.",
              "Người dùng đăng ký tài khoản để sử dụng các tính năng.",
              "Tìm kiếm và lựa chọn luật sư phù hợp theo nhu cầu.",
              "Gửi thông tin vụ việc và tài liệu đính kèm.",
              "Luật sư nhận thông báo và xử lý yêu cầu nhanh chóng.",
              "Theo dõi trạng thái vụ việc minh bạch, hiệu quả."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition"
            >
              LIÊN HỆ CHÚNG TÔI →
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 border-2 border-blue-700 text-blue-700 font-semibold rounded-md hover:bg-blue-50 transition"
            >
              ĐỌC THÊM →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
