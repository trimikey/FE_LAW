import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLawyers } from '../../../services/api/lawyer.api';
import { resolveAvatarUrl } from '../../../utils/avatar';
import defaultAvatar from '../../../assets/default_lawyer_avatar.png';

const FeaturedLawyerSlider = () => {
    const [lawyers, setLawyers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopLawyers = async () => {
            try {
                // Fetch top rated lawyers, e.g. sort by rating desc
                const res = await getLawyers({ page: 1, limit: 5, sort: 'rating' });
                if (res.data.data.lawyers && res.data.data.lawyers.length > 0) {
                    setLawyers(res.data.data.lawyers);
                }
            } catch (error) {
                console.error("Failed to fetch featured lawyers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopLawyers();
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === lawyers.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? lawyers.length - 1 : prev - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) return null;
    if (lawyers.length === 0) return null;

    const currentLawyer = lawyers[currentIndex];


    // Helper for specialties
    let specialtiesText = "Chưa cập nhật";
    if (currentLawyer.specialties) {
        try {
            const parsed = typeof currentLawyer.specialties === 'string' ? JSON.parse(currentLawyer.specialties) : currentLawyer.specialties;
            specialtiesText = Array.isArray(parsed) ? parsed.join(", ") : parsed;
        } catch (e) {
            specialtiesText = currentLawyer.specialties;
        }
    }

    return (
        <section className="py-12 bg-white mb-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-blue-900 mb-2 uppercase tracking-tight">LUẬT SƯ & CÔNG TY LUẬT HÀNG ĐẦU</h2>
                    <div className="w-20 h-1 bg-amber-500 mx-auto mb-4 rounded-full"></div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm font-medium">
                        Bao gồm những luật sư / công ty luật được đánh giá cao dựa trên chuyên môn và phản hồi từ khách hàng.
                    </p>
                </div>

                {/* Slider Content */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-3 bg-[#041837] text-white rounded-full hover:bg-amber-500 hover:text-[#041837] transition-all shadow-xl hidden md:block"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-3 bg-[#041837] text-white rounded-full hover:bg-amber-500 hover:text-[#041837] transition-all shadow-xl hidden md:block"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Card */}
                    <div className="bg-white border-2 border-slate-50 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-500">
                        {/* Image Side */}
                        <div className="w-full md:w-[40%]">
                            <div className="relative overflow-hidden rounded-[30px] shadow-2xl group/img aspect-square">
                                <img
                                    src={currentLawyer.user?.avatar ? resolveAvatarUrl(currentLawyer.user.avatar) : defaultAvatar}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                    alt="Lawyer"
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#041837]/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Info Side */}
                        <div className="w-full md:w-2/3 flex flex-col justify-center text-left">
                            <h3 className="text-2xl font-bold text-orange-500 mb-2 uppercase">
                                LUẬT SƯ {currentLawyer.user?.full_name}
                            </h3>

                            <div className="space-y-3 mb-6">
                                <p className="text-gray-700">
                                    <span className="font-bold text-blue-900">Lĩnh vực:</span> {specialtiesText}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-bold text-blue-900">📍</span> {currentLawyer.city || 'TP. Hồ Chí Minh'}
                                </p>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="flex items-center">
                                        <span className="font-bold text-blue-900 mr-2">Đánh giá:</span>
                                        <div className="flex text-gray-300 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < (Math.round(currentLawyer.rating || 5)) ? "text-yellow-400" : ""}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-xs ml-1">({currentLawyer.rating || '5.0'})</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="font-bold text-blue-900 mr-2">Bình luận:</span>
                                        <span className="text-blue-500">💬 {currentLawyer.review_count || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => navigate(`/lawyer/${currentLawyer.id}`)}
                                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded shadow transition flex items-center gap-2"
                                >
                                    XEM HỒ SƠ <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dots (Pagination) */}
                    <div className="flex justify-center gap-2 mt-8">
                        {lawyers.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-orange-400 w-4 h-4' : 'bg-orange-200 hover:bg-orange-300'
                                    }`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedLawyerSlider;
