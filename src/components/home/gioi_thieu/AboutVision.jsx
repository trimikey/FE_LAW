import { useState } from 'react';

const slides = [
    {
        title: "SỨ MỆNH",
        icon: "🎯",
        content: "Sứ mệnh của chúng tôi là trở thành cầu nối tin cậy nhất giữa người dân, doanh nghiệp và cộng đồng luật sư. Chúng tôi cam kết mang đến giải pháp pháp lý nhanh chóng, chính xác và hiệu quả, giúp mọi người dễ dàng tiếp cận công lý và bảo vệ quyền lợi hợp pháp của mình."
    },
    {
        title: "TẦM NHÌN",
        icon: "🔭",
        content: "Trở thành nền tảng công nghệ pháp lý (Legal Tech) hàng đầu tại Việt Nam và khu vực, tiên phong trong việc chuyển đổi số ngành luật. Chúng tôi hướng tới việc xây dựng một hệ sinh thái pháp lý toàn diện, nơi mọi nhu cầu pháp lý đều được giải quyết chỉ bằng vài cú click chuột."
    }
];

const AboutVision = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    return (
        <section className="bg-slate-50 py-24 text-center relative">
            {/* Background decoration lines (optional) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                <div className="border-t border-slate-300 w-full absolute top-1/2"></div>
            </div>

            <h3 className="text-blue-900 font-bold text-xl uppercase tracking-widest mb-10 relative z-10">
                TẦM NHÌN VÀ SỨ MỆNH
            </h3>

            <div className="max-w-4xl mx-auto relative px-4">
                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition shadow-lg z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition shadow-lg z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Card */}
                <div className="bg-white shadow-2xl border border-gray-100 rounded-xl p-12 relative z-10 transition-all duration-500 ease-in-out">
                    <div className="w-16 h-16 bg-red-500 text-white rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-md">
                        {slides[current].icon}
                    </div>

                    <h4 className="text-yellow-500 font-bold text-2xl mb-6 uppercase tracking-wide">
                        {slides[current].title}
                    </h4>

                    <div className="w-20 h-1 bg-gray-200 mx-auto mb-6"></div>

                    <p className="text-slate-600 leading-relaxed text-lg italic">
                        "{slides[current].content}"
                    </p>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-3 mt-8">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-yellow-500 w-8' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        ></button>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default AboutVision
