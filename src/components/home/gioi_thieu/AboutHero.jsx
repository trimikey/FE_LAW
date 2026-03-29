import bgHero from '../../../assets/stat_law.png';

const AboutHero = () => {
    return (
        <section
            className="h-[360px] flex items-center justify-center bg-center bg-cover"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgHero})`
            }}
        >
            <h1 className="text-white text-3xl font-bold tracking-wide">
                GIỚI THIỆU VỀ CHÚNG TÔI
            </h1>
        </section>
    );
};

export default AboutHero;
