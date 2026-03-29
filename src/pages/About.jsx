import Footer from "../components/home/Footer"
import AboutCoreValues from "../components/home/gioi_thieu/AboutCoreValues"
import AboutDifference from "../components/home/gioi_thieu/AboutDifference"
import AboutHero from "../components/home/gioi_thieu/AboutHero"
import AboutIntro from "../components/home/gioi_thieu/AboutIntro"
import AboutVision from "../components/home/gioi_thieu/AboutVision"
import PartnerSection from "../components/home/PartnerSection"


const About = () => {
    return (
        <>
            <AboutHero />
            <AboutIntro />
            <AboutVision />
            <AboutCoreValues />
            <AboutDifference />
            <PartnerSection />
            <Footer />
        </>
    )
}

export default About
