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
    HiPlus,
    HiOutlineBriefcase,
    HiTrash
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

const ClientDossiersTab = ({ onAddClient, refreshKey, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [page, setPage] = useState(1);
    const [revenueSummaries, setRevenueSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showArchived, setShowArchived] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newClient, setNewClient] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const [addMode, setAddMode] = useState('new'); // 'new' or 'existing'
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [existingClients, setExistingClients] = useState([]);
    const [selectedExistingClient, setSelectedExistingClient] = useState(null);
    const [clientCases, setClientCases] = useState([]);
    const [clientCasesLoading, setClientCasesLoading] = useState(false);

    const caseStatusMap = {
        pending: 'Chờ xử lý',
        in_progress: 'Đang thực hiện',
        reviewing: 'Đang rà soát',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const [clientsRes, revenueRes] = await Promise.all([
                    api.get('/lawyer/clients', {
                        params: {
                            q: searchQuery || undefined,
                            page,
                            limit: 12,
                            showArchived: showArchived || undefined
                        }
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
    }, [searchQuery, page, refreshKey, showArchived]);

    const normalizedClients = useMemo(() => {
        const revenueByClientId = new Map(revenueSummaries.map((item) => [Number(item.client?.id), item]));
        return clients.map((client) => ({
            ...client,
            code: buildClientCode(client),
            statusMeta: statusConfig[client.profileStatus] || statusConfig.archived,
            revenueSummary: revenueByClientId.get(Number(client.id)) || null
        }));
    }, [clients, revenueSummaries]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const container = document.getElementById('client-search-container');
            if (container && !container.contains(event.target)) {
                setExistingClients([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchExistingClient = async (query) => {
        setClientSearchQuery(query);
        // Remove query length check to show list on focus
        try {
            const res = await api.get('/lawyer/search-clients', { params: { search: query || '' } });
            if (res.data.success) {
                setExistingClients(res.data.data || []);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSelectExisting = async (client) => {
        setSelectedExistingClient(client);
        setExistingClients([]); // Close droplist after selection
        setClientSearchQuery(client.full_name);

        setClientCasesLoading(true);
        try {
            const res = await api.get('/lawyer/cases', { params: { clientId: client.id, limit: 20 } });
            if (res.data.success) {
                setClientCases(res.data.data.cases || []);
            }
        } catch (error) {
            console.error('Fetch client cases error:', error);
        } finally {
            setClientCasesLoading(false);
        }
    };

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
            if (onRefresh) onRefresh();
            else if (typeof refreshKey === 'function') refreshKey();
            else window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi tạo hồ sơ khách hàng');
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmCreate = async () => {
        if (addMode === 'new') {
            await handleAddClient();
        } else if (selectedExistingClient) {
            setSubmitting(true);
            try {
                const payload = {
                    fullName: selectedExistingClient.full_name,
                    email: selectedExistingClient.email,
                    phone: selectedExistingClient.phone
                };
                const response = await api.post('/lawyer/clients', payload);
                toast.success(response.data.message || 'Đã kết nối hồ sơ khách hàng');
                setShowAddModal(false);
                setSelectedExistingClient(null);
                setClientCases([]);
                setClientSearchQuery('');
                // Refresh list
                if (onRefresh) onRefresh();
                else if (typeof refreshKey === 'function') refreshKey();
                else window.location.reload();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Lỗi khi kết nối hồ sơ');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleArchiveClient = async (client, e) => {
        if (e) e.stopPropagation();
        
        // Kiểm tra vụ việc đang xử lý (từ backend đã tính toán)
        if ((client.activeCases || 0) > 0) {
            toast.error('Không thể lưu trữ hồ sơ vì có vụ việc đang xử lý');
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn lưu trữ hồ sơ khách hàng này?')) return;

        try {
            await api.patch(`/lawyer/clients/${client.id}/archive`);
            toast.success('Đã lưu trữ hồ sơ hồ sơ');
            if (onRefresh) onRefresh();
            else window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi lưu trữ hồ sơ');
        }
    };

    const handleRestoreClient = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await api.patch(`/lawyer/clients/${id}/restore`);
            toast.success('Đã khôi phục hồ sơ');
            if (onRefresh) onRefresh();
            else window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi khôi phục hồ sơ');
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
                    <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                            <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Tạo hồ sơ khách hàng mới</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setClientSearchQuery('');
                                    setExistingClients([]);
                                    setSelectedExistingClient(null);
                                    setClientCases([]);
                                }}
                                className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                <HiPlus className="rotate-45 h-6 w-6" />
                            </button>
                        </div>

                        <div className="px-10 py-6 shrink-0 bg-slate-50/50">
                            <div className="flex bg-white p-1 rounded-2xl border-2 border-slate-100">
                                <button
                                    onClick={() => setAddMode('new')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${addMode === 'new' ? 'bg-[#041837] text-white shadow-lg' : 'text-slate-400'}`}
                                >
                                    Khách hàng mới
                                </button>
                                <button
                                    onClick={() => setAddMode('existing')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${addMode === 'existing' ? 'bg-[#041837] text-white shadow-lg' : 'text-slate-400'}`}
                                >
                                    Khách hàng đã có
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            {addMode === 'existing' ? (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Tìm kiếm khách hàng trên hệ thống</label>
                                        <div className="relative" id="client-search-container">
                                            <div className="relative group">
                                                <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors h-5 w-5" />
                                                <input
                                                    type="text"
                                                    value={clientSearchQuery}
                                                    onFocus={() => handleSearchExistingClient(clientSearchQuery)}
                                                    onChange={(e) => handleSearchExistingClient(e.target.value)}
                                                    placeholder="Nhập tên, email hoặc SĐT..."
                                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-5 pl-16 pr-6 text-sm font-bold text-[#041837] placeholder:text-slate-300 focus:border-amber-500 transition-all outline-none"
                                                />
                                            </div>

                                            {existingClients.length > 0 && !selectedExistingClient && (
                                                <div className="absolute left-0 right-0 top-full mt-2 z-[110] bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(4,24,55,0.15)] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {existingClients.map(client => (
                                                        <div
                                                            key={client.id}
                                                            onClick={() => handleSelectExisting(client)}
                                                            className="p-5 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b last:border-0 border-slate-50 transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-xl bg-slate-100 text-[#041837] flex items-center justify-center font-black text-xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                                    {getInitials(client.full_name)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-[#041837] text-sm uppercase tracking-tight">{client.full_name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider">{client.email}</p>
                                                                </div>
                                                            </div>
                                                            <HiChevronRight className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {selectedExistingClient && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-500/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-amber-500 text-[#041837] flex items-center justify-center font-black">
                                                            {getInitials(selectedExistingClient.full_name)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-[#041837] text-sm uppercase">{selectedExistingClient.full_name}</p>
                                                            <p className="text-[10px] text-slate-500 font-bold tracking-wide">{selectedExistingClient.email}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedExistingClient(null);
                                                            setClientCases([]);
                                                            setClientSearchQuery('');
                                                        }}
                                                        className="text-[9px] font-black uppercase text-rose-500 hover:underline"
                                                    >
                                                        Thay đổi
                                                    </button>
                                                </div>

                                                {/* Related Cases List */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-4 w-1 bg-amber-500 rounded-full" />
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-black">Các vụ việc liên quan</label>
                                                    </div>

                                                    {clientCasesLoading ? (
                                                        <div className="py-8 text-center text-slate-300 animate-pulse font-black text-[10px] uppercase">Đang tải vụ việc...</div>
                                                    ) : clientCases.length > 0 ? (
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {clientCases.map(c => (
                                                                <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                                                                    <div className="max-w-[75%]">
                                                                        <p className="font-black text-[#041837] text-[11px] uppercase line-clamp-1 truncate">{c.title}</p>
                                                                        <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-wider">{c.case_type} • {caseStatusMap[c.status] || c.status}</p>
                                                                    </div>
                                                                    <HiOutlineBriefcase className="text-slate-200 group-hover:text-amber-500 transition-colors" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-10 text-center rounded-2xl border-2 border-dashed border-slate-100">
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Không tìm thấy vụ việc hiện có</p>
                                                            <p className="text-[8px] text-slate-400 mt-2">Hồ sơ sẽ được tạo trống để bổ sung vụ việc sau.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleAddClient} className="space-y-6">
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
                                    <p className="text-[10px] text-slate-400 font-medium italic mb-6">
                                        * Nếu email đã có trên hệ thống, hồ sơ sẽ được tự động liên kết với dữ liệu hiện có.
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className="p-10 border-t border-slate-50 shrink-0 flex gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedExistingClient(null);
                                    setClientCases([]);
                                }}
                                className="flex-1 py-5 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCreate}
                                disabled={submitting || (addMode === 'existing' && !selectedExistingClient)}
                                className="flex-[2] py-5 rounded-2xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black hover:shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? 'ĐANG LƯU...' : 'XÁC NHẬN TẠO HỒ SƠ'}
                            </button>
                        </div>
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
                            <button
                                onClick={() => setShowArchived(!showArchived)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showArchived ? 'bg-amber-500 text-[#041837] shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                                <HiOutlineClock className="h-4 w-4" />
                                {showArchived ? 'Đang hiện: Lưu trữ' : 'Lưu trữ'}
                            </button>
                            <div className="w-px h-8 bg-slate-100 mx-2 hidden sm:block" />
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
                        {normalizedClients.length === 0 && (
                            <div className="py-20 text-center rounded-[50px] border-4 border-dashed border-slate-50 bg-slate-50/30">
                                <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">
                                    {showArchived ? 'Thư mục lưu trữ trống' : 'Chưa có hồ sơ khách hàng nào'}
                                </p>
                            </div>
                        )}
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
                                                <div className="flex items-center gap-3">
                                                    {showArchived ? (
                                                        <button
                                                            onClick={(e) => handleRestoreClient(client.id, e)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                            title="Khôi phục"
                                                        >
                                                            <HiOutlineSparkles className="h-5 w-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleArchiveClient(client, e)}
                                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                            title="Lưu trữ"
                                                        >
                                                            <HiTrash className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-300 group-hover:text-[#041837] group-hover:bg-amber-500 transition-all shadow-sm">
                                                        <HiChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {viewMode === 'list' && (
                                        <div className="relative z-10 flex items-center gap-8">
                                            <div className="flex gap-2">
                                                {showArchived ? (
                                                    <button
                                                        onClick={(e) => handleRestoreClient(client.id, e)}
                                                        className="h-10 px-4 flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                                                    >
                                                        Khôi phục
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleArchiveClient(client, e)}
                                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                                    >
                                                        <HiTrash className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
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
