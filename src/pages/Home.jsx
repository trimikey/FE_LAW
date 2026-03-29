import { useAuth } from "../contexts/AuthContext";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeatureSection from "../components/home/FeatureSection";
import {
  FaBalanceScale,
  FaFileAlt,
  FaLock,
  FaCheckCircle,
  FaBriefcase,
} from "react-icons/fa";

import lawyerSearch from "../assets/dau_hoi_luat.png";
import freeService from "../assets/anh-phai_luat.png";
import consultationRegister from "../assets/card_2.png";
import caseTracking from "../assets/card_3.png";
import caseProgress from "../assets/anh-trai_luat.png";
import emailNotification from "../assets/email.png";
import MarketingSection from "../components/home/SectionMarketing";
import FaqAndConsultSection from "../components/home/FaqAndConsultSection";
import PartnerSection from "../components/home/PartnerSection";
import Footer from "../components/home/Footer";
import CtaSection from "../components/home/CTASection";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const featureCards = [
    {
      title: "Dễ dàng kết nối với luật sư phù hợp",
      description: [
        "Chỉ với vài thao tác đơn giản, khách hàng có thể nhanh chóng tìm kiếm và lọc luật sư theo lĩnh vực chuyên môn, khu vực địa lý, kinh nghiệm làm việc, đánh giá từ người dùng, và nhiều tiêu chí khác.",
        "Giao diện trực quan, thân thiện, kết quả hiển thị rõ ràng giúp bạn dễ dàng so sánh và lựa chọn luật sư phù hợp nhất với nhu cầu pháp lý của mình.",
      ],
      icon: <FaBalanceScale />,
      image: lawyerSearch,
    },
    {
      title: "Khách hàng sử dụng dịch vụ hoàn toàn miễn phí",
      description: [
        "Hiểu Luật cam kết không thu bất kỳ chi phí nào từ phía khách hàng khi sử dụng nền tảng để tìm kiếm và kết nối với luật sư.",
        "Tất cả các thao tác như tìm kiếm luật sư, gửi yêu cầu tư vấn, đăng ký và quản lý thông tin đều được miễn phí 100%, giúp người dùng yên tâm sử dụng mà không lo phát sinh chi phí ngoài ý muốn.",
        "Đối với các dịch vụ pháp lý chuyên sâu do luật sư cung cấp, khách hàng có thể trao đổi và thỏa thuận trực tiếp với luật sư về mức phí trong quá trình tư vấn.",
        "Ngay cả khi vụ việc đã được luật sư tư vấn hoặc giải quyết thành công, nền tảng Hiểu Luật vẫn không thu bất kỳ khoản phí nào từ khách hàng."
      ],
      icon: <FaCheckCircle />,
      image: freeService,
    },
    {
      title: "Đăng ký tư vấn luật sư nhanh chóng",
      description: [
        "Khách hàng có thể nhanh chóng gửi yêu cầu tư vấn pháp lý trực tuyến chỉ với vài thao tác đơn giản, mọi lúc mọi nơi, mà không cần đến trực tiếp văn phòng luật sư.",
        "Người dùng có thể chủ động cung cấp các thông tin liên quan và đính kèm hồ sơ, tài liệu ban đầu (hình ảnh, văn bản, file…) giúp luật sư nắm bắt rõ tình huống và đưa ra tư vấn chính xác hơn ngay từ đầu.",

      ],
      icon: <FaFileAlt />,
      image: consultationRegister,
    },
    {
      title: "Thông báo và cập nhật tự động qua email",
      description: [
        "Khách hàng luôn được cập nhật liên tục về trạng thái xử lý hồ sơ và yêu cầu tư vấn, giúp dễ dàng theo dõi tiến trình và chủ động trong việc chuẩn bị các bước tiếp theo.",
        "Mọi phản hồi, tư vấn hoặc yêu cầu bổ sung thông tin từ luật sư sẽ được gửi trực tiếp qua email, đảm bảo khách hàng nhận được thông tin nhanh chóng, đầy đủ và thuận tiện.",
        "Hệ thống thông báo tự động giúp khách hàng không bỏ sót bất kỳ thông tin hay thay đổi quan trọng nào liên quan đến hồ sơ và quá trình tư vấn pháp lý."
      ],
      icon: <FaLock />,
      image: emailNotification,
    },
    {
      title: "Tracking vụ án theo từng giai đoạn",
      description: [
        "Khách hàng có thể theo dõi toàn bộ quá trình xử lý vụ việc pháp lý theo từng giai đoạn cụ thể, từ tiếp nhận hồ sơ, tư vấn ban đầu cho đến các bước giải quyết tiếp theo.",
        "Mỗi giai đoạn đều được cập nhật rõ ràng về trạng thái, thời gian và nội dung xử lý, giúp khách hàng nắm bắt tiến độ vụ án một cách minh bạch và chủ động."
      ],
      icon: <FaBriefcase />,
      image: caseTracking,
    },
    {
      title: "Quản lý tiến trình vụ việc minh bạch",
      description: [
        "Hệ thống giúp khách hàng dễ dàng quản lý và kiểm soát tiến trình vụ việc pháp lý thông qua các mốc thời gian và thông tin được hiển thị rõ ràng.",
        "Mọi cập nhật liên quan đến vụ việc đều được ghi nhận đầy đủ, giúp khách hàng yên tâm theo dõi và phối hợp hiệu quả với luật sư trong suốt quá trình tư vấn và giải quyết."
      ],
      icon: <FaCheckCircle />,
      image: caseProgress,
    },
  ];
  return (
    <>
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeatureSection featureCards={featureCards} />
      <StatsSection />

      <MarketingSection />
      <FaqAndConsultSection />
      <PartnerSection />

      <div className="relative z-20">
        <CtaSection />
      </div>

      <Footer />


    </>
  );
};

export default Home;
