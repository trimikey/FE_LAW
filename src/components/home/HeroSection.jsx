import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiSearch } from "react-icons/hi";

import slide1 from "../../assets/tp_dem_1.png";
import slide2 from "../../assets/back_gr_luat.png";

const slides = [
  {
    image: slide1,
    title: "Kết nối Luật sư & Khách hàng",
    eyebrow: "Hiểu Luật • Tư vấn Pháp lý số 1",
    description:
      "Nền tảng tư vấn pháp lý trực tuyến hàng đầu, kết nối khách hàng với các luật sư chuyên nghiệp, được xác thực và giàu kinh nghiệm trên toàn quốc.",
  },
  {
    image: slide2,
    title: "Giải pháp Pháp lý Minh bạch",
    eyebrow: "An tâm – Bảo mật – Hiệu quả",
    description:
      "Tìm kiếm, gửi yêu cầu tư vấn và theo dõi hồ sơ pháp lý dễ dàng chỉ với vài thao tác. Quy trình làm việc chuyên nghiệp chuẩn quốc tế.",
  },
];

const HeroSection = ({ isAuthenticated }) => {
  const hero = useScrollReveal();
  const [current, setCurrent] = useState(0);

  // Auto slide mỗi 4 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[92vh] overflow-hidden group">
      {/* Slides Background */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#041837]/60 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#041837]/40 via-transparent to-[#041837]/60"></div>
        </div>
      ))}

      {/* Content Overlay */}
      <div
        ref={hero.ref}
        key={current}
        className={`relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center
        transition-all duration-1000 ease-out
        ${hero.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <span className="mb-6 px-6 py-2 bg-amber-500/10 backdrop-blur-md rounded-full border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] animate-in slide-in-from-top-4 duration-700">
          {slides[current].eyebrow}
        </span>

        <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tight leading-[1.1] max-w-5xl">
          {slides[current].title.split('&').map((part, i) => (
            <span key={i}>
              {part}
              {i === 0 && slides[current].title.includes('&') && <span className="text-amber-500"> & </span>}
            </span>
          ))}
        </h2>

        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto font-medium text-slate-200 leading-relaxed">
          {slides[current].description}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/lawyer"
            className="h-16 px-12 rounded-[24px] bg-amber-500 text-[#041837] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/30 hover:bg-white transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <HiSearch size={20} />
            Khám phá kho luật sư
          </Link>

          <Link
            to="/contact"
            className="h-16 px-12 rounded-[24px] bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#041837] transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Gửi yêu cầu tư vấn
            <HiArrowRight size={20} />
          </Link>
        </div>

        {/* Floating elements hint */}
        <div className="mt-16 animate-bounce opacity-40">
          <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent mx-auto"></div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 bottom-12 z-20 px-8 flex justify-center items-center gap-8">
        <button
          onClick={prevSlide}
          className="h-14 w-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-amber-500 hover:text-[#041837] hover:border-amber-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <HiChevronLeft size={32} />
        </button>

        {/* Dots indicators */}
        <div className="flex gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 transition-all rounded-full ${i === current ? 'w-12 bg-amber-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="h-14 w-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white flex items-center justify-center hover:bg-amber-500 hover:text-[#041837] hover:border-amber-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <HiChevronRight size={32} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
