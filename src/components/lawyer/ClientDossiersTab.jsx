import React, { useEffect, useMemo, useState } from 'react';
import {
    HiChevronRight,
    HiFolder,
    HiOutlineClock,
    HiOutlineCurrencyDollar,
    HiOutlineDocumentText,
    HiOutlineSearch,
    HiOutlineSparkles,
    HiOutlineUserAdd,
    HiSearch,
    HiFilter,
    HiTrendingUp,
    HiOutlineUserGroup,
    HiPlus
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ClientDetailView from './ClientDetailView';
import { resolveAvatarUrl } from '../../utils/avatar';


const statusConfig = {
    processing: {
        label: 'Đang xử lý',
        className: 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20'
    },
    archived: {
        label: 'Lưu trữ',
        className: 'bg-slate-50 text-slate-400 ring-1 ring-slate-500/10'
    },
    new: {
        label: 'Mới tạo',
        className: 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20'
    }
};

const avatarPalette = [
    'bg-sky-100 text-sky-700',
    'bg-orange-100 text-orange-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
    'bg-indigo-100 text-indigo-700'
];

const formatRelativeTime = (value) => {
    if (!value) return 'Không có';
    const now = Date.now();
    const target = new Date(value).getTime();
    const diffHours = Math.max(0, Math.floor((now - target) / (1000 * 60 * 60)));
    if (diffHours < 24) return diffHours < 1 ? 'Vừa xong' : `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} ngày trước`;
    return new Date(value).toLocaleDateString('vi-VN');
};

const getInitials = (name) => {
    const parts = String(name || 'KH').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return parts[0]?.slice(0, 2).toUpperCase() || 'KH';
};

const buildClientCode = (client) => {
    const year = new Date(client.lastActivityAt || Date.now()).getFullYear();
    return `MS: KH-${year}-${String(client.id).padStart(3, '0')}`;
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const ClientDossiersTab = ({ onAddClient, refreshKey }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [page, setPage] = useState(1);
    const [revenueSummaries, setRevenueSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newClient, setNewClient] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const [clientsRes, revenueRes] = await Promise.all([
                    api.get('/lawyer/clients', {
                        params: { q: searchQuery || undefined, page, limit: 12 }
                    }),
                    api.get('/lawyer/revenue-by-client')
                ]);
                const clientData = clientsRes.data?.data;
                setClients(clientData?.clients || []);
                if (clientData?.pagination) setPagination(clientData.pagination);
                setRevenueSummaries(revenueRes.data?.data?.summaries || []);
            } catch (error) {
                console.error('Error fetching clients:', error);
                toast.error('Không thể tải danh sách hồ sơ');
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, page, refreshKey]);

    const normalizedClients = useMemo(() => {
        const revenueByClientId = new Map(revenueSummaries.map((item) => [Number(item.client?.id), item]));
        return clients.map((client) => ({
            ...client,
            code: buildClientCode(client),
            statusMeta: statusConfig[client.profileStatus] || statusConfig.archived,
            revenueSummary: revenueByClientId.get(Number(client.id)) || null
        }));
    }, [clients, revenueSummaries]);

    const handleAddClient = async (e) => {
        if (e) e.preventDefault();

        if (!newClient.fullName || !newClient.email) {
            toast.error('Vui lòng nhập đầy đủ tên và email');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/lawyer/clients', newClient);
            toast.success(response.data.message || 'Tạo hồ sơ khách hàng thành công');
            setShowAddModal(false);
            setNewClient({ fullName: '', email: '', phone: '' });
            // Refresh list
            refreshKey ? (typeof refreshKey === 'function' && refreshKey()) : window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi tạo hồ sơ khách hàng');
        } finally {
            setSubmitting(false);
        }
    };

    if (selectedClient) {
        return <ClientDetailView client={selectedClient} onBack={() => setSelectedClient(null)} />;
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Minimal Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-8 bg-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Global Dossier Management</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#041837] tracking-tight uppercase">Hồ sơ khách hàng</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group sm:w-80">
                        <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors h-5 w-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm hồ sơ..."
                            className="w-full rounded-[24px] border-2 border-slate-100 bg-white py-5 pl-16 pr-6 text-sm font-bold text-[#041837] placeholder:text-slate-300 focus:border-amber-500 transition-all outline-none shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#041837] text-amber-500 shadow-xl transition hover:scale-110 active:scale-95"
                    >
                        <HiOutlineUserAdd className="h-7 w-7" />
                    </button>
                </div>
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#041837]/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Tạo hồ sơ khách hàng mới</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                <HiPlus className="rotate-45 h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddClient} className="p-10 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Họ và tên khách hàng</label>
                                    <input
                                        type="text"
                                        required
                                        value={newClient.fullName}
                                        onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
                                        placeholder="VD: Nguyễn Văn A"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        value={newClient.phone}
                                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
                                        placeholder="09xx xxx xxx"
                                    />
                                </div>
                            </div>

                            <p className="text-[10px] text-slate-400 font-medium italic">
                                * Nếu email đã có trên hệ thống, hồ sơ sẽ được tự động liên kết với dữ liệu hiện có.
                            </p>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-5 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-5 rounded-2xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black hover:shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? 'ĐANG LƯU...' : 'XÁC NHẬN TẠO HỒ SƠ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dynamic Stats - Integrated & Sleek */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'QUẢN LÝ', value: normalizedClients.length, detail: 'TỔNG HỒ SƠ', trend: '+12% month', icon: HiOutlineUserGroup, color: 'text-blue-500' },
                    { label: 'HIỆN TẠI', value: normalizedClients.filter(c => c.profileStatus === 'processing').length, detail: 'ĐANG XỬ LÝ', trend: 'Priority', icon: HiOutlineClock, color: 'text-emerald-500' },
                    { label: 'TÀI LIỆU', value: normalizedClients.reduce((s, c) => s + (c.documentsCount || 0), 0), detail: 'LƯU TRỮ', trend: 'Secure', icon: HiOutlineDocumentText, color: 'text-amber-500' },
                    { label: 'THU NHẬP', value: Math.round(normalizedClients.reduce((s, c) => s + (c.revenueSummary?.totalRevenue || 0), 0) / 1000000) + 'tr', detail: 'QUYẾT TOÁN', trend: 'Target met', icon: HiTrendingUp, color: 'text-rose-500' }
                ].map((stat, i) => (
                    <div key={i} className="group bg-white rounded-[40px] border border-slate-50 p-8 shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <stat.icon className={`h-8 w-8 ${stat.color} opacity-20 transform group-hover:scale-110 group-hover:opacity-100 transition-all`} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">{stat.trend}</span>
                        </div>
                        <p className="text-4xl font-black text-[#041837] tracking-tighter mb-1">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.detail}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-6">
                    <h2 className="text-xl font-black text-[#041837] uppercase tracking-tight flex items-center gap-3">
                        <HiFilter className="text-amber-500" />
                        Danh sách chọn lọc
                    </h2>
                    <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">
                            Tổng {pagination.total} hồ sơ
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#041837] text-white shadow-lg' : 'text-slate-400'}`}><HiOutlineSparkles /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#041837] text-white shadow-lg' : 'text-slate-400'}`}><HiFolder /></button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array(6).fill(0).map((_, i) => <div key={i} className="h-60 rounded-[40px] bg-slate-50 animate-pulse" />)}
                    </div>
                ) : (
                    <>
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                            {normalizedClients.map(client => (
                                <div
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={`group bg-white rounded-[40px] border border-slate-50 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${viewMode === 'list' ? 'flex items-center justify-between p-6 px-10' : 'p-10'}`}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -z-0 group-hover:bg-amber-50 transition-all duration-500" />

                                    <div className={`relative z-10 flex ${viewMode === 'list' ? 'items-center gap-8 flex-1' : 'flex-col'}`}>
                                        <div className={`rounded-[24px] bg-[#041837] text-amber-500 flex items-center justify-center font-black shadow-xl group-hover:rotate-6 transition-transform overflow-hidden ${viewMode === 'list' ? 'h-14 w-14 text-sm' : 'h-20 w-20 text-2xl mb-8'}`}>
                                            {client.avatar ? (
                                                <img
                                                    src={resolveAvatarUrl(client.avatar)}
                                                    alt={client.full_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerHTML = getInitials(client.full_name);
                                                    }}
                                                />
                                            ) : (
                                                getInitials(client.full_name)
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`font-black text-[#041837] uppercase tracking-tight truncate ${viewMode === 'list' ? 'text-lg' : 'text-2xl'}`}>{client.full_name}</h3>
                                                {viewMode === 'list' && <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${client.statusMeta.className}`}>{client.statusMeta.label}</span>}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{client.code} • {formatRelativeTime(client.lastActivityAt)}</p>
                                        </div>
                                    </div>

                                    {viewMode === 'grid' && (
                                        <>
                                            <div className="relative z-10 mt-10 grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-slate-50 transition group-hover:bg-white group-hover:shadow-lg border border-transparent group-hover:border-slate-100">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Vụ việc</p>
                                                    <p className="text-sm font-black text-[#041837]">{client.casesCount || 0} HỒ SƠ</p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50 transition group-hover:bg-white group-hover:shadow-lg border border-transparent group-hover:border-slate-100">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Doanh thu</p>
                                                    <p className="text-sm font-black text-emerald-600">{formatCurrency(client.revenueSummary?.totalRevenue)}</p>
                                                </div>
                                            </div>
                                            <div className="relative z-10 mt-10 flex items-center justify-between pt-8 border-t border-slate-50">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${client.statusMeta.className}`}>
                                                    {client.statusMeta.label}
                                                </span>
                                                <HiChevronRight className="h-6 w-6 text-slate-200 group-hover:translate-x-2 group-hover:text-[#041837] transition-all" />
                                            </div>
                                        </>
                                    )}

                                    {viewMode === 'list' && (
                                        <div className="relative z-10 flex items-center gap-12">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Vụ việc</p>
                                                <p className="font-black text-[#041837]">{client.casesCount || 0} HỒ SƠ</p>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Thanh toán</p>
                                                <p className="font-black text-emerald-600 uppercase italic text-sm">{formatCurrency(client.revenueSummary?.totalRevenue)}</p>
                                            </div>
                                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#041837] group-hover:text-white transition-all">
                                                <HiChevronRight className="h-6 w-6" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination Navigation */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white max-w-fit mx-auto shadow-sm">
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#041837] shadow-sm"
                                >
                                    <HiSearch className="rotate-180 h-5 w-5" />
                                </button>

                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`h-12 w-12 rounded-2xl text-[11px] font-black transition-all ${page === i + 1 ? 'bg-[#041837] text-white shadow-lg scale-110' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#041837] shadow-sm"
                                >
                                    <HiSearch className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientDossiersTab;
