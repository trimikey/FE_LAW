import React, { useEffect, useMemo, useState } from 'react';
import {
    HiOutlineArrowLeft,
    HiOutlineCurrencyDollar,
    HiOutlineDocumentDownload,
    HiOutlineDocumentText,
    HiOutlineLocationMarker,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineTrash,
    HiOutlineUser,
    HiUpload,
    HiOutlineBriefcase,
    HiChevronRight
} from 'react-icons/hi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import bannerImg from '../../assets/back_gr_luat.png';
import { resolveAvatarUrl } from '../../utils/avatar';


const caseStatusMap = {
    pending: 'Chờ xử lý',
    in_progress: 'Đang thực hiện',
    reviewing: 'Đang rà soát',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
};

const getInitials = (name) => {
    const safeName = String(name || 'KH').trim();
    const parts = safeName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return safeName.slice(0, 2).toUpperCase();
};

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const getFileIcon = (fileType, fileName) => {
    if (!fileName) return (fileType || 'FILE').toUpperCase().slice(0, 4);
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['doc', 'docx'].includes(ext)) return 'DOCX';
    if (['xls', 'xlsx'].includes(ext)) return 'XLSX';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'IMG';
    return ext.toUpperCase().slice(0, 4);
};

const getFileColor = (fileName) => {
    const ext = fileName?.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'bg-rose-50 text-rose-500';
    if (['doc', 'docx'].includes(ext)) return 'bg-blue-50 text-blue-500';
    if (['xls', 'xlsx'].includes(ext)) return 'bg-emerald-50 text-emerald-500';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'bg-amber-50 text-amber-500';
    return 'bg-slate-50 text-slate-500';
};

