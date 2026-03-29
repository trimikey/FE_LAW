import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import bannerImg from '../assets/back_gr_luat.png';
import { useVideoCall } from '../contexts/VideoCallContext';
import CaseStepDetailModal from '../components/dashboard/CaseStepDetailModal';
import {
  HiOutlineUserGroup,
  HiOutlinePrinter,
  HiPencil,
  HiPlus,
  HiOutlineDocument,
  HiDownload,
  HiOutlinePhone,
  HiOutlineChat,
  HiExternalLink,
  HiCheckCircle,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineExternalLink,
  HiArrowLeft,
  HiCalendar,
  HiCurrencyDollar,
  HiClock,
  HiX,
  HiChevronRight,
  HiOutlineChartBar,
  HiOutlineBriefcase,
  HiOutlineCash
} from 'react-icons/hi';

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCall } = useVideoCall();
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [steps, setSteps] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isStepDetailOpen, setIsStepDetailOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    category: 'other',
    description: '',
    files: []
  });

  const [finance, setFinance] = useState({
    totalPaid: 0,
    totalEstimatedFee: 0,
    budget: 0
  });

  const [isEditIntakeOpen, setIsEditIntakeOpen] = useState(false);
  const [editIntakeData, setEditIntakeData] = useState({
    receivedNotice: false,
    noticeType: '',
    summary: ''
  });

  useEffect(() => {
    fetchCaseDetail();
    // Hook up global handler for Modal
    window.handleGlobalStepPayment = handleStepPayment;
    return () => {
      delete window.handleGlobalStepPayment;
    };
  }, [caseId]);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cases/${caseId}`);
      setCaseData(response.data.data.case);
      setSteps(response.data.data.steps || []);
      setDocuments(response.data.data.documents || []);
      setFinance(response.data.data.finance || { totalPaid: 0, totalEstimatedFee: 0, budget: response.data.data.case?.estimated_fee || 0 });

      if (response.data.data.case?.intake_data) {
        setEditIntakeData({
          receivedNotice: response.data.data.case.intake_data.receivedNotice || false,
          noticeType: response.data.data.case.intake_data.noticeType || '',
          summary: response.data.data.case.intake_data.summary || ''
        });
      }
    } catch (error) {
      console.error('Error fetching case:', error);
      toast.error('Không thể tải thông tin vụ việc');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStepPayment = async (stepOrAll) => {
    try {
      setUpdating(true);
      const stepId = stepOrAll === 'all' ? 'all' : (stepOrAll?.id || stepOrAll);

      // Lưu path hiện tại để redirect về sau khi thanh toán
      localStorage.setItem('payos_return_path', window.location.pathname);

      const response = await api.post(`/cases/${caseId}/steps/${stepId}/payment-link`);

      if (response.data.success && response.data.data.checkoutUrl) {
        window.location.href = response.data.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.response?.data?.message || 'Lỗi khi tạo liên kết thanh toán');
      setUpdating(false);
    }
  };

  useEffect(() => {
    window.handleGlobalStepPayment = (step) => {
      handleStepPayment(step);
    };
    return () => {
      delete window.handleGlobalStepPayment;
    };
  }, [handleStepPayment]);

  const handleSidebarTabChange = (tab) => {
    navigate(`/dashboard?tab=${tab}`);
  };

  const handleUpdateStepStatus = async (status) => {
    if (!selectedStep) return;
    try {
      setUpdating(true);
      await api.patch(`/cases/${caseId}/steps/${selectedStep.id}`, { status });
      toast.success('Cập nhật trạng thái thành công');
      setShowUpdateModal(false);
      fetchCaseDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi khi cập nhật trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.files.length) {
      toast.error('Vui lòng chọn ít nhất một tệp');
      return;
    }

    try {
      setUploading(true);
      for (const file of uploadData.files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('caseId', caseId);
        formData.append('category', uploadData.category);
        formData.append('description', uploadData.description);

        await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success('Tải lên tài liệu thành công');
      setShowUploadModal(false);
      setUploadData({ category: 'other', description: '', files: [] });
      fetchCaseDetail();
    } catch (error) {
      console.error('Error uploading docs:', error);
      toast.error('Lỗi khi tải lên tài liệu');
    } finally {
      setUploading(false);
    }
  };

  const calculateProgress = () => {
    if (!steps.length) return 0;
    const completed = steps.filter(s => s.status === 'completed').length;
    return Math.round((completed / steps.length) * 100);
  };

  const getFileIcon = (fileType, fileName) => {
    if (!fileName) return (fileType || 'FILE').toUpperCase().slice(0, 4);
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['doc', 'docx'].includes(ext)) return 'DOCX';
    if (['xls', 'xlsx'].includes(ext)) return 'XLSX';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'IMG';
    return ext.toUpperCase().slice(0, 4);
  };


  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      await api.delete(`/documents/${docId}`);
      toast.success('Đã xóa tài liệu');
      fetchCaseDetail();
    } catch (error) {
      toast.error('Lỗi khi xóa tài liệu');
    }
  };

  const handleSaveIntake = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.post(`/client/cases/${caseId}/intake`, { intakeData: editIntakeData });
      toast.success('Cập nhật hồ sơ thành công');
      setIsEditIntakeOpen(false);
      fetchCaseDetail();
    } catch (error) {
      console.error('Error updating intake:', error);
      toast.error('Lỗi khi cập nhật hồ sơ');
    } finally {
      setUpdating(false);
    }
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

  if (!caseData) return null;

  const getCaseTypeLabel = (caseType) => {
    const labels = {
      tax: 'Vụ việc về Thuế',
      tax_transfer: 'Vấn đề Thuế chuyển nhượng',
      business: 'Vụ việc Kinh doanh',
      corporate: 'Doanh nghiệp SME',
      contract: 'Hợp đồng thương mại',
      labor: 'Lao động và nhân sự',
      dispute: 'Tranh chấp dân sự',
      consultation: 'Tư vấn pháp lý',
      video: 'Tư vấn Video Call',
      phone: 'Tư vấn qua điện thoại',
      in_person: 'Gặp mặt trực tiếp'
    };
    return labels[caseType] || 'Vụ việc pháp lý';
  };

  const formattedCaseId = `#VV-${new Date(caseData.created_at).getFullYear()}-${String(caseData.id).padStart(3, '0')}`;
  const progress = calculateProgress();

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '0 VNĐ';
    const val = Number(amount);
    return `${new Intl.NumberFormat('vi-VN').format(val)} VNĐ`;
  };

  const getStatusConfig = (status) => {
    if (status === 'completed') return { text: 'HOÀN THÀNH', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
    if (status === 'in_progress') return { text: 'ĐANG THỰC HIỆN', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' };
    if (status === 'paused') return { text: 'TẠM DỪNG', color: 'text-rose-600', bg: 'bg-rose-50', dot: 'bg-rose-500' };
    return { text: 'CHỜ PHẢN HỒI', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
  };

  const statusConfig = getStatusConfig(caseData.status);

  return (
    <DashboardLayout activeTab="cases" setActiveTab={handleSidebarTabChange}>
      <div className="relative isolate overflow-hidden rounded-[42px] bg-[linear-gradient(180deg,#f8fbff_0%,#f3f7fd_38%,#eef4fb_100%)] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20 md:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.16)_0%,rgba(251,191,36,0.04)_45%,transparent_72%)] blur-2xl" />
          <div className="absolute right-[-6%] top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,rgba(59,130,246,0.03)_46%,transparent_74%)] blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(4,24,55,0.08)_0%,rgba(4,24,55,0.02)_45%,transparent_74%)] blur-3xl" />
          <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: 'linear-gradient(rgba(4,24,55,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(4,24,55,0.12) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hành trình pháp lý của bạn</p>
            <h1 className="text-3xl font-black text-[#041837] tracking-tight uppercase">Theo dõi tiến độ vụ việc</h1>
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
              <div className="mb-6 flex flex-wrap justify-center xl:justify-start gap-3">
                <span className={`rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-amber-500 text-[#041837]`}>{statusConfig.text}</span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-300 border border-white/10">{formattedCaseId}</span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-300 border border-white/10">{getCaseTypeLabel(caseData?.case_type)}</span>
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
                  <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">Tổng phí: {formatCurrency(caseData?.estimated_fee)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white text-[#041837] px-8 py-5 text-xs font-black uppercase tracking-widest shadow-xl transition hover:bg-amber-500 active:scale-95 whitespace-nowrap"
              >
                <HiOutlinePrinter className="h-5 w-5" />
                In hồ sơ chi tiết
              </button>
              <button
                onClick={() => navigate(`/dashboard?tab=messages&partner=${caseData.lawyer?.id || ''}`)}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/20 active:scale-95 whitespace-nowrap"
              >
                <HiOutlineChat className="h-5 w-5" />
                Trao đổi với Luật sư
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_380px] items-start">
          <div className="space-y-10">
            {/* Summary Section */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <HiOutlineDocument className="h-40 w-40 text-[#041837]" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase mb-8">Nội dung tóm tắt</h3>
                <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 leading-relaxed text-slate-600 font-medium text-lg">
                  {caseData.description || 'Nội dung vụ việc đang được cập nhật chi tiết từ đội ngũ hỗ trợ pháp lý.'}
                </div>
              </div>
            </div>

            {/* Intake Data Section */}
            {caseData.intake_data && (
              <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm overflow-hidden group/intake">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase flex items-center gap-3">
                    <span className="h-8 w-8 rounded-xl bg-amber-500 text-[#041837] flex items-center justify-center">
                      <HiOutlineChartBar className="h-5 w-5" />
                    </span>
                    Thông tin thu thập ban đầu
                  </h3>
                  <button
                    onClick={() => setIsEditIntakeOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-[#041837] hover:text-white transition-all shadow-sm"
                  >
                    <HiPencil className="h-4 w-4" />
                    Chỉnh sửa hồ sơ
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sự việc xảy ra</p>
                      <p className="text-sm font-bold text-[#041837] leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                        "{caseData.intake_data.whatHappened || 'Chưa cung cấp'}"
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Thời điểm</p>
                        <p className="text-sm font-bold text-[#041837] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {caseData.intake_data.whenHappened || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Bên liên quan</p>
                        <p className="text-sm font-bold text-[#041837] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {caseData.intake_data.whoInvolved || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Trạng thái nhận thông báo</p>
                      <div className={`p-4 rounded-2xl border ${caseData.intake_data.receivedNotice ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-sm font-black text-[#041837]">
                          {caseData.intake_data.receivedNotice ? 'ĐÃ NHẬN THÔNG BÁO' : 'CHƯA NHẬN THÔNG BÁO'}
                        </p>
                        {caseData.intake_data.receivedNotice && (
                          <p className="mt-2 text-xs font-bold text-amber-700 uppercase tracking-tight">
                            Loại: {caseData.intake_data.noticeType || 'Khác'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="bg-[#041837] p-6 rounded-[32px] text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Lưu ý chuyên môn</p>
                      <p className="text-xs font-medium leading-relaxed italic opacity-80">
                        Thông tin này giúp Luật sư định hướng hồ sơ chính xác hơn. Bạn có thể bổ sung tài liệu liên quan phía dưới.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Section */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase">Tiến trình pháp lý</h3>
                <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 tracking-widest uppercase">{steps.length} Giai đoạn xử lý</div>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:left-14 before:h-full before:w-0.5 before:bg-slate-50">
                {steps.length === 0 ? (
                  <div className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-[32px]">Luật sư đang thiết lập lộ trình</div>
                ) : (
                  steps.map((step, index) => (
                    <div key={step.id} className="relative pl-24 group">
                      <div className={`absolute left-9 top-0 h-10 w-10 rounded-full ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'} border-4 border-white shadow-lg flex items-center justify-center text-white z-10 group-hover:scale-110 transition-transform`}>
                        {step.status === 'completed' ? <HiCheckCircle className="h-5 w-5" /> : <HiClock className="h-5 w-5" />}
                      </div>
                      <div
                        onClick={() => {
                          setSelectedStep(step);
                          setIsStepDetailOpen(true);
                        }}
                        className={`bg-white border rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 ${step.status === 'in_progress' ? 'border-blue-500/20 bg-blue-50/30 ring-1 ring-blue-500/20' : 'border-slate-50'}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'completed' ? 'text-emerald-500' : step.status === 'in_progress' ? 'text-blue-500' : 'text-slate-400'}`}>
                              {step.status === 'completed' ? 'Đã hoàn tất' : step.status === 'in_progress' ? 'Đang thực hiện' : 'Sắp tới'}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Giai đoạn {index + 1}</span>
                            {step.fee_amount > 0 && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${step.payment_status === 'paid' ? 'bg-emerald-50 border-emerald-100/50' : 'bg-amber-50 border-amber-100/50'}`}>
                                  <HiOutlineCash className={step.payment_status === 'paid' ? 'text-emerald-500 text-xs' : 'text-amber-500 text-xs'} />
                                  <span className={`text-[10px] font-black uppercase tracking-tight ${step.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {Number(step.fee_amount).toLocaleString('vi-VN')} đ • {step.payment_status === 'paid' ? 'ĐÃ TRẢ' : 'CHƯA TRẢ'}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <h4 className="text-xl font-black text-[#041837] uppercase mb-2 group-hover:text-blue-600 transition-colors">{step.step_name}</h4>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{step.description || 'Nhấn để xem lộ trình xử lý chi tiết từ phía luật sư.'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {caseData.payment_mode === 'step_by_step' && step.payment_status === 'unpaid' && step.fee_amount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStepPayment(step);
                              }}
                              className="h-12 px-6 rounded-2xl bg-amber-500 text-[10px] font-black uppercase tracking-widest text-[#041837] hover:bg-[#041837] hover:text-white transition-all shadow-lg shadow-amber-500/10"
                            >
                              Thanh toán ngay
                            </button>
                          )}
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                            <HiChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-10">
            {/* Lawyer Profile Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#041837] mb-8 flex items-center gap-3">
                <span className="h-6 w-2 rounded-full bg-amber-500" />
                Đại diện pháp lý
              </h3>

              <div className="group rounded-[32px] bg-[#041837] p-8 text-white relative overflow-hidden transition-all hover:shadow-2xl">
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/5 rounded-full blur-2xl" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-3xl bg-white text-[#041837] flex items-center justify-center font-black text-3xl shadow-2xl mb-6 transform group-hover:rotate-6 transition-transform">
                    {caseData.lawyer?.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-amber-500">Luật sư chuyên trách</p>
                  <h4
                    className="mb-2 w-full max-w-full truncate text-xl font-black tracking-tight uppercase"
                    title={caseData.lawyer?.full_name || caseData.lawyer?.email || 'Chưa cập nhật'}
                  >
                    {caseData.lawyer?.full_name || caseData.lawyer?.email || 'Chưa cập nhật'}
                  </h4>
                  {caseData.lawyer?.email && (
                    <p
                      className="mb-4 w-full max-w-full truncate text-sm font-semibold normal-case text-white/70"
                      title={caseData.lawyer.email}
                    >
                      {caseData.lawyer.email}
                    </p>
                  )}
                  <div className="h-px w-20 bg-white/10 mb-6" />
                  <p className="mb-8 text-[10px] font-bold uppercase tracking-widest text-white/40">Văn phòng Luật sư Hiểu Luật</p>
                  <button
                    onClick={() => navigate(`/dashboard?tab=messages&partner=${caseData.lawyer?.id || ''}`)}
                    className="w-full py-4 rounded-2xl bg-amber-500 text-[#041837] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white active:scale-95 shadow-xl"
                  >
                    Gửi tin nhắn trực tiếp
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Overview Card */}
            <div className="bg-[#041837] rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <HiOutlineCash className="h-48 w-48 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-8">Trạng thái thanh toán</h3>

                <div className="space-y-8">
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Ngân sách thỏa thuận</p>
                    <p className="text-3xl font-black text-white mb-4">{formatCurrency(finance.budget)}</p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Đã thanh toán</p>
                      <p className="text-sm font-black text-emerald-400">{formatCurrency(finance.totalPaid)}</p>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: `${finance.budget > 0 ? (finance.totalPaid / finance.budget * 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Tổng phí giai đoạn</p>
                      <p className="text-sm font-black text-white">{formatCurrency(finance.totalEstimatedFee)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1">Cần thanh toán thêm</p>
                      <p className="text-sm font-black text-rose-500">{formatCurrency(Math.max(finance.totalEstimatedFee - finance.totalPaid, 0))}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Hình thức</p>
                      <p className="text-[10px] font-black text-amber-500 uppercase">
                        {caseData.payment_mode === 'step_by_step' ? 'Theo giai đoạn' : 'Trọn gói'}
                      </p>
                    </div>
                    <HiOutlineCreditCard className="h-5 w-5 text-white/20" />
                  </div>

                  {caseData.payment_mode === 'lump_sum' && (finance.totalEstimatedFee - finance.totalPaid) > 0 && (
                    <button
                      onClick={() => handleStepPayment({ id: 'all', fee_amount: finance.totalEstimatedFee - finance.totalPaid, step_name: 'Tất cả các bước' })}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-[#041837] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-amber-500/10"
                    >
                      Thanh toán trọn gói
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Document List Card */}
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#041837]">Hồ sơ tài liệu ({documents.length})</h3>
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <HiOutlineBriefcase className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                {documents.map(doc => {
                  const fileName = doc.file_name || String(doc.file_path).split(/[\\/]/).pop();
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center font-black text-[9px] text-blue-600 shadow-sm uppercase shrink-0">
                          {getFileIcon(doc.file_type, fileName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#041837] truncate uppercase tracking-tight">{fileName}</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase mt-1 tracking-widest">{new Date(doc.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}
                          className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                        >
                          <HiX className="h-4 w-4" />
                        </button>
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}/uploads/${doc.file_path?.split(/[\\/]/).pop()}`}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm"
                        >
                          <HiDownload className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full mt-6 py-4 rounded-2xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                <HiPlus className="h-4 w-4" />
                Tải lên tài liệu mới
              </button>
            </div>
          </aside >
        </div >

        {/* Upload Modal */}
        {
          showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041837]/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white">
                  <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Cung cấp tài liệu hồ sơ</h3>
                  <button onClick={() => setShowUploadModal(false)} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                    <HiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleFileUpload} className="p-10 space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Chọn tệp tin (Tối đa 10MB)</label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-100 rounded-[32px] cursor-pointer hover:bg-slate-50/50 hover:border-blue-500/30 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <HiOutlineDocument className="w-10 h-10 text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">
                          {uploadData.files.length > 0 ? `${uploadData.files.length} tệp đã chọn` : 'Nhấp để chọn tài liệu'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => setUploadData({ ...uploadData, files: Array.from(e.target.files) })}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Danh mục</label>
                      <select
                        value={uploadData.category}
                        onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-[#041837] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="original">Bản gốc</option>
                        <option value="copy">Bản sao</option>
                        <option value="evidence">Chứng cứ</option>
                        <option value="contract">Hợp đồng</option>
                        <option value="other">Loại khác</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={uploading || !uploadData.files.length}
                        className="w-full h-14 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[#041837] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {uploading ? (
                          <div className="h-4 w-4 border-2 border-[#041837]/30 border-t-[#041837] rounded-full animate-spin" />
                        ) : (
                          <HiPlus className="h-4 w-4" />
                        )}
                        {uploading ? 'Đang tải lên...' : 'Xác nhận gửi'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Ghi chú (Không bắt buộc)</label>
                    <textarea
                      rows={2}
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      placeholder="Mô tả tóm tắt về loại tài liệu bạn cung cấp..."
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] text-sm font-medium text-[#041837] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                    />
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div >
      {isStepDetailOpen && (
        <CaseStepDetailModal
          step={selectedStep}
          caseData={caseData}
          onUpdateCase={fetchCaseDetail}
          onClose={() => setIsStepDetailOpen(false)}
        />
      )}
      {/* Edit Intake Modal */}
      {
        isEditIntakeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041837]/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white">
                <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Cập nhật hồ sơ tư liệu</h3>
                <button
                  onClick={() => setIsEditIntakeOpen(false)}
                  className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <HiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveIntake} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đã nhận thông báo chưa?</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setEditIntakeData({ ...editIntakeData, receivedNotice: true })}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border-2 ${editIntakeData.receivedNotice ? 'bg-[#041837] text-white border-[#041837]' : 'bg-slate-50 text-slate-400 border-slate-50'}`}
                      >
                        ĐÃ NHẬN
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditIntakeData({ ...editIntakeData, receivedNotice: false })}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border-2 ${!editIntakeData.receivedNotice ? 'bg-[#041837] text-white border-[#041837]' : 'bg-slate-50 text-slate-400 border-slate-50'}`}
                      >
                        CHƯA NHẬN
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại thông báo (nếu có)</label>
                    <input
                      type="text"
                      value={editIntakeData.noticeType}
                      onChange={(e) => setEditIntakeData({ ...editIntakeData, noticeType: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-xs font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none"
                      placeholder="VD: Quyết định truy thu thuế..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tóm tắt nội dung vụ việc</label>
                  <textarea
                    rows={5}
                    value={editIntakeData.summary}
                    onChange={(e) => setEditIntakeData({ ...editIntakeData, summary: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-50 text-xs font-bold text-[#041837] focus:border-amber-500 focus:bg-white transition-all outline-none resize-none"
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditIntakeOpen(false)}
                    className="flex-1 py-5 rounded-2xl bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-[2] py-5 rounded-2xl bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 shadow-xl shadow-blue-900/20"
                  >
                    {updating ? 'ĐANG CẬP NHẬT...' : 'LƯU THÔNG TIN HỒ SƠ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </DashboardLayout >
  );
};

export default CaseDetail;
