import heroBg from '../../assets/back_gr_luat.png';
import heroAccent from '../../assets/stat_law2.png';

const DashboardHero = ({
  eyebrow = 'Hiểu Luật Platform',
  title,
  subtitle,
  chips = [],
  image = heroBg,
  accentImage = heroAccent
}) => {
  return (
    <section
      className="relative overflow-hidden rounded-[32px] border border-slate-200/70 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]"
      style={{
        backgroundImage: `linear-gradient(115deg, rgba(4, 21, 47, 0.96), rgba(9, 47, 110, 0.9), rgba(241, 177, 54, 0.24)), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(6,31,63,0.26))]" />
      <div className="absolute -right-10 top-8 hidden h-48 w-48 rounded-full bg-amber-300/20 blur-3xl lg:block" />
      <div className="absolute bottom-0 left-1/3 hidden h-40 w-40 rounded-full bg-sky-400/10 blur-3xl lg:block" />

      <div className="relative z-10 flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200 backdrop-blur">
            {eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100/90 sm:text-base">
              {subtitle}
            </p>
          )}

          {chips.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200/80">
                    {chip.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-white">{chip.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden shrink-0 lg:block">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/15 p-3 backdrop-blur">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]" />
            <img
              src={accentImage}
              alt={title}
              className="relative h-52 w-80 rounded-[22px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
