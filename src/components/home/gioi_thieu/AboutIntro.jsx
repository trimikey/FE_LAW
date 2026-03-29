import aboutImg from '../../../assets/anh-trai_luat.png'

const AboutIntro = () => {
    return (
        <section className="bg-white py-20">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                <img
                    src={aboutImg}
                    alt="Giới thiệu"
                    className="rounded-lg shadow-lg"
                />

                <div className="bg-white shadow-xl border p-8 rounded-lg">
                    <h3 className="text-blue-900 font-bold text-lg mb-4">
                        NỀN TẢNG TOÀN DIỆN CHO LUẬT SƯ & KHÁCH HÀNG
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-4">
                        Hiểu Luật kết nối khách hàng với đội ngũ luật sư,
                        chuyên viên pháp lý uy tín trên toàn quốc.
                    </p>

                    <p className="text-slate-600 leading-relaxed mb-4">
                        Để mang tới những giải pháp pháp lý toàn diện, hiệu quả nhất cho từng khách hàng, việc xây dựng đội ngũ luật sư, chuyên gia pháp lý và các cộng sự chuyên nghiệp, giàu kinh nghiệm, đồng thời có cùng chung một hệ giá trị cốt lõi là điều kiện tiên quyết.
                    </p>

                    <div className="bg-yellow-500 text-white p-4 rounded-lg text-sm font-semibold">
                        Chúng tôi hiểu – để xây dựng một quan hệ hợp tác hiệu quả và bền vững – Chuyên môn, sự Tận tâm và Trách nhiệm là những yếu tố then chốt.
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutIntro
