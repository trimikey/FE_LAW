import videoImg from '../../../assets/anh-trai_luat.png'

const AboutDifference = () => {
    return (
        <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-950 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 px-4">

                <div>
                    <h3 className="font-bold mb-6 text-xl uppercase tracking-widest border-l-4 border-yellow-500 pl-4">
                        SỰ KHÁC BIỆT TẠO NÊN GIÁ TRỊ
                    </h3>

                    <p className="text-blue-100 mb-10 leading-relaxed">
                        Với phương châm "Tận tâm - Uy tín - Chuyên nghiệp", chúng tôi không ngừng nỗ lực để mang lại những giá trị tốt đẹp nhất cho khách hàng và xã hội.
                    </p>

                    <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                        <div>
                            <div className="text-3xl font-bold text-yellow-400 mb-1">9999+</div>
                            <div className="text-sm text-blue-200 uppercase tracking-wide">Luật sư thành viên</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-yellow-400 mb-1">9999+</div>
                            <div className="text-sm text-blue-200 uppercase tracking-wide">Khách hàng tin dùng</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-yellow-400 mb-1">9999+</div>
                            <div className="text-sm text-blue-200 uppercase tracking-wide">Vụ việc giải quyết</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-yellow-400 mb-1">100%</div>
                            <div className="text-sm text-blue-200 uppercase tracking-wide">Bảo mật thông tin</div>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <img
                        src={videoImg}
                        alt="Video"
                        className="relative rounded-lg shadow-2xl w-full object-cover transform transition duration-500 hover:scale-[1.01]"
                    />

                    <button className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white pl-1">
                            <span className="text-4xl text-white">▶</span>
                        </div>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default AboutDifference
