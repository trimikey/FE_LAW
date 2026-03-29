import logo from '../../assets/Logo_Hieuluat2-removebg-preview.png';

const Footer = () => {
  return (
    <footer className="relative z-10 -mt-40 bg-gradient-to-b from-[#0f2a44] to-[#081d33] pt-56 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-12 md:grid-cols-4">
        <div>
          <img src={logo} alt="Hiểu Luật" className="mb-4 h-24 w-auto object-contain" />
          <p className="text-sm leading-relaxed text-gray-300">
            Hiểu Luật là nền tảng kết nối khách hàng với luật sư, công ty luật và
            chuyên gia pháp lý uy tín, hỗ trợ giải quyết vấn đề pháp lý nhanh chóng
            và hiệu quả.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold uppercase tracking-wide">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Trang chủ</li>
            <li>Giới thiệu</li>
            <li>Dịch vụ</li>
            <li>Tìm luật sư</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold uppercase tracking-wide">Thông tin liên hệ</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>(+84) 0938 744 798</li>
            <li>info@hieuluat.vn</li>
            <li>TP.HCM, Việt Nam</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold uppercase tracking-wide">Đăng ký nhận tin</h4>
          <p className="mb-4 text-sm text-gray-300">
            Nhận thông tin pháp lý và cập nhật mới nhất từ chúng tôi.
          </p>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="mb-3 w-full rounded p-3 text-black"
          />
          <button className="w-full rounded bg-yellow-500 py-2 font-semibold transition hover:bg-yellow-600">
            Gửi ngay →
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        © 2025 Hiểu Luật. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
