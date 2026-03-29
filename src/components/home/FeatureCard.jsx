import useScrollReveal from "../../hooks/useScrollReveal";
import { useState } from "react";

const FeatureCard = ({
    title,
    description,
    image,
    icon,
    reverse = false,
    delay = 0,
}) => {
    const reveal = useScrollReveal({ threshold: 0.25 });
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            ref={reveal.ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`
                group
        bg-white rounded-2xl p-8
        shadow-lg border border-slate-100
        transition-all duration-700
        ${reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="
    text-blue-700 text-3xl
    transition-all duration-700
    group-hover:text-red-600
    group-hover:rotate-[360deg]
  "
                >
                    {icon}
                </div>
                <h3
                    className="
    text-xl font-bold uppercase text-slate-800
    transition-all duration-700
    group-hover:text-blue-700
    group-hover:tracking-wider
  "
                >
                    {title}
                </h3>
            </div>

            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-blue-500 mb-6"></div>

            {/* Image */}
            <div className="relative mb-6">
                <img
                    src={image}
                    alt={title}
                    className="feature-card-image"
                />
                <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-blue-900 rounded-lg"></div>
            </div>

            {/* Description */}
            {Array.isArray(description) ? (
                <div className="text-slate-600 leading-relaxed mb-6 space-y-3">
                    {(isExpanded ? description : description.slice(0, 2)).map(
                        (item, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className="text-blue-700 font-bold">–</span>
                                <p>{item}</p>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <p className="text-slate-600 leading-relaxed mb-6">
                    {description}
                </p>
            )}


            {Array.isArray(description) && description.length > 1 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 border border-blue-700 text-blue-700 font-semibold hover:bg-blue-700 hover:text-white transition"
                >
                    {isExpanded ? "THU GỌN" : "ĐỌC THÊM ..."}
                </button>
            )}

        </div>
    );
};

export default FeatureCard;
