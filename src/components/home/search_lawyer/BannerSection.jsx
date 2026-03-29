import bgImage from "../../../assets/back_gr_luat.png";
import accentImage from "../../../assets/anhluat_tay_foucs.png";

const BannerSection = ({
  title = "Tìm luật sư",
  subtitle = "Kết nối đúng chuyên môn, đúng thời điểm và đúng nhu cầu pháp lý của bạn.",
  eyebrow = "Hiểu Luật Platform",
  breadcrumb = "Trang chủ / Tìm luật sư",
  image = bgImage,
  rightImage = accentImage,
  compact = false
}) => {
  return (
    <section
      className={`relative overflow-hidden ${compact ? 'h-[280px]' : 'h-[360px]'}`}
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(4,21,47,0.92),rgba(9,51,120,0.82),rgba(241,177,54,0.22))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-between gap-10 px-6">
        <div className="max-w-2xl text-white">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-100/90 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
            {breadcrumb}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 rounded-[32px] bg-amber-300/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/15 p-3 backdrop-blur">
            <img
              src={rightImage}
              alt={title}
              className={`${compact ? 'h-[180px]' : 'h-[240px]'} w-[280px] rounded-[24px] object-cover`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
