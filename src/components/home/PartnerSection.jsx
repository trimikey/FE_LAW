import logo1 from "../../assets/Logo_Hieuluat2-removebg-preview.png";
import logo2 from "../../assets/logo_HieuLuat.png";
import logo3 from "../../assets/hammer.png";
import logo4 from "../../assets/stat_law.png";

const partners = [
  { name: "SB Law", logo: logo1 },
  { name: "QR Law", logo: logo2 },
  { name: "Hợp tác là thành công", logo: logo3 },
  { name: "Tường & Cộng sự", logo: logo4 }
];

const PartnerSection = () => {
  return (
    <section className="bg-white py-16 text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        ĐỐI TÁC ĐỒNG HÀNH
      </h3>
      <p className="text-gray-500 mb-10">
        Quy tụ các Công ty luật hàng đầu với đội ngũ luật sư giàu kinh nghiệm
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {partners.map((p, i) => (
          <div
            key={i}
            className="w-40 h-20 flex items-center justify-center border rounded bg-white grayscale hover:grayscale-0 transition"
          >
            <img src={p.logo} alt={p.name} className="max-h-12" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnerSection;
