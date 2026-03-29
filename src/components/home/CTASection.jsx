import { Link } from "react-router-dom";
import logo from "../../assets/Logo_Hieuluat2-removebg-preview.png";
import gavel from "../../assets/hammer.png";

const CtaSection = () => {
  return (
    <section className="py-24 relative z-30 bg-slate-100 overflow-visible -mb-32">
      <div
        className="
          max-w-6xl mx-auto 
          flex flex-col md:flex-row items-center justify-between
          bg-white
          shadow-2xl
          border border-slate-100
          p-12
          relative
        "
      >
        {/* Logo trái */}
        <img
          src={logo}
          alt="Hiểu Luật"
          className="hidden md:block w-32 opacity-90"
        />

        {/* Nội dung */}
        <div className="text-center md:text-left max-w-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-5 leading-snug">
            KẾT NỐI NGAY VỚI ĐỘI NGŨ <br />
            CHUYÊN VIÊN CỦA CHÚNG TÔI!
          </h3>

          <Link
            to="/contact"
            className="
              inline-block 
              bg-yellow-500 text-white 
              px-8 py-3 
              font-semibold 
              rounded-lg
              hover:bg-yellow-600
              transition
            "
          >
            LIÊN HỆ NGAY →
          </Link>
        </div>

        {/* Ảnh phải – cho tràn */}
        <img
          src={gavel}
          alt="Law"
          className="
    hidden md:block 
-   w-56
-   absolute -right-20 top-1/2 -translate-y-1/2
+   w-44
+   absolute
+   -right-24
+   top-1/2
+   translate-y-8
  "
        />
      </div>
    </section>
  );
};

export default CtaSection;
