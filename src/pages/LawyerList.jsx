import { useEffect, useState } from "react";
import { getLawyers } from "../services/api/lawyer.api";
import LawyerCard from "../components/lawyer/LawyerCard";
import LawyerFilter from "../components/lawyer/LawyerFilter";
import BannerSection from "../components/home/search_lawyer/BannerSection";
import FeaturedLawyerSlider from "../components/home/search_lawyer/FeaturedLawyerSlider";
import PartnerSection from "../components/home/PartnerSection";
import CtaSection from "../components/home/CTASection";
import Footer from "../components/home/Footer";

const LawyerList = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLawyers = async (filterParams = {}) => {
    setLoading(true);
    try {
      const res = await getLawyers({ page: 1, limit: 10, ...filterParams });
      setLawyers(res.data.data.lawyers);
    } catch (error) {
      console.error("Failed to fetch lawyers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const handleFilter = (newFilters) => {
    fetchLawyers(newFilters);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <BannerSection
        title="Tìm luật sư phù hợp"
        subtitle="Lọc theo chuyên môn, kinh nghiệm và nhu cầu thực tế để kết nối nhanh với luật sư có hồ sơ minh bạch."
        eyebrow="Kho luật sư"
        breadcrumb="Trang chủ / Tìm luật sư"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <FeaturedLawyerSlider />
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <LawyerFilter onFilter={handleFilter} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a2b57]"></div>
          </div>
        ) : lawyers.length > 0 ? (
          <div className="mt-8 space-y-6">
            {lawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white py-16 text-center shadow-sm">
            <span className="block text-6xl mb-4">⚖️</span>
            <p className="text-xl text-slate-500">Không tìm thấy luật sư nào phù hợp với bộ lọc hiện tại.</p>
            <button onClick={() => handleFilter({})} className="mt-4 font-semibold text-[#0a2b57] hover:text-[#123d78]">
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      <PartnerSection />
      <div className="relative z-20">
        <CtaSection />
      </div>
      <Footer />
    </div>
  );
};

export default LawyerList;
