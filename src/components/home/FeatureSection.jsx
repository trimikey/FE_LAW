import FeatureCard from "./FeatureCard";

const FeatureSection = ({ featureCards }) => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {featureCards.map((card, index) => (
            <FeatureCard key={index} {...card} delay={index * 200} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
