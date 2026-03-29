const values = [
    {
        title: 'ĐỘI NGŨ HÀNG ĐẦU',
        desc: 'Quy tụ đội ngũ luật sư, chuyên gia pháp lý giỏi chuyên môn, giàu kinh nghiệm, tận tâm với nghề.',
        icon: '👤'
    },
    {
        title: 'DỊCH VỤ TOÀN DIỆN',
        desc: 'Cung cấp đa dạng các dịch vụ pháp lý, đáp ứng mọi nhu cầu từ tư vấn, tranh tụng đến đại diện ngoài tố tụng.',
        icon: '⚖️'
    },
    {
        title: 'GIẢI PHÁP TỐI ƯU',
        desc: 'Luôn nỗ lực tìm kiếm và đề xuất giải pháp pháp lý hiệu quả nhất, tiết kiệm thời gian và chi phí cho khách hàng.',
        icon: '💡'
    }
]

const AboutCoreValues = () => {
    return (
        <section className="bg-gradient-to-b from-slate-100 to-white py-24">
            <h3 className="text-center text-blue-900 font-bold mb-12 uppercase tracking-widest text-xl">
                GIÁ TRỊ CỐT LÕI
            </h3>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                {values.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-100 shadow-xl rounded-xl p-10 text-center hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 bg-white border-2 border-yellow-500 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm relative">
                            <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-900 text-white text-sm font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {i + 1}
                            </span>
                            {item.icon}
                        </div>

                        <h4 className="font-bold text-blue-900 mb-4 text-lg">
                            {item.title}
                        </h4>

                        <div className="w-10 h-0.5 bg-gray-200 mx-auto mb-4"></div>

                        <p className="text-slate-600 text-sm leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AboutCoreValues
