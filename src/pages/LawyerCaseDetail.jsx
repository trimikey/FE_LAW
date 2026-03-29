import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CaseStepDetailModal from '../components/dashboard/CaseStepDetailModal';
import {
  HiArrowLeft,
  HiCalendar,
  HiDocumentText,
  HiDownload,
  HiMail,
  HiOfficeBuilding,
  HiOutlinePrinter,
  HiPhone,
  HiSearch,
  HiTrash,
  HiUpload,
  HiUser,
  HiUserGroup,
  HiX,
  HiCheckCircle,
  HiClock,
  HiCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiChevronRight,
  HiOutlineClock,
  HiOutlineCash,
  HiOutlinePencilAlt,
  HiOutlineShieldExclamation,
  HiArrowNarrowRight,
  HiOutlineAdjustments,
  HiLightningBolt,
  HiOutlineCreditCard
} from 'react-icons/hi';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useVideoCall } from '../contexts/VideoCallContext';
import api from '../services/api';
import bannerImg from '../assets/back_gr_luat.png';

const LawyerCaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCall } = useVideoCall();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [steps, setSteps] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false);
  const [lawyerSearch, setLawyerSearch] = useState('');
  const [lawyerLoading, setLawyerLoading] = useState(false);
  const [availableLawyers, setAvailableLawyers] = useState([]);

  // New states for step details and editing
  const [isStepDetailOpen, setIsStepDetailOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isEditStepModalOpen, setIsEditStepModalOpen] = useState(false);
  const [stepEditData, setStepEditData] = useState({
    status: '',
    feeAmount: 0,
    description: '',
    paymentStatus: 'unpaid'
  });
  const [isConfirmTotalFeeOpen, setIsConfirmTotalFeeOpen] = useState(false);
  const [pendingTotalFee, setPendingTotalFee] = useState(0);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    estimatedFee: 0,
    paymentMode: 'step_by_step'
  });
  const [finance, setFinance] = useState({
    totalPaid: 0,
    totalEstimatedFee: 0,
    budget: 0
  });

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cases/${caseId}`);
      const data = response.data?.data;
      setCaseData(data?.case || null);
      setSteps(data?.steps || []);
      setDocuments(data?.documents || []);
      setProgress(data?.progress?.percentage || 0);
      setFinance(data?.finance || {
        totalPaid: 0,
        totalEstimatedFee: 0,
        budget: data?.case?.estimated_fee || 0
      });
      if (data?.case) {
        setSettingsData({
          estimatedFee: data.case.estimated_fee || 0,
          paymentMode: data.case.payment_mode || 'step_by_step'
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể tải vụ việc');
      navigate('/dashboard?tab=cases', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetail();
  }, [caseId]);

  useEffect(() => {
    if (!isLawyerModalOpen) return;

    const timer = setTimeout(async () => {
      try {
        setLawyerLoading(true);
        const response = await api.get('/lawyer/lawyers', {
          params: {
            page: 1,
            limit: 12,
            search: lawyerSearch || undefined
          }
        });

        const lawyers = response.data?.data?.lawyers || [];
        const filteredLawyers = lawyers.filter((lawyer) => lawyer.user?.email !== caseData?.lawyer?.email);
        setAvailableLawyers(filteredLawyers);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        toast.error('Không thể tải danh sách luật sư');
      } finally {
        setLawyerLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isLawyerModalOpen, lawyerSearch, caseData?.lawyer?.email]);

  if (user?.role_name !== 'lawyer') {
    return <Navigate to="/dashboard" replace />;
  }

  const getCaseTypeLabel = (caseType) => {
    const labels = {
      tax: 'Vụ việc về Thuế',
      tax_transfer: 'Vấn đề Thuế chuyển nhượng',
      business: 'Vụ việc Kinh doanh',
      corporate: 'Doanh nghiệp SME',
      contract: 'Hợp đồng thương mại',
      labor: 'Lao động và nhân sự',
      dispute: 'Tranh chấp kinh doanh',
      consultation: 'Tư vấn pháp lý',
      other: 'Vụ việc khác'
    };
    return labels[caseType] || 'Vụ việc';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao',
      urgent: 'Khẩn cấp'
    };
    return labels[priority] || 'Trung bình';
  };

  const getPriorityClass = (priority) => {
    const classes = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return classes[priority] || 'bg-slate-100 text-slate-700';
  };

  const getStatusMeta = (status) => {
    const statuses = {
      pending: { label: 'Chờ phản hồi', className: 'bg-amber-50 text-amber-600 ring-amber-500/20' },
      in_progress: { label: 'Đang thực hiện', className: 'bg-blue-50 text-blue-600 ring-blue-500/20' },
      reviewing: { label: 'Đang xem xét', className: 'bg-sky-50 text-sky-600 ring-sky-500/20' },
      completed: { label: 'Hoàn thành', className: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20' },
      cancelled: { label: 'Đã hủy', className: 'bg-rose-50 text-rose-600 ring-rose-500/20' }
    };
    return statuses[status] || statuses.pending;
  };

  const getStepStatusMeta = (status) => {
    const statuses = {
      pending: { label: 'Chờ xử lý', dot: 'bg-slate-300', icon: HiClock },
      in_progress: { label: 'Đang làm', dot: 'bg-amber-500', icon: HiClock },
      completed: { label: 'Hoàn thành', dot: 'bg-emerald-500', icon: HiCheckCircle },
      blocked: { label: 'Bị chặn', dot: 'bg-rose-500', icon: HiX }
    };
    return statuses[status] || statuses.pending;
  };

  const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

  const formatFileSize = (size) => {
    const bytes = Number(size || 0);
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const getDocumentTypeBadge = (document) => {
    const extension = String(document.file_name || '').split('.').pop()?.toUpperCase();
    if (document.file_type?.includes('image')) {
      return { label: extension || 'Ảnh', className: 'bg-sky-50 text-sky-600' };
    }
    if (document.file_type?.includes('pdf') || extension === 'PDF') {
      return { label: 'PDF', className: 'bg-rose-50 text-rose-600' };
    }
    return { label: extension || 'FILE', className: 'bg-slate-50 text-slate-600' };
  };

  const updateCaseStatus = async (status) => {
    if (!caseData) return;
    try {
      setUpdatingStatus(true);
      await api.patch(`/lawyer/cases/${caseData.id}/status`, { status });
      setCaseData((prev) => ({ ...prev, status }));
      toast.success('Đã cập nhật trạng thái vụ việc');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setUpdatingStatus(true);
      const response = await api.patch(`/lawyer/cases/${caseId}/status`, {
        estimatedFee: settingsData.estimatedFee,
        paymentMode: settingsData.paymentMode
      });

      setCaseData(prev => ({
        ...prev,
        estimated_fee: settingsData.estimatedFee,
        payment_mode: settingsData.paymentMode
      }));

      setIsSettingsModalOpen(false);
      toast.success('Đã cập nhật cài đặt vụ việc');
      fetchCaseDetail();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi lưu cài đặt');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditStep = (step) => {
    setSelectedStep(step);
    setStepEditData({
      status: step.status,
      feeAmount: step.fee_amount || 0,
      description: step.description || '',
      paymentStatus: step.payment_status || 'unpaid'
    });
    setIsEditStepModalOpen(true);
  };

  const handleSaveStep = async () => {
    if (!selectedStep) return;

    // Tính toán tổng phí dự kiến mới của tất cả các giai đoạn
    const otherStepsFeeSum = steps.filter(s => s.id !== selectedStep.id).reduce((sum, s) => sum + Number(s.fee_amount || 0), 0);
    const newStepsTotalFee = otherStepsFeeSum + Number(stepEditData.feeAmount);
    const currentBudget = Number(caseData?.estimated_fee || 0);

    // Kiểm tra nếu tổng phí các giai đoạn vượt quá Budget của Case
    if (newStepsTotalFee > currentBudget) {
      setPendingTotalFee(newStepsTotalFee);
      setIsConfirmTotalFeeOpen(true);
      return;
    }

    try {
      setUpdatingStatus(true);
      // Cập nhật step status & fee
      await api.patch(`/cases/${caseId}/steps/${selectedStep.id}`, {
        status: stepEditData.status,
        feeAmount: stepEditData.feeAmount,
        description: stepEditData.description
      });

      // Cập nhật payment status (API riêng)
      await api.patch(`/cases/${caseId}/steps/${selectedStep.id}/payment-status`, {
        paymentStatus: stepEditData.paymentStatus
      });

      toast.success('Đã lưu thay đổi giai đoạn');
      setIsEditStepModalOpen(false);
      fetchCaseDetail();
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi lưu thay đổi');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmTotalFeeUpdate = async () => {
    try {
      setUpdatingStatus(true);

      // 1. Cập nhật budget của Case trước
      await api.patch(`/lawyer/cases/${caseId}/status`, {
        estimatedFee: pendingTotalFee
      });

      // 2. Cập nhật Step Fee sau
      await api.patch(`/cases/${caseId}/steps/${selectedStep.id}`, {
        status: stepEditData.status,
        feeAmount: stepEditData.feeAmount,
        description: stepEditData.description
      });

      toast.success('Đã cập nhật Budget vụ việc và phí giai đoạn');
      setIsConfirmTotalFeeOpen(false);
      setIsEditStepModalOpen(false);
      fetchCaseDetail();
    } catch (error) {
      console.error('Error confirming total fee update:', error);
      toast.error('Lỗi khi cập nhật thông tin');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updateStepStatus = async (stepId, status) => {
    try {
      await api.patch(`/cases/${caseId}/steps/${stepId}`, { status });
      await fetchCaseDetail();
      toast.success('Đã cập nhật tiến độ bước');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật bước');
    }
  };

  const handleSidebarTabChange = (tab) => {
    navigate(`/dashboard?tab=${tab}`);
  };

  const handleStartCaseCall = () => {
    if (!caseData?.client?.id) {
      toast.error('Vụ việc này chưa có khách hàng để kết nối');
      return;
    }

    startCall({
      id: Number(caseData.client.id),
      name: caseData.client.full_name || 'Khách hàng',
      caseCode: `#VV-${String(caseData?.id || 0).padStart(4, '0')}`,
      caseTitle: caseData.title,
      caseSummary: caseData.description || 'Đang trao đổi về tiến độ và tài liệu vụ việc.',
      documents: documents.slice(0, 5).map((document) => ({
        name: document.file_name,
        meta: `${formatFileSize(document.file_size)} • ${new Date(document.created_at).toLocaleDateString('vi-VN')}`
      }))
    });
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    formData.append('category', 'evidence');

    try {
      setIsUploadingDoc(true);
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.success) {
        toast.success('Tải lên tài liệu thành công');
        fetchCaseDetail();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi tải lên tài liệu');
    } finally {
      setIsUploadingDoc(false);
      e.target.value = '';
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Không thể tải xuống tài liệu');
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Đã xóa tài liệu');
      fetchCaseDetail();
    } catch (error) {
      toast.error('Lỗi khi xóa tài liệu');
    }
  };

  const handleContactLawyer = (lawyer) => {
    navigate(`/dashboard?tab=messages&partner=${lawyer.user_id}`);
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="cases" setActiveTab={handleSidebarTabChange}>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout activeTab="cases" setActiveTab={handleSidebarTabChange}>
        <div className="flex flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white py-20 text-center text-slate-400 shadow-sm">
          <HiSearch className="h-16 w-16 mb-4 opacity-20" />
          <p className="font-black uppercase tracking-widest text-sm">Không tìm thấy thông tin vụ việc.</p>
        </div>
      </DashboardLayout>
    );
  }

  const estimatedFee = Number(finance.totalEstimatedFee || 0);
  const paidFee = Number(finance.totalPaid || 0);
  const budget = Number(finance.budget || 0);
  const remainingFee = Math.max(estimatedFee - paidFee, 0);
  const caseCode = `#VV-${new Date(caseData?.created_at).getFullYear()}-${String(caseData?.id || 0).padStart(3, '0')}`;
  const caseStatus = getStatusMeta(caseData.status);
  const totalDocumentBytes = documents.reduce((sum, item) => sum + Number(item.file_size || 0), 0);

  return (
    <DashboardLayout activeTab="cases" setActiveTab={handleSidebarTabChange}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard?tab=cases')}
            className="group flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#041837] text-amber-500 shadow-xl transition-all hover:scale-110 active:scale-95"
          >
            <HiArrowLeft className="h-6 w-6 transition group-hover:-translate-x-1" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hồ sơ vụ việc thụ lý</p>
            <h1 className="text-3xl font-black text-[#041837] tracking-tight uppercase">Chi tiết hồ sơ pháp lý</h1>
          </div>
        </div>

        {/* Premium Banner Hero */}
        <div className="relative overflow-hidden rounded-[50px] bg-[#041837] text-white shadow-2xl">
          <div className="absolute inset-0">
            <img src={bannerImg} alt="Banner" className="h-full w-full object-cover opacity-20 mix-blend-overlay rotate-1 scale-110" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#041837] via-transparent to-amber-500/10" />
          </div>

          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10 px-12 py-14">
            <div className="flex-1 text-center xl:text-left">
              <div className="mb-6 flex flex-wrap items-center justify-center xl:justify-start gap-3">
                <span className={`rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-amber-500 text-[#041837]`}>{caseStatus.label}</span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-300 border border-white/10">{caseCode}</span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-300 border border-white/10">{getCaseTypeLabel(caseData.case_type)}</span>
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${caseData.payment_mode === 'step_by_step' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20' : 'bg-pink-500/20 text-pink-300 border-pink-500/20'}`}>
                  {caseData.payment_mode === 'step_by_step' ? 'Thanh toán theo giai đoạn' : 'Thanh toán trọn gói'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-tight uppercase line-clamp-2">{caseData.title}</h2>
              <div className="flex flex-wrap justify-center xl:justify-start gap-8 opacity-80">
                <div className="flex items-center gap-3">
                  <HiCalendar className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">{new Date(caseData.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlineChartBar className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-bold uppercase tracking-widest">Tiến độ: {progress}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlineCash className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">Tổng phí: {formatCurrency(estimatedFee)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              {caseData.status !== 'completed' && (
                <button
                  onClick={() => updateCaseStatus(caseData.status === 'in_progress' ? 'completed' : 'in_progress')}
                  className={`flex items-center justify-center gap-3 rounded-2xl ${caseData.status === 'in_progress' ? 'bg-emerald-500' : 'bg-amber-500'} px-8 py-5 text-xs font-black uppercase tracking-widest text-[#041837] shadow-xl transition hover:bg-white active:scale-95 whitespace-nowrap`}
                >
                  {caseData.status === 'in_progress' ? <HiCheckCircle className="h-5 w-5" /> : <HiClock className="h-5 w-5" />}
                  {caseData.status === 'in_progress' ? 'Duyệt hoàn thành' : 'Bắt đầu thực hiện'}
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/20 active:scale-95 whitespace-nowrap"
              >
                <HiOutlinePrinter className="h-5 w-5" />
                Xuất báo cáo PDF
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/20 active:scale-95 whitespace-nowrap"
              >
                <HiOutlineAdjustments className="h-5 w-5" />
                Cài đặt vụ việc
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_380px] items-start">
          <div className="space-y-10">
            {/* Main Content Sections */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <HiOutlineDocumentText className="h-40 w-40 text-[#041837]" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase mb-8">Nội dung vụ việc</h3>
                <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 leading-relaxed text-slate-600 font-medium text-lg min-h-[150px]">
                  {caseData.description || 'Chưa có thông tin mô tả chi tiết.'}
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase">Tiến trình xử lý</h3>
                <span className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 tracking-widest uppercase">{steps.length} Giai đoạn</span>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:left-14 before:h-full before:w-0.5 before:bg-slate-50">
                {steps.length === 0 ? (
                  <div className="py-20 text-center text-slate-300 italic font-medium uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-[32px]">Chưa thiết lập cột mốc</div>
                ) : (
                  steps.map((step, idx) => {
                    const stepMeta = getStepStatusMeta(step.status);
                    const StepIcon = stepMeta.icon;
                    return (
                      <div key={step.id} className="relative pl-24 group">
                        <div className={`absolute left-9 top-0 h-10 w-10 rounded-full ${stepMeta.dot} border-4 border-white shadow-lg flex items-center justify-center text-white z-10 group-hover:scale-110 transition-transform`}>
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <div className="bg-white border border-slate-50 rounded-[32px] p-6 shadow-sm group-hover:shadow-xl group-hover:border-blue-500/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'completed' ? 'text-emerald-500' : step.status === 'in_progress' ? 'text-blue-500' : 'text-slate-400'}`}>{stepMeta.label}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-200" />
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Giai đoạn {idx + 1}</span>
                              {step.fee_amount > 0 && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${step.payment_status === 'paid' ? 'bg-emerald-50 border-emerald-100/50' : 'bg-amber-50 border-amber-100/50'}`}>
                                    <HiOutlineCash className={step.payment_status === 'paid' ? 'text-emerald-500 text-xs' : 'text-amber-500 text-xs'} />
                                    <span className={`text-[10px] font-black uppercase tracking-tight ${step.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                      {Number(step.fee_amount).toLocaleString('vi-VN')} đ • {step.payment_status === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA TRẢ'}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            <h4 className="text-xl font-black text-[#041837] uppercase mb-2">{step.step_name}</h4>
                            <p className="text-sm text-slate-500 font-medium line-clamp-2">{step.description || 'Chưa có mô tả chi tiết cho giai đoạn này.'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedStep(step);
                                setIsStepDetailOpen(true);
                              }}
                              className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-inner"
                              title="Xem chi tiết nội dung"
                            >
                              <HiOutlineDocumentText size={20} />
                            </button>
                            <button
                              onClick={() => handleEditStep(step)}
                              className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-[#041837] transition-all shadow-inner"
                              title="Chỉnh sửa thông tin và phí"
                            >
                              <HiOutlinePencilAlt size={20} />
                            </button>
                            {step.status !== 'completed' && (
                              <button
                                onClick={() => updateStepStatus(step.id, 'completed')}
                                className="h-12 px-6 rounded-2xl bg-[#041837] text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-500 transition-all whitespace-nowrap shadow-lg shadow-black/5"
                              >
                                Hoàn tất
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-10">
            {/* Financial Overview Card */}
            <div className="bg-[#041837] rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <HiOutlineCash className="h-64 w-64 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Quản trị tài chính</h3>
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
                    <HiOutlineCreditCard className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã quyết toán</p>
                      <p className="text-2xl font-black text-emerald-400">{formatCurrency(finance.totalPaid)}</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giai đoạn dở dang</p>
                      <p className="text-2xl font-black text-amber-400">{formatCurrency(finance.totalEstimatedFee - finance.totalPaid)}</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Tổng phí các giai đoạn</p>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">Cập nhật theo bước</span>
                      </div>
                    </div>
                    <p className="text-4xl font-black text-white leading-none mb-4">{formatCurrency(finance.totalEstimatedFee)}</p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: `${finance.budget > 0 ? (finance.totalPaid / finance.budget * 100) : 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      Đã giải ngân {finance.budget > 0 ? Math.round(finance.totalPaid / finance.budget * 100) : 0}% trên tổng ngân sách
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ngân sách thỏa thuận</p>
                      <p className="font-black text-white uppercase text-xl leading-none">{formatCurrency(finance.budget)}</p>
                    </div>
                    {finance.totalEstimatedFee !== finance.budget && (
                      <div className="flex flex-col items-end">
                        <div className={`h-10 w-10 rounded-full ${Math.abs(finance.totalEstimatedFee - finance.budget) < 1000 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} flex items-center justify-center animate-bounce mb-1`} title={finance.totalEstimatedFee > finance.budget ? "Tổng phí vượt ngân sách" : "Tổng phí chưa đủ ngân sách"}>
                          <HiOutlineShieldExclamation className="h-6 w-6" />
                        </div>
                        <p className={`text-[8px] font-black uppercase ${finance.totalEstimatedFee > finance.budget ? 'text-rose-400' : 'text-amber-400'}`}>
                          {finance.totalEstimatedFee > finance.budget ? 'Vượt NS' : 'Chưa khớp NS'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Participants Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#041837] mb-8 flex items-center gap-3">
                <span className="h-6 w-1 rounded-full bg-blue-500" />
                Nhân sự & Khách hàng
              </h3>

              <div className="space-y-6">
                {/* Manager */}
                <div className="group rounded-[32px] bg-slate-50 p-6 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl transition-all">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-4">Luật sư phụ trách</p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-[#041837] text-amber-500 flex items-center justify-center font-black text-xl group-hover:rotate-6 transition-transform">
                      {(caseData.lawyer?.full_name || 'L').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-[#041837] text-sm uppercase truncate">{caseData.lawyer?.full_name || user?.full_name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase truncate mt-1">{caseData.lawyer?.lawyer?.law_firm || 'Hệ thống chuyên gia'}</p>
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="group rounded-[32px] bg-slate-50 p-6 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl transition-all">
                  <p className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-4">Thông tin khách hàng</p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center font-black text-xl group-hover:-rotate-6 transition-transform">
                      {(caseData.client?.full_name || 'K').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-[#041837] text-sm uppercase truncate">{caseData.client?.full_name || 'Khách hàng ẩn'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase truncate mt-1">{caseData.client?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsLawyerModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-amber-500 hover:text-[#041837] hover:border-amber-500 transition-all"
                >
                  + Mời chuyên gia cộng tác
                </button>
              </div>
            </div>

            {/* Quick Actions / Connect */}
            <div className="bg-[#041837] rounded-[40px] p-8 shadow-2xl space-y-4">
              <button
                onClick={handleStartCaseCall}
                className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md rounded-[24px] px-6 py-5 group hover:bg-emerald-500/20 transition-all border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <HiPhone className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Kết nối Video Call</span>
                </div>
                <HiChevronRight className="h-5 w-5 text-white/30" />
              </button>

              <button
                onClick={() => navigate(`/dashboard?tab=messages&partner=${caseData.client?.id || ''}`)}
                className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md rounded-[24px] px-6 py-5 group hover:bg-blue-500/20 transition-all border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <HiMail className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Trung tâm lời nhắn</span>
                </div>
                <HiChevronRight className="h-5 w-5 text-white/30" />
              </button>
            </div>

            {/* Documents Summary Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#041837]">Kho tài liệu ({documents.length})</h3>
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <HiOutlineBriefcase className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                {documents.slice(0, 3).map(doc => {
                  const badge = getDocumentTypeBadge(doc);
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:bg-white hover:border-slate-100 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-[9px] shrink-0 ${badge.className}`}>
                          {badge.label}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#041837] truncate uppercase tracking-tight">{doc.file_name}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{formatFileSize(doc.file_size)}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDownloadDocument(doc)} className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all">
                        <HiDownload className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="w-full mt-6 py-4 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-[#041837] hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                MỞ KHO HỒ SƠ
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Existing Modals and other sections preserved with premium styling */}
      {
        isDocsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[50px] bg-white shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              <div className="flex items-center justify-between border-b border-slate-50 px-10 py-8">
                <div>
                  <h3 className="text-3xl font-black text-[#041837] tracking-tight uppercase">Kho tài liệu vụ việc</h3>
                  <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">TỔNG HỢP {documents.length} TẬP TIN HỒ SƠ</p>
                </div>
                <button type="button" onClick={() => setIsDocsModalOpen(false)} className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                  <HiX className="h-7 w-7" />
                </button>
              </div>

              <div className="grid flex-1 gap-10 overflow-y-auto p-10 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="space-y-8">
                  <div className="rounded-[40px] border-2 border-dashed border-blue-200 bg-blue-50/30 p-8 shadow-inner">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl mb-6">
                      <HiUpload className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-black text-[#041837] uppercase mb-3">Tải hồ sơ bổ sung</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">Hỗ trợ đầy đủ các định dạng phổ biến: PDF, DOCX, Hình ảnh chứng cứ.</p>

                    <label className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#041837] py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:bg-blue-600 active:scale-95 transition-all">
                      {isUploadingDoc ? 'Đang tải lên...' : 'CHỌN FILE TỪ MÁY'}
                      <input type="file" className="hidden" onChange={handleUploadDocument} disabled={isUploadingDoc} />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[32px] bg-slate-50 p-6 border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Số lượng</p>
                      <p className="text-3xl font-black text-[#041837]">{documents.length} <span className="text-[10px] text-slate-300 tracking-tighter uppercase">Tệp</span></p>
                    </div>
                    <div className="rounded-[32px] bg-slate-50 p-6 border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Dung lượng</p>
                      <p className="text-3xl font-black text-[#041837]">{formatFileSize(totalDocumentBytes).split(' ')[0]}<span className="text-xs ml-1 text-slate-300 uppercase">{formatFileSize(totalDocumentBytes).split(' ')[1]}</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {documents.map((document) => {
                    const badge = getDocumentTypeBadge(document);
                    return (
                      <div key={document.id} className="group flex flex-col gap-6 rounded-[32px] border border-slate-50 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between hover:shadow-2xl hover:border-blue-500/10 transition-all">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] text-[10px] font-black ${badge.className} shadow-sm group-hover:scale-110 transition-transform uppercase`}>
                            {badge.label}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-lg font-black text-[#041837] uppercase tracking-tight">{document.file_name}</p>
                            <div className="mt-2 flex flex-wrap gap-4 items-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatFileSize(document.file_size)}</p>
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(document.created_at).toLocaleDateString('vi-VN')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleDownloadDocument(document)} className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <HiDownload className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteDocument(document.id)} className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-all">
                            <HiTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        isLawyerModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[50px] bg-white shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />
              <div className="flex items-center justify-between border-b border-slate-50 px-10 py-8">
                <div>
                  <h3 className="text-3xl font-black text-[#041837] tracking-tight uppercase">Mời chuyên gia cộng tác</h3>
                  <p className="mt-1 text-sm text-slate-400 font-bold uppercase tracking-widest">DANH SÁCH {availableLawyers.length} LUẬT SƯ KẾT NỐI</p>
                </div>
                <button type="button" onClick={() => setIsLawyerModalOpen(false)} className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                  <HiX className="h-7 w-7" />
                </button>
              </div>

              <div className="overflow-y-auto p-10">
                <div className="relative mb-10 group">
                  <HiSearch className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="text"
                    value={lawyerSearch}
                    onChange={(e) => setLawyerSearch(e.target.value)}
                    placeholder="Tiềm kiếm đối tác chuyên môn..."
                    className="w-full rounded-[28px] border-2 border-slate-100 bg-slate-50 py-6 pl-16 pr-6 text-lg font-bold text-[#041837] outline-none transition focus:border-amber-500 shadow-inner"
                  />
                </div>

                {lawyerLoading ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {availableLawyers.map((lawyerItem) => (
                      <div key={lawyerItem.id} className="group rounded-[32px] border border-slate-100 bg-white p-6 transition-all hover:shadow-2xl hover:border-amber-500/10">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#041837] text-xl font-black text-amber-500 shadow-xl group-hover:rotate-6 transition-transform">
                            {(lawyerItem.user?.full_name || 'L').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xl font-black text-[#041837] uppercase tracking-tight">{lawyerItem.user?.full_name}</p>
                            <p className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4">{lawyerItem.law_firm || 'Chuyên gia tư vấn'}</p>
                            <div className="flex flex-wrap gap-2">
                              {String(lawyerItem.specialties || 'Đa lĩnh vực').split(',').slice(0, 2).map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-widest">{tag.trim()}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                          <button
                            onClick={() => handleContactLawyer(lawyerItem)}
                            className="flex-1 rounded-[20px] bg-[#041837] py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all shadow-xl"
                          >
                            GỬI LỜI MỜI
                          </button>
                          <button
                            onClick={() => navigate(`/lawyers/${lawyerItem.id}`)}
                            className="px-6 py-4 rounded-[20px] bg-slate-100 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 transition-all"
                          >
                            HỒ SƠ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Step Detail Modal */}
      {
        isStepDetailOpen && (
          <CaseStepDetailModal
            step={selectedStep}
            caseData={caseData}
            onUpdateCase={fetchCaseDetail}
            onClose={() => setIsStepDetailOpen(false)}
          />
        )
      }

      {/* Edit Step Modal */}
      {
        isEditStepModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-2xl overflow-hidden rounded-[50px] bg-white shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              <div className="flex items-center justify-between border-b border-slate-50 px-10 py-8">
                <div>
                  <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase">Cấu hình giai đoạn</h3>
                  <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedStep?.step_name}</p>
                </div>
                <button type="button" onClick={() => setIsEditStepModalOpen(false)} className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Trạng thái tiến độ</label>
                    <select
                      value={stepEditData.status}
                      onChange={(e) => setStepEditData({ ...stepEditData, status: e.target.value })}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-4 font-bold text-[#041837] outline-none focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="in_progress">Đang làm</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="blocked">Bị chặn</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Trạng thái thanh toán</label>
                    <select
                      value={stepEditData.paymentStatus}
                      onChange={(e) => setStepEditData({ ...stepEditData, paymentStatus: e.target.value })}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 py-4 font-bold text-[#041837] outline-none focus:border-amber-500 transition-all appearance-none"
                    >
                      <option value="unpaid">Chưa thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 rounded-3xl bg-slate-50 p-6 border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Ngân sách thỏa thuận</p>
                      <p className="text-lg font-black text-[#041837]">{formatCurrency(finance.budget)}</p>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tổng phí các bước</p>
                      <p className={`text-lg font-black ${finance.totalEstimatedFee > finance.budget ? 'text-rose-500' : 'text-blue-600'}`}>
                        {formatCurrency(finance.totalEstimatedFee)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phí giai đoạn (VND)</label>
                      <span className={`text-[9px] font-bold uppercase ${selectedStep?.fee_change_count >= 3 ? 'text-rose-500' : 'text-amber-500'}`}>
                        {selectedStep?.fee_change_count >= 3 ? 'Hết lượt đổi' : `Còn ${3 - (selectedStep?.fee_change_count || 0)} lần đổi`}
                      </span>
                    </div>
                    <div className="relative">
                      <HiCurrencyDollar className={`absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 ${selectedStep?.fee_change_count >= 3 ? 'text-slate-200' : 'text-slate-300'}`} />
                      <input
                        type="number"
                        value={stepEditData.feeAmount}
                        onChange={(e) => setStepEditData({ ...stepEditData, feeAmount: e.target.value })}
                        disabled={selectedStep?.fee_change_count >= 3}
                        className={`w-full rounded-2xl border-2 px-14 py-4 font-bold outline-none transition-all ${selectedStep?.fee_change_count >= 3
                          ? 'border-slate-50 bg-slate-50 text-slate-300 cursor-not-allowed'
                          : 'border-slate-100 bg-slate-50 text-[#041837] focus:border-amber-500'
                          }`}
                        placeholder="Nhập số tiền..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Mô tả thực hiện (Dành cho khách hàng)</label>
                    <textarea
                      value={stepEditData.description}
                      onChange={(e) => setStepEditData({ ...stepEditData, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-3xl border-2 border-slate-100 bg-slate-50 p-6 font-medium text-slate-600 outline-none focus:border-blue-500 transition-all resize-none"
                      placeholder="Ghi chú các đầu việc sẽ thực hiện trong giai đoạn này để khách hàng theo dõi..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditStepModalOpen(false)}
                      className="flex-1 py-5 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveStep}
                      disabled={updatingStatus}
                      className="flex-[2] py-5 rounded-2xl bg-[#041837] text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-600 shadow-xl shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {updatingStatus ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Confirm Total Fee Modal */}
      {
        isConfirmTotalFeeOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
            <div className="w-full max-w-lg overflow-hidden rounded-[50px] bg-white shadow-2xl relative p-12 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-amber-50 flex items-center justify-center mb-8">
                <HiOutlineShieldExclamation className="h-12 w-12 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black text-[#041837] tracking-tight uppercase mb-4">Lưu ý ngân sách</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed px-4">
                Tổng chi phí của các giai đoạn ({formatCurrency(pendingTotalFee)}) đang <span className="text-rose-500 font-bold">vượt quá</span> ngân sách hiện tại của vụ việc ({formatCurrency(caseData?.estimated_fee)}).
              </p>

              <div className="bg-slate-50 rounded-[32px] p-8 mb-10 flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget cũ</p>
                  <p className="text-sm font-bold text-slate-400 line-through tracking-tight">{formatCurrency(caseData?.estimated_fee)}</p>
                </div>
                <HiArrowNarrowRight className="h-6 w-6 text-slate-300" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Budget mới</p>
                  <p className="text-lg font-black text-amber-600 tracking-tight">{formatCurrency(pendingTotalFee)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleConfirmTotalFeeUpdate}
                  disabled={updatingStatus}
                  className="w-full py-5 rounded-2xl bg-[#041837] text-[11px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-[#041837] shadow-xl shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
                >
                  {updatingStatus ? 'Đang cập nhật...' : 'Cập nhật Budget & Lưu phí'}
                </button>
                <button
                  onClick={() => setIsConfirmTotalFeeOpen(false)}
                  className="w-full py-5 rounded-2xl bg-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                >
                  Hủy để chỉnh sửa lại
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Case Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl overflow-hidden rounded-[50px] bg-white shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />
            <div className="flex items-center justify-between border-b border-slate-50 px-10 py-8">
              <div>
                <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase">Cài đặt vụ việc</h3>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cấu hình ngân sách và thanh toán</p>
              </div>
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#041837] ml-4">Tổng ngân sách thỏa thuận (VND)</label>
                <div className="relative group">
                  <HiOutlineCash className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="number"
                    value={settingsData.estimatedFee}
                    onChange={(e) => setSettingsData({ ...settingsData, estimatedFee: Number(e.target.value) })}
                    className="w-full rounded-[24px] border-2 border-slate-100 bg-slate-50 py-6 pl-16 pr-8 text-xl font-black text-[#041837] outline-none transition focus:border-amber-500 shadow-inner"
                    placeholder="0"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">VNĐ</div>
                </div>
                <p className="px-6 text-[9px] font-bold text-slate-400 uppercase leading-relaxed italic">
                  * Ngân sách này dùng để đối chiếu với tổng phí các giai đoạn cụ thể.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#041837] ml-4">Hình thức thanh toán</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSettingsData({ ...settingsData, paymentMode: 'step_by_step' })}
                    className={`p-6 rounded-[32px] border-2 transition-all text-left group ${settingsData.paymentMode === 'step_by_step' ? 'bg-indigo-50 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${settingsData.paymentMode === 'step_by_step' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-300'}`}>
                      <HiLightningBolt className="h-5 w-5" />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${settingsData.paymentMode === 'step_by_step' ? 'text-indigo-600' : 'text-slate-400'}`}>Giai đoạn</p>
                    <p className={`text-xs font-bold leading-tight ${settingsData.paymentMode === 'step_by_step' ? 'text-indigo-900' : 'text-slate-400'}`}>Thanh toán khi hoàn thành mỗi bước</p>
                  </button>

                  <button
                    onClick={() => setSettingsData({ ...settingsData, paymentMode: 'lump_sum' })}
                    className={`p-6 rounded-[32px] border-2 transition-all text-left group ${settingsData.paymentMode === 'lump_sum' ? 'bg-pink-50 border-pink-500 shadow-lg shadow-pink-500/10' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${settingsData.paymentMode === 'lump_sum' ? 'bg-pink-500 text-white' : 'bg-white text-slate-300'}`}>
                      <HiOutlineShieldExclamation className="h-5 w-5" />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${settingsData.paymentMode === 'lump_sum' ? 'text-pink-600' : 'text-slate-400'}`}>Trọn gói</p>
                    <p className={`text-xs font-bold leading-tight ${settingsData.paymentMode === 'lump_sum' ? 'text-pink-900' : 'text-slate-400'}`}>Thanh toán một lần sau khi kết thúc vụ việc</p>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex-1 py-5 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={updatingStatus}
                  className="flex-[2] py-5 rounded-2xl bg-[#041837] text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-[#041837] shadow-xl shadow-amber-500/10 active:scale-95 transition-all disabled:opacity-50"
                >
                  {updatingStatus ? 'Đang lưu...' : 'LƯU CÀI ĐẶT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LawyerCaseDetail;