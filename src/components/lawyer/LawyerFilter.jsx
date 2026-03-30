import { useState } from 'react';

const LawyerFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        search: '',
        specialty: '',
        city: '',
        education: '',
        experience: '',
        feeRange: '',
        minRating: ''
    });

    const [ratingFilter, setRatingFilter] = useState({
        r5: false, r4: false, r3: false, r2: false
    });
    const [isExpanded, setIsExpanded] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (e) => {
        const { name, checked } = e.target;
        setRatingFilter(prev => ({ ...prev, [name]: checked }));
        // Logic for minRating: if 5 is checks, min 5. If 4 is checked, min 4.
        // Usually user selects one or multiple. For simplicity, let's take the lowest checked value.
        // But the UI seems to allow multiple.
    };

    const calculateMinRating = () => {
        if (ratingFilter.r2) return 1;
        if (ratingFilter.r3) return 3;
        if (ratingFilter.r4) return 4;
        if (ratingFilter.r5) return 5;
        return null;
    };

    const handleSearch = () => {
        const minRating = calculateMinRating();

        // Fee logic
        let minFee, maxFee;
        if (filters.feeRange === 'low') { maxFee = 500000; }
        else if (filters.feeRange === 'medium') { minFee = 500000; maxFee = 2000000; }
        else if (filters.feeRange === 'high') { minFee = 2000000; }

        onFilter({
            ...filters,
            minRating: minRating,
            minFee,
            maxFee
        });
    };

    const resetFilters = () => {
        setFilters({
            search: '', specialty: '', city: '', education: '', experience: '', feeRange: '', minRating: ''
        });
        setRatingFilter({ r5: false, r4: false, r3: false, r2: false });
        onFilter({});
    };

    return (
        <div className="bg-white rounded-[24px] shadow-xl overflow-hidden border border-slate-100 transition-all duration-500">
            {/* Header */}
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-[linear-gradient(90deg,#061f3f_0%,#0a2b57_100%)] px-8 py-5 flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity"
            >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    <h2 className="text-white font-black text-sm uppercase tracking-[0.2em]">Bộ lọc hồ sơ luật sư</h2>
                </div>
                <div className={`text-amber-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Row 1 */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên định danh:</label>
                    <input type="text" name="search" value={filters.search} onChange={handleChange} placeholder="Tên Luật sư/Công ty..." className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-[#041837] focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lĩnh vực nghiệp vụ:</label>
                    <select name="specialty" value={filters.specialty} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-[#041837] focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner outline-none">
                        <option value="">Tất cả lĩnh vực</option>
                        <option value="Dân sự">Luật Dân sự</option>
                        <option value="Hình sự">Luật Hình sự</option>
                        <option value="Đất đai">Luật Đất đai</option>
                        <option value="Hôn nhân">Hôn nhân & Gia đình</option>
                        <option value="Doanh nghiệp">Luật Doanh nghiệp</option>
                        <option value="Lao động">Luật Lao động</option>
                        <option value="Thuế">Luật Thuế</option>
                        <option value="Sở hữu trí tuệ">Sở hữu trí tuệ</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Khu vực công tác:</label>
                    <select name="city" value={filters.city} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-[#041837] focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner outline-none">
                        <option value="">Chọn tỉnh thành</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Bình Dương">Bình Dương</option>
                        <option value="Đồng Nai">Đồng Nai</option>
                    </select>
                </div>

                {/* Row 2 */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cơ sở đào tạo:</label>
                    <select name="education" value={filters.education} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-[#041837] focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner outline-none">
                        <option value="">Chọn trường</option>
                        <option value="Đại học Luật Hà Nội">Đại học Luật Hà Nội</option>
                        <option value="Đại học Luật TP.HCM">Đại học Luật TP.HCM</option>
                        <option value="Học viện Tư pháp">Học viện Tư pháp</option>
                        <option value="Quốc gia">Đại học Quốc gia</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kinh nghiệm hành nghề:</label>
                    <select name="experience" value={filters.experience} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-[#041837] focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner outline-none">
                        <option value="">Số năm kinh nghiệm</option>
                        <option value="1">Trên 1 năm</option>
                        <option value="3">Trên 3 năm</option>
                        <option value="5">Trên 5 năm</option>
                        <option value="10">Trên 10 năm</option>
                        <option value="15">Trên 15 năm</option>
                        <option value="20">Trên 20 năm</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mức phí tư vấn:</label>
                    <select name="feeRange" value={filters.feeRange} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl px-4 py-3 text-sm font-bold text-[#041837] focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner outline-none">
                        <option value="">Chọn mức phí</option>
                        <option value="low">Dưới 500k</option>
                        <option value="medium">500k - 2 triệu</option>
                        <option value="high">Trên 2 triệu</option>
                    </select>
                </div>

                {/* Ratings */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Đánh giá tối thiểu:</label>
                    <div className="flex flex-wrap gap-6 mt-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" name="r5" checked={ratingFilter.r5} onChange={handleRatingChange} className="w-5 h-5 rounded-[6px] border-2 border-slate-200 text-[#061f3f] focus:ring-amber-500 transition-all" />
                            <span className="text-xs font-black text-amber-500 tracking-widest flex items-center gap-1">★★★★★ <span className="text-slate-400 ml-1">(5 SAO)</span></span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" name="r4" checked={ratingFilter.r4} onChange={handleRatingChange} className="w-5 h-5 rounded-[6px] border-2 border-slate-200 text-[#061f3f] focus:ring-amber-500 transition-all" />
                            <span className="text-xs font-black text-amber-500 tracking-widest flex items-center gap-1">★★★★☆ <span className="text-slate-400 ml-1">(TRÊN 4 SAO)</span></span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" name="r3" checked={ratingFilter.r3} onChange={handleRatingChange} className="w-5 h-5 rounded-[6px] border-2 border-slate-200 text-[#061f3f] focus:ring-amber-500 transition-all" />
                            <span className="text-xs font-black text-amber-500 tracking-widest flex items-center gap-1">★★★☆☆ <span className="text-slate-400 ml-1">(TRÊN 3 SAO)</span></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Pagination and Results info */}
            <div className="px-10 py-8 flex flex-col md:flex-row justify-between items-center bg-slate-50 border-t border-slate-100 gap-6">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị tối đa:</span>
                    <select className="border-2 border-slate-200 bg-white rounded-lg px-4 py-2 text-xs font-black text-[#041837] outline-none shadow-sm focus:border-amber-500 transition-all">
                        <option>10 hồ sơ</option>
                        <option>20 hồ sơ</option>
                        <option>50 hồ sơ</option>
                    </select>
                </div>

                <div className="flex items-center gap-8">
                    <button onClick={resetFilters} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">Xóa tất cả bộ lọc</button>
                    <button 
                        onClick={handleSearch} 
                        className="px-12 py-4 bg-amber-500 text-[#041837] font-black rounded-2xl shadow-xl shadow-amber-500/30 text-[10px] uppercase tracking-widest hover:bg-black hover:text-amber-500 active:scale-95 transition-all"
                    >
                        Áp dụng bộ lọc
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default LawyerFilter;