const ClientDetailView = ({ client, onBack }) => {
    const [documents, setDocuments] = useState([]);
    const [cases, setCases] = useState([]);
    const [revenueData, setRevenueData] = useState({ summary: null, recentPayments: [] });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!client?.id) return;

        const fetchClientData = async () => {
            setLoading(true);
            try {
                const [casesRes, revenueRes] = await Promise.all([
                    api.get('/lawyer/cases', { params: { limit: 100 } }),
                    api.get('/lawyer/revenue-by-client', { params: { clientId: client.id } })
                ]);
                const allCases = casesRes.data?.data?.cases || [];
                const clientCases = allCases.filter((caseItem) => Number(caseItem.client_id) === Number(client.id));
                setCases(clientCases);
                setRevenueData(revenueRes.data?.data || { summary: null, recentPayments: [] });

                const documentResults = await Promise.all(
                    clientCases.map(async (caseItem) => {
                        try {
                            const docRes = await api.get('/documents', { params: { caseId: caseItem.id } });
                            return docRes.data?.data?.documents || [];
                        } catch (error) {
                            console.error('Error fetching documents for case:', caseItem.id, error);
                            return [];
                        }
                    })
                );

                const mergedDocuments = documentResults
                    .flat()
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setDocuments(mergedDocuments);
            } catch (error) {
                console.error('Error fetching client details:', error);
                toast.error('Không thể tải dữ liệu chi tiết khách hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [client]);

    const dossierStats = useMemo(() => {
        const activeCases = cases.filter((caseItem) => ['pending', 'in_progress', 'reviewing'].includes(caseItem.status)).length;
        return {
            activeCases,
            completedCases: cases.filter((caseItem) => caseItem.status === 'completed').length,
            totalDocuments: documents.length
        };
    }, [cases, documents]);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (cases.length === 0) {
            toast.error('Khách hàng này chưa có vụ việc nào để gắn tài liệu.');
            event.target.value = null;
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('caseId', cases[0].id);
        formData.append('category', 'other');

        setUploading(true);
        try {
            const res = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data?.success) {
                toast.success('Tải lên tài liệu thành công');
                const docRes = await api.get('/documents', { params: { caseId: cases[0].id } });
                const latestDocs = docRes.data?.data?.documents || [];
                setDocuments((prev) => [...latestDocs, ...prev.filter((doc) => doc.case_id !== cases[0].id)]);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải lên tài liệu');
        } finally {
            setUploading(false);
            event.target.value = null;
        }
    };

    const handleDeleteFile = async (documentId) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài liệu này?')) return;

        try {
            const res = await api.delete(`/documents/${documentId}`);
            if (res.data?.success) {
                toast.success('Đã xóa tài liệu');
                setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xóa tài liệu');
        }
    };

    const handleDownloadFile = async (documentId, fileName) => {
        try {
            const response = await api.get(`/documents/${documentId}/download`, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/octet-stream'
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName || `document-${documentId}`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.error(error.response?.data?.message || error.message || 'Không thể tải xuống tài liệu');
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center text-slate-500">Đang tải chi tiết hồ sơ...</div>;
    }

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Back Button */}
            <div className="flex items-center gap-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="group flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#041837] text-amber-500 shadow-xl transition-all hover:scale-110 active:scale-95"
                >
                    <HiOutlineArrowLeft className="h-6 w-6 transition group-hover:-translate-x-1" />
                </button>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Enterprise CRM</p>
                    <h1 className="text-3xl font-black text-[#041837] tracking-tight uppercase">Thông tin hồ sơ khách hàng</h1>
                </div>
            </div>

            {/* Premium Profile Banner Card */}
            <div className="relative overflow-hidden rounded-[50px] bg-[#041837] text-white shadow-2xl">
                <div className="absolute inset-0">
                    <img src={bannerImg} alt="Banner" className="h-full w-full object-cover opacity-20 mix-blend-overlay rotate-1 scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#041837] via-transparent to-amber-500/10" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 px-12 py-16">
                    {/* Avatar Bubble */}
                    <div className="relative h-40 w-40 shrink-0">
                        <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full" />
                        <div className="relative flex h-full w-full items-center justify-center rounded-[40px] bg-white text-[#041837] text-4xl font-black shadow-2xl border-4 border-white/20 transform hover:rotate-6 transition-transform overflow-hidden">
                            {client.avatar ? (
                                <img
                                    src={resolveAvatarUrl(client.avatar)}
                                    alt={client.full_name || client.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = getInitials(client.full_name || client.name);
                                    }}
                                />
                            ) : (
                                getInitials(client.full_name || client.name)
                            )}
                        </div>
                        <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-emerald-500 rounded-2xl border-4 border-[#041837] flex items-center justify-center text-white shadow-xl">
                            <HiChevronRight size={24} className="rotate-[-45deg]" />
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <div className="mb-6 flex flex-wrap justify-center lg:justify-start gap-4">
                            <span className="px-4 py-1.5 rounded-xl bg-blue-500/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-blue-300 border border-white/10">Verification ID: {client.id}</span>
                            <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-emerald-300 border border-white/10">Active Client</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 uppercase leading-tight italic">{client.full_name || client.name}</h2>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-10 opacity-70">
                            <div className="flex items-center gap-3">
                                <HiOutlineMail className="h-5 w-5 text-amber-500" />
                                <span className="text-sm font-bold tracking-wide">{client.email || 'BẢO MẬT EMAIL'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <HiOutlinePhone className="h-5 w-5 text-blue-400" />
                                <span className="text-sm font-bold tracking-wide">{client.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <HiOutlineLocationMarker className="h-5 w-5 text-rose-400" />
                                <span className="text-sm font-bold tracking-wide">{client.city || 'VIETNAM'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <label
                            htmlFor="client-dossier-upload"
                            className={`group flex cursor-pointer items-center justify-center gap-4 rounded-2xl bg-white px-8 py-5 text-xs font-black uppercase tracking-widest text-[#041837] shadow-xl transition hover:bg-amber-500 active:scale-95 whitespace-nowrap ${uploading ? 'pointer-events-none opacity-60' : ''}`}
                        >
                            <HiUpload className={`h-5 w-5 transition ${uploading ? 'animate-bounce' : 'group-hover:translate-y-[-2px]'}`} />
                            {uploading ? 'Đang tải hồ sơ...' : 'Đính kèm tài liệu'}
                        </label>
                        <input id="client-dossier-upload" type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Tổng vụ việc', value: cases.length, icon: HiOutlineUser, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Đang thụ lý', value: dossierStats.activeCases, icon: HiUpload, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Tài liệu lưu', value: dossierStats.totalDocuments, icon: HiOutlineDocumentText, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Doanh số', value: formatCurrency(revenueData.summary?.totalRevenue), icon: HiOutlineCurrencyDollar, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group">
                        <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10 items-start">
                <div className="space-y-10">
                    {/* Documents Table Section */}
                    <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#041837] tracking-tight uppercase">Kho lưu trữ tài liệu</h3>
                            <span className="bg-slate-100 px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {documents.length} File
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tên tài liệu</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Thời gian</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Dung lượng</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {documents.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center">
                                                <HiOutlineDocumentText className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Chưa có dữ liệu số</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        documents.map((doc) => (
                                            <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-12 w-12 rounded-2xl ${getFileColor(doc.file_name)} flex items-center justify-center shrink-0 font-black text-[10px]`}>
                                                            {getFileIcon(doc.file_type, doc.file_name)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-[#041837] text-sm truncate uppercase tracking-tight">{doc.file_name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">DOC-{String(doc.id).padStart(4, '0')}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(doc.created_at).toLocaleDateString('vi-VN')}</td>
                                                <td className="px-8 py-6 text-xs font-bold text-slate-500">{formatBytes(doc.file_size)}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDownloadFile(doc.id, doc.file_name)}
                                                            className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <HiOutlineDocumentDownload className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteFile(doc.id)}
                                                            className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <HiOutlineTrash className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Revenue Section */}
                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-[#041837] tracking-tight uppercase">Giao dịch tài chính</h3>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tháng này</p>
                                    <p className="text-lg font-black text-emerald-600">{formatCurrency(revenueData.summary?.monthlyRevenue)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {revenueData.recentPayments?.slice(0, 2).map((payment) => (
                                <div key={payment.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-[#041837] uppercase truncate max-w-[150px]">{payment.caseTitle}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(payment.paidAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <p className="text-sm font-black text-[#041837]">{formatCurrency(payment.amount)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-3xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Case</th>
                                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Ngày</th>
                                        <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Số tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {revenueData.recentPayments?.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] font-bold text-[#041837] uppercase truncate max-w-[180px]">{payment.caseTitle}</p>
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tight">{payment.paymentType}</p>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{new Date(payment.paidAt).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4 text-right font-black text-[#041837] text-xs">{formatCurrency(payment.amount)}</td>
                                        </tr>
                                    ))}
                                    {!revenueData.recentPayments?.length && (
                                        <tr><td colSpan="3" className="py-12 text-center text-[10px] font-black text-slate-300 uppercase italic">Chưa phát sinh giao dịch</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Related Cases */}
                <aside className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#041837] mb-8 flex items-center gap-3">
                        <span className="h-6 w-1 rounded-full bg-amber-500" />
                        Vụ việc liên quan
                    </h3>

                    <div className="space-y-4">
                        {cases.length === 0 ? (
                            <div className="py-10 text-center flex flex-col items-center">
                                <HiOutlineUser className="h-10 w-10 text-slate-100 mb-4" />
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Không có dữ liệu</p>
                            </div>
                        ) : (
                            cases.map((caseItem) => (
                                <div key={caseItem.id} className="p-5 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:border-slate-100 border border-transparent transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black uppercase text-blue-500 border border-blue-100">
                                            {caseItem.case_type}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(caseItem.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <p className="font-black text-[#041837] text-sm uppercase leading-tight mb-4 group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {caseItem.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {caseStatusMap[caseItem.status] || caseItem.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ClientDetailView;
