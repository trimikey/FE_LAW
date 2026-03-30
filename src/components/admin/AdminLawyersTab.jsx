import { useState, useEffect } from 'react';
import { HiCheck, HiX, HiIdentification, HiAcademicCap, HiOfficeBuilding, HiSearch, HiFilter, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { MdVerifiedUser } from 'react-icons/md';

const AdminLawyersTab = ({ lawyers, pagination, loading, onPageChange, handleVerifyLawyer, setSelectedLawyer }) => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!lawyers.length && onPageChange) {
            onPageChange(1, 10, status, search);
        }
    }, []);

    const handleSearch = () => {
        onPageChange(1, 10, status, search);
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        onPageChange(1, 10, newStatus, search);
    };

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-[#041837] tracking-tight uppercase">Quản lý luật sư</h1>
                    <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-amber-500 animate-pulse" />
                        Tổng cộng {pagination?.total || 0} luật sư
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative group w-full md:w-80">
                        <HiSearch className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-12 md:h-14 pl-12 md:pl-14 pr-8 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs md:text-sm font-bold text-[#041837] focus:outline-none transition-all w-full outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-2 md:p-4 flex flex-wrap items-center gap-2 md:gap-4 mx-2 md:mx-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button
                    onClick={() => handleStatusChange('')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${status === '' ? 'bg-[#041837] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => handleStatusChange('pending')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${status === 'pending' ? 'bg-amber-500 text-[#041837] shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                    Chờ duyệt
                </button>
                <button
                    onClick={() => handleStatusChange('verified')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${status === 'verified' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                    Đã xác thực
                </button>
                <button
                    onClick={() => handleStatusChange('rejected')}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${status === 'rejected' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                    Bị từ chối
                </button>
            </div>

            {loading ? (
                <div className="py-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            ) : lawyers.length === 0 ? (
                <div className="bg-white rounded-[50px] border-4 border-dashed border-slate-50 p-32 text-center mx-4">
                    <div className="h-32 w-32 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-10">
                        <HiOfficeBuilding size={64} />
                    </div>
                    <h2 className="text-3xl font-black text-[#041837] uppercase tracking-tight mb-4">Không tìm thấy dữ liệu</h2>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-4">
                        {lawyers.map((lawyer) => (
                            <div key={lawyer.id} className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-all text-[#041837]">
                                    <HiAcademicCap className="h-48 w-48" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-20 w-20 rounded-3xl bg-[#041837] text-white flex items-center justify-center font-black text-3xl shadow-xl border-4 border-slate-50">
                                                {lawyer.user?.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border inline-block mb-3 ${lawyer.verification_status === 'verified'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : lawyer.verification_status === 'rejected'
                                                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {lawyer.verification_status === 'verified' ? 'Đã xác thực' : lawyer.verification_status === 'rejected' ? 'Đã từ chối' : 'Chờ xác thực'}
                                                </span>
                                                <h3 className="text-2xl font-black text-[#041837] uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{lawyer.user?.full_name}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{lawyer.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                                        <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-3 mb-2 md:mb-3 text-slate-400">
                                                <HiIdentification />
                                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Thẻ luật sư</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-black text-[#041837]">{lawyer.bar_number}</p>
                                        </div>
                                        <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-3 mb-2 md:mb-3 text-slate-400">
                                                <HiOfficeBuilding />
                                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Kinh nghiệm</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-black text-[#041837] truncate">{lawyer.years_of_experience || 0} năm</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                                        <button
                                            onClick={() => setSelectedLawyer(lawyer)}
                                            className="h-12 md:h-16 rounded-xl md:rounded-2xl bg-white border-2 border-[#041837] text-[#041837] text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                        >
                                            Hồ sơ chi tiết
                                        </button>
                                        {lawyer.verification_status === 'pending' && (
                                            <div className="flex gap-2 flex-1">
                                                <button
                                                    onClick={() => handleVerifyLawyer(lawyer.id, 'verified')}
                                                    className="flex-1 h-12 md:h-16 rounded-xl md:rounded-2xl bg-[#041837] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <HiCheck size={16} className="text-emerald-500" />
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyLawyer(lawyer.id, 'rejected')}
                                                    className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl md:rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 flex items-center justify-center shadow-lg"
                                                >
                                                    <HiX size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mx-4 p-8 bg-white rounded-[30px] border border-slate-100 flex items-center justify-between mt-10">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Trang {currentPage} / {totalPages}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onPageChange(currentPage - 1, 10, status, search)}
                                    disabled={currentPage === 1 || loading}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <HiChevronLeft size={20} />
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onPageChange(i + 1, 10, status, search)}
                                        disabled={loading}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#041837] text-white shadow-lg' : 'border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => onPageChange(currentPage + 1, 10, status, search)}
                                    disabled={currentPage === totalPages || loading}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <HiChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminLawyersTab;
