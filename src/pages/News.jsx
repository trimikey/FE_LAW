import BannerSection from "../components/home/search_lawyer/BannerSection";
import card1 from "../assets/card_1.png";
import card2 from "../assets/card_2.png";
import card3 from "../assets/card_3.png";

const News = () => {
  const articles = [
    {
      id: 1,
      title: '5 lưu ý pháp lý khi ký hợp đồng dịch vụ',
      date: '24/02/2026',
      summary: 'Kiểm tra điều khoản phạt, phạm vi công việc, thanh toán và điều khoản chấm dứt để hạn chế rủi ro.',
      image: card1
    },
    {
      id: 2,
      title: 'Cách chuẩn bị hồ sơ tranh chấp dân sự',
      date: '20/02/2026',
      summary: 'Tổng hợp chứng cứ, tài liệu gốc, timeline sự kiện và danh sách yêu cầu cụ thể trước khi làm việc với luật sư.',
      image: card2
    },
    {
      id: 3,
      title: 'Quy trình làm việc giữa khách hàng và luật sư',
      date: '18/02/2026',
      summary: 'Từ tiếp nhận thông tin, đánh giá vụ việc, báo phí, ký hợp đồng đến cập nhật tiến độ định kỳ.',
      image: card3
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <BannerSection
        title="Tin tức pháp lý"
        subtitle="Theo dõi các góc nhìn pháp lý thực tiễn, cảnh báo rủi ro và kinh nghiệm xử lý dành cho cá nhân lẫn doanh nghiệp."
        eyebrow="Chuyên mục nội dung"
        breadcrumb="Trang chủ / Tin tức"
        compact
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {['Hợp đồng', 'Doanh nghiệp', 'Tư vấn tranh chấp'].map((tag) => (
            <div key={tag} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">Chủ đề nổi bật</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{tag}</h3>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {articles.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="grid gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
                <img src={item.image} alt={item.title} className="h-full min-h-[180px] w-full object-cover" />
                <div className="p-7">
                  <p className="text-sm font-medium text-slate-400">{item.date}</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.summary}</p>
                  <button className="mt-5 inline-flex rounded-xl bg-[#0a2b57] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123d78]">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
