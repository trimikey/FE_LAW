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
        <div className="bg-white rounded-lg shadow-md overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-[#0b1c3e] px-4 py-3 flex justify-between items-center cursor-pointer">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Bộ lọc
                </h2>
                <span className="text-white transform transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Row 1 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên:</label>
                    <input type="text" name="search" value={filters.search} onChange={handleChange} placeholder="Nhập tên Luật sư/Công ty Luật..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Lĩnh vực:</label>
                    <select name="specialty" value={filters.specialty} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tinh thành:</label>
                    <select name="city" value={filters.city} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nơi đào tạo:</label>
                    <select name="education" value={filters.education} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="">Chọn trường đào tạo</option>
                        <option value="Đại học Luật Hà Nội">Đại học Luật Hà Nội</option>
                        <option value="Đại học Luật TP.HCM">Đại học Luật TP.HCM</option>
                        <option value="Học viện Tư pháp">Học viện Tư pháp</option>
                        <option value="Quốc gia">Đại học Quốc gia</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kinh nghiệm:</label>
                    <select name="experience" value={filters.experience} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="">Chọn số năm kinh nghiệm</option>
                        <option value="1">Trên 1 năm</option>
                        <option value="3">Trên 3 năm</option>
                        <option value="5">Trên 5 năm</option>
                        <option value="10">Trên 10 năm</option>
                        <option value="15">Trên 15 năm</option>
                        <option value="20">Trên 20 năm</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phí tư vấn:</label>
                    <select name="feeRange" value={filters.feeRange} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="">Chọn mức phí</option>
                        <option value="low">Dưới 500k</option>
                        <option value="medium">500k - 2 triệu</option>
                        <option value="high">Trên 2 triệu</option>
                    </select>
                </div>

                {/* Ratings - Spanning full width or separate line */}
                <div className="col-span-1 md:col-span-3">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Điểm đánh giá:</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="r5" checked={ratingFilter.r5} onChange={handleRatingChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm flex items-center text-yellow-500">★★★★★ <span className="text-gray-600 ml-1">(5 sao)</span></span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="r4" checked={ratingFilter.r4} onChange={handleRatingChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm flex items-center text-yellow-500">★★★★☆ <span className="text-gray-600 ml-1">(Từ 4 đến 5 sao)</span></span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="r3" checked={ratingFilter.r3} onChange={handleRatingChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm flex items-center text-yellow-500">★★★☆☆ <span className="text-gray-600 ml-1">(Từ 3 đến 4 sao)</span></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Pagination and Results info (Mock UI for filter bar part) */}
            <div className="px-6 pb-6 pt-0 flex justify-between items-center border-t border-gray-100 mt-2 pt-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Số lượng hiển thị trên 1 trang:</span>
                    <select className="border border-gray-300 rounded p-1 text-sm outline-none">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">Xóa bộ lọc</button>
                    <button onClick={handleSearch} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded shadow text-sm uppercase">
                        Tìm kiếm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LawyerFilter;
