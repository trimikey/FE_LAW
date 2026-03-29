import { useEffect } from 'react';
import { HiSearch, HiUserAdd, HiLockClosed, HiLockOpen, HiFilter, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const AdminUsersTab = ({ users, pagination, loading, onPageChange, handleToggleUserStatus }) => {
    useEffect(() => {
        if (!users.length && onPageChange) {
            onPageChange(1);
        }
    }, []);

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;

    return (
        <div className="space-y-10 animate-in slide-in-from-right duration-700 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div>
                    <h1 className="text-4xl font-black text-[#041837] tracking-tight uppercase">Quản lý người dùng</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Tổng cộng {pagination?.total || 0} tài khoản trên hệ thống
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Tên, email hoặc số điện thoại..."
                            className="h-14 pl-14 pr-8 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-[#041837] focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all w-full md:w-80 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                    </div>
                )}
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-[#041837] shadow-sm hover:shadow-md transition-all">
                            <HiFilter />
                            Tất cả vai trò
                        </button>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nhấn vào hành động để thay đổi trạng thái tài khoản</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="px-10 py-8 text-left">Thành viên</th>
                                <th className="px-10 py-8 text-left">Vai trò</th>
                                <th className="px-10 py-8 text-left">Trạng thái</th>
                                <th className="px-10 py-8 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-[#041837] text-white flex items-center justify-center font-black text-xl shadow-lg transform group-hover:rotate-6 transition-transform">
                                                {u.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#041837] uppercase">{u.full_name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${u.role?.name === 'lawyer'
                                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                                            : u.role?.name === 'admin'
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {u.role?.name}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${u.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${u.is_active ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {u.is_active ? 'Hệ thống mở' : 'Đang tạm khóa'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button
                                            onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm hover:shadow-xl ${u.is_active
                                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-100'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-100'
                                                }`}
                                        >
                                            {u.is_active ? <HiLockClosed /> : <HiLockOpen />}
                                            {u.is_active ? 'Khóa tài khoản' : 'Mở tài khoản'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!users.length && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center italic text-slate-400 font-bold uppercase tracking-widest">
                                        Chưa có người dùng nào được tìm thấy
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Trang {currentPage} / {totalPages}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all font-black"
                            >
                                <HiChevronLeft size={20} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (totalPages > 7) {
                                    if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                                        if (page === 2 || page === totalPages - 1) return <span key={page} className="text-slate-200">...</span>;
                                        return null;
                                    }
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        disabled={loading}
                                        className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${page === currentPage ? 'bg-[#041837] text-white shadow-lg' : 'border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-[#041837] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all font-black"
                            >
                                <HiChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsersTab;
