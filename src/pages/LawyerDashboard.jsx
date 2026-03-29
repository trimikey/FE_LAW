import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import bannerImg from '../assets/back_gr_luat.png';
import statsLawImg from '../assets/stat_law.png';

import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { resolveAvatarUrl } from '../utils/avatar';
import { useVideoCall } from '../contexts/VideoCallContext';

import ChatBox from '../components/chat/ChatBox';
import VideoChatTab from '../components/client/VideoChatTab';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ClientDossiersTab from '../components/lawyer/ClientDossiersTab';
import LawyerCreateCaseModal from '../components/lawyer/LawyerCreateCaseModal';
import LawyerCreateClientModal from '../components/lawyer/LawyerCreateClientModal';
import MessageCenter from '../components/messages/MessageCenter';
import {
  HiBriefcase,
  HiCheckCircle,
  HiClock,
  HiCurrencyDollar,
  HiEye,
  HiPencil,
  HiPhone,
  HiTrash,
  HiUserGroup,
  HiVideoCamera,
  HiX,
  HiSearch,
  HiPlus,
  HiCalendar,
  HiDotsHorizontal,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineVideoCamera,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiStar
} from 'react-icons/hi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { startCall } = useVideoCall();
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [consultationFilter, setConsultationFilter] = useState('all');
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [clientRevenue, setClientRevenue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderPagination, setOrderPagination] = useState({ page: 1, totalPages: 1 });
  const [casesPagination, setCasesPagination] = useState({ page: 1, totalPages: 1 });
  const [consultationsPagination, setConsultationsPagination] = useState({ page: 1, totalPages: 1 });
  const [inquiries, setInquiries] = useState([]);
  const [inquiryPagination, setInquiryPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [casesLoading, setCasesLoading] = useState(false);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabFromUrl = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTabState] = useState(currentTabFromUrl);

  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    setSearchParams({ tab: newTab });
  };

  // Sync state when URL changes (e.g. browser back button)
  useEffect(() => {
    const tabUrl = searchParams.get('tab') || 'overview';
    if (tabUrl !== activeTab) {
      setActiveTabState(tabUrl);
    }
  }, [searchParams]);

  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedChatPartner, setSelectedChatPartner] = useState(null);

  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    consultationType: 'video',
    notes: ''
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editSlotForm, setEditSlotForm] = useState({
    startTime: '',
    endTime: '',
    consultationType: 'video',
    notes: ''
  });

  const [availabilitySubTab, setAvailabilitySubTab] = useState('all'); // all, booked
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkConfig, setBulkConfig] = useState({
    sessions: 1,
    duration: 60,
    buffer: 15,
    repeatDays: [], // [1,2,3,4,5,6,0] (Mon=1, Sun=0)
    weeks: 1
  });

  const [reviews, setReviews] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const isSameCalendarDay = (start, end) =>
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const getDurationMinutes = (start, end) => Math.round((end.getTime() - start.getTime()) / 60000);

  const fetchAvailability = async () => {
    try {
      const res = await api.get('/lawyer/availability');
      setAvailabilitySlots(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      setAvailabilitySlots([]);
      console.error('Availability API error:', error);
    }
  };

  const fetchCases = async (page = 1, limit = 9) => {
    try {
      setCasesLoading(true);
      const res = await api.get(`/lawyer/cases?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setCases(res.data.data.cases);
        setCasesPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách hồ sơ');
    } finally {
      setCasesLoading(false);
    }
  };

  const fetchConsultations = useCallback(async (page = 1, limit = 10) => {
    try {
      setConsultationsLoading(true);
      const url = `/lawyer/consultations?page=${page}&limit=${limit}${consultationFilter !== 'all' ? `&status=${consultationFilter}` : ''}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setConsultations(res.data.data.consultations);
        setConsultationsPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải lịch tư vấn');
    } finally {
      setConsultationsLoading(false);
    }
  }, [consultationFilter]);


  useEffect(() => {
    if (activeTab === 'consultations') {
      fetchConsultations();
    }
  }, [activeTab, consultationFilter, fetchConsultations]);

  const fetchOrders = async (page = 1, limit = 10) => {
    try {
      setOrdersLoading(true);
      const res = await api.get(`/lawyer/orders?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setOrders(res.data.data.orders);
        setOrderPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải lịch sử giao dịch');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchInquiries = async (page = 1, limit = 10) => {
    try {
      setInquiriesLoading(true);
      const res = await api.get(`/inquiries?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setInquiries(res.data.data.inquiries);
        setInquiryPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách yêu cầu tư vấn');
    } finally {
      setInquiriesLoading(false);
    }
  };

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.get('/lawyer/dashboard/stats'),
        api.get('/lawyer/cases?limit=5'),
        api.get('/lawyer/consultations?limit=5'),
        api.get('/messages/conversations'),
        api.get('/lawyer/revenue-by-client'),
        api.get('/lawyer/orders?status=completed&limit=10'),
        api.get('/inquiries'),
        api.get('/lawyer/reviews')
      ]);

      const [statsRes, casesRes, consultationsRes, conversationsRes, clientRevenueRes, ordersRes, inquiriesRes, reviewsRes] = results;

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value?.data?.data || null);
      }
      if (casesRes.status === 'fulfilled') {
        const data = casesRes.value?.data?.data;
        setCases(Array.isArray(data) ? data : data?.cases || []);
        if (data?.pagination) setCasesPagination(data.pagination);
      }
      if (consultationsRes.status === 'fulfilled') {
        const data = consultationsRes.value?.data?.data;
        setConsultations(Array.isArray(data) ? data : data?.consultations || []);
        if (data?.pagination) setConsultationsPagination(data.pagination);
      }
      if (conversationsRes.status === 'fulfilled') {
        setConversations(conversationsRes.value?.data?.data || []);
      }
      if (clientRevenueRes.status === 'fulfilled') {
        setClientRevenue(clientRevenueRes.value?.data?.data?.summaries || []);
      }
      if (ordersRes.status === 'fulfilled') {
        const data = ordersRes.value?.data?.data;
        setOrders(Array.isArray(data) ? data : data?.orders || []);
        if (data?.pagination) setOrderPagination(data.pagination);
      }
      if (inquiriesRes && inquiriesRes.status === 'fulfilled') {
        const data = inquiriesRes.value?.data?.data;
        setInquiries(Array.isArray(data) ? data : data?.inquiries || []);
        if (data?.pagination) setInquiryPagination(data.pagination);
      }
      if (reviewsRes && reviewsRes.status === 'fulfilled') {
        const data = reviewsRes.value?.data?.data;
        setReviews(data?.reviews || []);
        setReviewsSummary(data?.summary || null);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMessagesRefresh = useCallback(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await api.get('/lawyer/reviews');
      if (res.data.success) {
        setReviews(res.data.data.reviews || []);
        setReviewsSummary(res.data.data.summary || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') return undefined;

    const interval = setInterval(() => fetchDashboardData(false), 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'availability') fetchAvailability();
    if (activeTab === 'reviews') fetchReviews();
  }, [activeTab]);

  const toLocalInputValue = (dateValue) => {
    const date = new Date(dateValue);
    const tzOffsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
  };

  const getNowLocalInputValue = () => {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 16);
  };

  const getConsultationTypeIcon = (type) => {
    if (type === 'video') return HiVideoCamera;
    if (type === 'phone') return HiPhone;
    return HiUserGroup;
  };

  const handleUpdateCaseStatus = async (caseId, status) => {
    try {
      await api.patch(`/lawyer/cases/${caseId}/status`, { status });
      toast.success('Cập nhật trạng thái thành công');
      fetchDashboardData();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleCreateAvailability = async (e) => {
    e.preventDefault();

    if (!bulkMode) {
      const start = new Date(newSlot.startTime);
      const end = new Date(newSlot.endTime);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        toast.error('Khoảng thời gian không hợp lệ');
        return;
      }

      try {
        await api.post('/lawyer/availability', newSlot);
        toast.success('Tạo lịch trống thành công');
        setNewSlot({ startTime: '', endTime: '', consultationType: 'video', notes: '' });
        fetchAvailability();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Lỗi tạo lịch trống');
      }
    } else {
      // Bulk Mode Logic
      const baseStart = new Date(newSlot.startTime);
      if (Number.isNaN(baseStart.getTime())) {
        toast.error('Vui lòng chọn thời gian bắt đầu hợp lệ');
        return;
      }

      const slotsToCreate = [];
      const { sessions, duration, buffer, repeatDays, weeks } = bulkConfig;

      // For each week
      for (let w = 0; w < weeks; w++) {
        // For each day in the week
        // If repeatDays is empty, just use the selected date
        const daysToProcess = repeatDays.length > 0 ? repeatDays : [baseStart.getDay()];

        for (const dayOfWeek of daysToProcess) {
          const targetDate = new Date(baseStart);
          targetDate.setDate(baseStart.getDate() + (w * 7) + ((dayOfWeek + 7 - baseStart.getDay()) % 7));

          // Skip if today and targetDate is in the past
          if (targetDate < new Date() && targetDate.toDateString() === new Date().toDateString()) {
            // Adjust time to baseStart's hours if same day? 
            // Actually, let's keep it simple: only future dates
          }

          let currentSlotStart = new Date(targetDate);
          currentSlotStart.setHours(baseStart.getHours(), baseStart.getMinutes(), 0, 0);

          for (let s = 0; s < sessions; s++) {
            const slotEnd = new Date(currentSlotStart);
            slotEnd.setMinutes(currentSlotStart.getMinutes() + duration);

            slotsToCreate.push({
              startTime: currentSlotStart.toISOString(),
              endTime: slotEnd.toISOString(),
              consultationType: newSlot.consultationType,
              notes: newSlot.notes
            });

            // Prepare next slot in session
            currentSlotStart = new Date(slotEnd);
            currentSlotStart.setMinutes(slotEnd.getMinutes() + buffer);
          }
        }
      }

      if (slotsToCreate.length === 0) {
        toast.error('Không tìm thấy ngày phù hợp để tạo lịch');
        return;
      }

      const loadingToast = toast.loading(`Đang tạo ${slotsToCreate.length} lịch trống...`);
      try {
        // Send requests in batches or parallel
        // For simplicity and safety against rate limits, we'll do them sequentially or in small chunks
        for (const slotData of slotsToCreate) {
          await api.post('/lawyer/availability', slotData);
        }
        toast.dismiss(loadingToast);
        toast.success(`Đã tạo thành công ${slotsToCreate.length} lịch trống!`);
        fetchAvailability();
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Đã có lỗi xảy ra trong quá trình tạo hàng loạt. Một số lịch có thể đã được tạo.');
        fetchAvailability();
      }
    }
  };

  const handleOpenEditSlot = (slot) => {
    setEditingSlot(slot);
    setEditSlotForm({
      startTime: toLocalInputValue(slot.start_time),
      endTime: toLocalInputValue(slot.end_time),
      consultationType: slot.consultation_type || 'video',
      notes: slot.notes || ''
    });
  };

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    const start = new Date(editSlotForm.startTime);
    const end = new Date(editSlotForm.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      toast.error('Khoảng thời gian không hợp lệ');
      return;
    }

    if (start <= new Date()) {
      toast.error('Không thể cập nhật về quá khứ.');
      return;
    }

    if (!isSameCalendarDay(start, end)) {
      toast.error('Chỉ trong cùng một ngày.');
      return;
    }

    try {
      await api.patch(`/lawyer/availability/${editingSlot.id}`, editSlotForm);
      toast.success('Cập nhật thành công');
      setEditingSlot(null);
      fetchAvailability();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi cập nhật');
    }
  };

  const handleCancelAvailability = async (slotId) => {
    try {
      await api.delete(`/lawyer/availability/${slotId}`);
      toast.success('Đã hủy lịch trống');
      fetchAvailability();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi hủy');
    }
  };

  const handleRestoreSlot = async (slotId) => {
    try {
      await api.patch(`/lawyer/availability/${slotId}/restore`);
      toast.success('Đã mở lại lịch trống');
      fetchAvailability();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi mở lại lịch');
    }
  };

  const formatCurrency = (value) =>
    `${Number(value || 0).toLocaleString('vi-VN')}đ`;

  const formatCaseType = (value) => {
    const labels = {
      tax: 'Thuế và Kế toán',
      tax_transfer: 'Thuế chuyển nhượng',
      business: 'Kinh doanh',
      corporate: 'Doanh nghiệp SME',
      contract: 'Hợp đồng thương mại',
      labor: 'Lao động',
      dispute: 'Tranh chấp',
      consultation: 'Tư vấn pháp lý',
      video: 'Tư vấn video',
      phone: 'Gọi điện',
      in_person: 'Gặp mặt tại văn phòng',
      video_package: 'Gói video 60 phút'
    };
    return labels[value] || value || 'Khác';
  };

  const getAvailabilityStatusMeta = (status) => {
    const configs = {
      available: { label: 'Sẵn sàng', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      booked: { label: 'Đã đặt lịch', className: 'bg-blue-50 text-blue-600 border-blue-100' },
      cancelled: { label: 'Đã hủy', className: 'bg-rose-50 text-rose-600 border-rose-100' },
      missed: { label: 'Bị lỡ', className: 'bg-amber-50 text-amber-600 border-amber-100' }
    };
    return configs[status] || configs.available;
  };

  const monthlyTrend = stats?.revenue?.monthlyTrend || [];
  const currentMonthIndex = new Date().getMonth();
  const statusChartData = [
    {
      name: 'Đang thực hiện',
      value: stats?.cases?.statusBreakdown?.inProgress || 0,
      percent: stats?.cases?.statusBreakdown?.inProgressPercent || 0,
      color: '#f5b301'
    },
    {
      name: 'Đã hoàn thành',
      value: stats?.cases?.statusBreakdown?.completed || 0,
      percent: stats?.cases?.statusBreakdown?.completedPercent || 0,
      color: '#34d399'
    },
    {
      name: 'Đang chờ',
      value: stats?.cases?.statusBreakdown?.pending || 0,
      percent: stats?.cases?.statusBreakdown?.pendingPercent || 0,
      color: '#94a3b8'
    }
  ];

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  }, [conversations]);

  const missedCallsCount = useMemo(() => {
    return consultations.filter(c => c.status === 'no_show').length;
  }, [consultations]);

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      unreadMessagesCount={totalUnreadCount}
      missedCallsCount={missedCallsCount}
    >
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && stats && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Hero Banner Section */}
              <div className="relative h-[480px] w-full overflow-hidden rounded-[50px] bg-[#041837] shadow-2xl">
                <div className="absolute inset-0">
                  <img src={bannerImg} alt="Banner" className="h-full w-full object-cover opacity-30 mix-blend-overlay rotate-1 scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#041837] via-transparent to-amber-500/10" />
                  <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
                  <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-center px-16">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-12 bg-amber-500/50" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-500">Professional Lawyer Panel</span>
                  </div>
                  <h1 className="max-w-2xl text-6xl font-black leading-[1.1] tracking-tight text-white uppercase">
                    Chào mừng trở lại,<br />
                    <span className="text-amber-500 mt-2 block italic">Luật sư Hệ thống</span>
                  </h1>
                  <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-300">
                    Hệ thống đã sẵn sàng. Bạn có <span className="text-white font-black underline decoration-amber-500 decoration-2 underline-offset-4">{stats.cases?.pending || 0} hồ sơ mới</span> đang chờ phê duyệt và <span className="text-white font-black underline decoration-blue-500 decoration-2 underline-offset-4">{consultations.length} lịch hẹn</span> trong hôm nay.
                  </p>

                  <div className="mt-12 flex gap-6">
                    <button onClick={() => setActiveTab('cases')} className="group flex items-center gap-3 rounded-2xl bg-amber-500 px-8 py-5 text-sm font-black uppercase tracking-widest text-[#041837] shadow-xl transition hover:bg-white active:scale-95">
                      Quản lý vụ việc
                      <HiOutlineBriefcase className="h-5 w-5 transition group-hover:rotate-12" />
                    </button>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white backdrop-blur-xl border border-white/10">
                      <HiOutlineChartBar className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <img
                  src={statsLawImg}
                  alt="Decoration"
                  className="absolute -right-10 bottom-0 h-[520px] object-contain opacity-80 mix-blend-screen pointer-events-none hidden xl:block"
                />
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Tổng vụ việc', value: stats.cases?.total || 0, trend: `+${stats.cases?.thisMonth || 0} tháng này`, icon: HiOutlineBriefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Khách hàng', value: stats.clients?.total || 0, trend: 'Tăng trưởng 15%', icon: HiOutlineUserGroup, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Tổng doanh thu', value: formatCurrency(stats.revenue?.total || 0), trend: 'Đã trừ 15% phí', icon: HiOutlineCurrencyDollar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Lịch hẹn', value: consultations.length || 0, trend: 'Hôm nay', icon: HiOutlineClock, color: 'text-rose-600', bg: 'bg-rose-50' }
                ].map((stat, i) => (
                  <div key={i} className="group relative rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl">
                    <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-3xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                      <p className="mt-3 text-3xl font-black tracking-tight text-[#041837]">{stat.value}</p>
                      <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className={`h-1.5 w-1.5 rounded-full ${stat.color} animate-pulse`} />
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,2fr)_400px]">
                <div className="rounded-[40px] border border-white bg-white p-10 shadow-sm">
                  <div className="mb-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#041837] tracking-tight">Biểu đồ tăng trưởng</h3>
                      <p className="mt-1 text-sm text-slate-400 font-medium">Doanh thu thực tế theo từng tháng</p>
                    </div>
                    <div className="rounded-2xl bg-[#041837] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl">
                      Năm {new Date().getFullYear()}
                    </div>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrend} barCategoryGap={24}>
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }}
                          tickFormatter={(value) => `${Math.round(value / 1000000)}tr`}
                        />
                        <Tooltip
                          cursor={{ fill: '#f8fafc', radius: 12 }}
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                          formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                          labelFormatter={(label) => `Tháng ${label.replace('T', '')}`}
                        />
                        <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                          {monthlyTrend.map((entry, index) => (
                            <Cell key={entry.label} fill={index === currentMonthIndex ? '#f5b301' : '#f1f5f9'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-[40px] border border-white bg-white p-10 shadow-sm">
                  <h3 className="text-2xl font-black text-[#041837] tracking-tight">Tỉ lệ hồ sơ</h3>
                  <div className="mt-8 flex flex-col items-center">
                    <div className="relative h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusChartData}
                            dataKey="value"
                            innerRadius={75}
                            outerRadius={105}
                            paddingAngle={6}
                            stroke="none"
                          >
                            {statusChartData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-black text-[#041837]">{stats.cases?.total || 0}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng Case</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 space-y-5">
                    {statusChartData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                        <div className="flex items-center gap-4">
                          <span className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                          <span className="font-bold text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-black text-[#041837]">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="rounded-[40px] border border-white bg-white p-10 shadow-sm">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-[#041837] tracking-tight">Giao dịch gần đây</h3>
                    <p className="mt-1 text-sm text-slate-400 font-medium">Lịch sử thu phí từ các vụ việc đã hoàn thành</p>
                  </div>
                  <button className="rounded-2xl bg-amber-500/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-amber-600 transition hover:bg-amber-500 hover:text-[#041837]">Tải báo cáo</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="pb-6 pr-4 whitespace-nowrap">Khách hàng</th>
                        <th className="pb-6 pr-4 whitespace-nowrap">Nội dung</th>
                        <th className="pb-6 pr-4 whitespace-nowrap">Ngày giao dịch</th>
                        <th className="pb-6 pr-4 whitespace-nowrap">Số tiền thực nhận</th>
                        <th className="pb-6 whitespace-nowrap">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="group transition hover:bg-slate-50/50">
                          <td className="py-6 pr-4 font-bold text-[#041837]">{order.client?.full_name || 'Khách hàng ẩn'}</td>
                          <td className="py-6 pr-4 text-slate-500 font-medium">
                            <div className="text-[#041837]">{order.title}</div>
                            <div className="mt-1 text-xs text-slate-400 font-bold uppercase tracking-wider">{formatCaseType(order.caseType)}</div>
                          </td>
                          <td className="py-6 pr-4 text-slate-500 font-medium">{new Date(order.paidAt).toLocaleDateString('vi-VN')}</td>
                          <td className="py-6 pr-4 font-black text-[#041837]">
                            <div className="flex flex-col">
                              <span>{formatCurrency(order.netAmount)}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">(Gốc: {formatCurrency(order.amount)})</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {order.status === 'completed' ? 'Hoàn tất' : 'Chờ xử lý'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!orders.length && (
                        <tr><td colSpan={5} className="py-20 text-center text-sm italic text-slate-400 font-medium">Không có dữ liệu giao dịch</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Legal Management</p>
                  <h2 className="text-4xl font-black text-[#041837] tracking-tight uppercase mt-2">Quản lý hồ sơ vụ việc</h2>
                </div>
                <button onClick={() => setIsCreateCaseOpen(true)} className="flex items-center gap-3 rounded-2xl bg-[#041837] px-8 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-[#062c64] active:scale-95">
                  <HiPlus className="h-5 w-5" />
                  Tạo vụ việc mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative min-h-[400px]">
                {casesLoading && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[40px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  </div>
                )}
                {cases.map((caseItem) => {
                  const caseId = `#VV-${new Date(caseItem.created_at).getFullYear()}-${String(caseItem.id).padStart(3, '0')}`;
                  let progress = 0;
                  let statusConfig = { text: 'CHỜ PHẢN HỒI', color: 'text-orange-600', bg: 'bg-orange-50', barColor: 'bg-orange-500' };

                  if (caseItem.status === 'completed') {
                    progress = 100;
                    statusConfig = { text: 'HOÀN THÀNH', color: 'text-emerald-600', bg: 'bg-emerald-50', barColor: 'bg-emerald-500' };
                  } else if (caseItem.status === 'in_progress') {
                    progress = 65;
                    statusConfig = { text: 'ĐANG THỰC HIỆN', color: 'text-blue-600', bg: 'bg-blue-50', barColor: 'bg-blue-600' };
                  }

                  return (
                    <div
                      key={caseItem.id}
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                      className="group relative bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -z-0 transition-all group-hover:bg-amber-50 group-hover:w-40 group-hover:h-40" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <span className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest text-slate-400 border border-slate-100 uppercase">{caseId}</span>
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusConfig.bg} ${statusConfig.color}`}>{statusConfig.text}</span>
                        </div>

                        <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight mb-4 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[56px]">{caseItem.title}</h3>

                        <div className="flex items-center gap-3 mb-8">
                          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#041837] font-black text-xs uppercase border border-slate-200">
                            {caseItem.client?.full_name?.charAt(0) || 'K'}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{caseItem.client?.full_name || 'Khách hàng ẩn'}</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Tiến độ hồ sơ</span>
                            <span className="text-[#041837]">{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className={`h-full ${statusConfig.barColor} transition-all duration-1000`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{formatCaseType(caseItem.case_type)}</span>
                            <span className="text-xs font-black text-emerald-600">{formatCurrency(caseItem.estimated_fee)}</span>
                          </div>
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#041837] group-hover:text-white transition-all">
                            <HiChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!cases.length && !casesLoading && (
                  <div className="col-span-full py-40 text-center flex flex-col items-center justify-center rounded-[50px] border-2 border-dashed border-slate-100 bg-white">
                    <HiOutlineBriefcase className="h-16 w-16 text-slate-100 mb-6" />
                    <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px]">Chưa có hồ sơ vụ việc nào</p>
                  </div>
                )}
              </div>

              {/* Pagination Cases */}
              <div className="flex items-center justify-between px-10 py-8 bg-white rounded-[30px] border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {casesPagination.page} / {casesPagination.totalPages}</span>
                {casesPagination.totalPages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fetchCases(casesPagination.page - 1)}
                      disabled={casesPagination.page === 1 || casesLoading}
                      className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30 self-center"
                    >
                      <HiChevronLeft size={20} />
                    </button>
                    {[...Array(casesPagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => fetchCases(i + 1)}
                        className={`h-12 w-12 rounded-2xl text-[10px] font-black transition-all ${casesPagination.page === i + 1 ? 'bg-[#041837] text-white shadow-xl' : 'hover:bg-slate-50 text-slate-400'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => fetchCases(casesPagination.page + 1)}
                      disabled={casesPagination.page === casesPagination.totalPages || casesLoading}
                      className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30 self-center"
                    >
                      <HiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Schedule Management</p>
                  <h2 className="text-4xl font-black text-[#041837] tracking-tight uppercase mt-2">Lịch tư vấn khách hàng</h2>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'confirmed', label: 'Sắp tới' },
                    { key: 'completed', label: 'Đã xong' },
                    { key: 'pending', label: 'Đang chờ' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setConsultationFilter(tab.key)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${consultationFilter === tab.key ? 'bg-[#041837] text-white shadow-lg' : 'text-slate-400 hover:text-[#041837]'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Same premium styling for consultations table as transactions... */}
              <div className="rounded-[40px] border border-white bg-white p-10 shadow-sm overflow-hidden relative min-h-[400px]">
                {consultationsLoading && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                  </div>
                )}
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      <th className="pb-6 pr-4">Khách hàng</th>
                      <th className="pb-6 pr-4">Thời gian biểu</th>
                      <th className="pb-6 pr-4">Trạng thái</th>
                      <th className="pb-6 pr-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {consultations.map((consult) => (
                      <tr key={consult.id} className="group transition hover:bg-slate-50/50">
                        <td className="py-6 pr-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-sm text-[#041837] overflow-hidden border border-slate-200">
                              {consult.client?.avatar ? (
                                <img
                                  src={resolveAvatarUrl(consult.client.avatar)}
                                  alt={consult.client?.full_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = consult.client?.full_name?.charAt(0) || 'K';
                                  }}
                                />
                              ) : (
                                consult.client?.full_name?.charAt(0) || 'K'
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-lg font-black text-[#041837] uppercase tracking-tight group-hover:text-amber-500 transition-colors">{consult.client?.full_name || 'Khách hàng ẩn'}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{consult.client?.email || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 pr-4 min-w-[180px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black text-amber-600">{new Date(consult.scheduled_at).toLocaleDateString('vi-VN')}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">{new Date(consult.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td className="py-6 pr-4">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${consult.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                              (consult.status === 'confirmed' && new Date(consult.scheduled_at) < new Date()) ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse transition-all' :
                                consult.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                                  consult.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                              }`}>
                              <span className="h-1 w-1 rounded-full bg-current" />
                              {consult.status === 'completed' ? 'Hoàn thành' :
                                (consult.status === 'confirmed' && new Date(consult.scheduled_at) < new Date()) ? 'QUÁ HẠN / TRỄ LỊCH' :
                                  consult.status === 'confirmed' ? 'Đã xác nhận' :
                                    consult.status === 'no_show' ? 'KHÔNG ĐẾN / BỊ LỠ' :
                                      consult.status === 'pending' ? 'Chờ xử lý' : consult.status}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#041837] transition-colors">{consult.consultation_type?.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="text-right mr-4 hidden sm:block">
                              <p className="text-xs font-black text-[#041837]">{(Number(consult.fee) || 800000).toLocaleString('vi-VN')} đ</p>
                            </div>
                            <button
                              onClick={() => startCall({
                                id: consult.client_id,
                                name: consult.client?.full_name,
                                caseTitle: 'Tư vấn video trực tuyến'
                              })}
                              className="rounded-xl bg-[#041837] px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-amber-500 hover:text-[#041837] transition-all shadow-md active:scale-95"
                            >
                              Bắt đầu
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!consultations.length && !consultationsLoading && (
                      <tr>
                        <td colSpan={5} className="py-20 text-center italic text-slate-400 font-bold uppercase tracking-widest">Chưa có lịch tư vấn nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Consultations */}
                <div className="mt-8 border-t border-slate-50 pt-8 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {consultationsPagination.page} / {consultationsPagination.totalPages}</span>
                  {consultationsPagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchConsultations(consultationsPagination.page - 1)}
                        disabled={consultationsPagination.page === 1 || consultationsLoading}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                      >
                        <HiChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => fetchConsultations(consultationsPagination.page + 1)}
                        disabled={consultationsPagination.page === consultationsPagination.totalPages || consultationsLoading}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                      >
                        <HiChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Customer Leads</p>
                  <h2 className="text-4xl font-black text-[#041837] tracking-tight uppercase mt-2">Yêu cầu tư vấn & Liên hệ</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-[#041837] shadow-xl">
                  <HiUserGroup className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 relative min-h-[400px]">
                {inquiriesLoading && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                  </div>
                )}
                {inquiries.length === 0 && !inquiriesLoading ? (
                  <div className="rounded-[50px] border-2 border-dashed border-slate-100 bg-white py-40 text-center flex flex-col items-center justify-center">
                    <HiOutlineUserGroup className="h-16 w-16 text-slate-100 mb-6" />
                    <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px]">Chưa có yêu cầu tư vấn nào mới</p>
                  </div>
                ) : (
                  <div className="rounded-[40px] border border-white bg-white p-10 shadow-sm overflow-hidden">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                          <th className="pb-6 pr-4">Khách hàng</th>
                          <th className="pb-6 pr-4">Thông tin liên hệ</th>
                          <th className="pb-6 pr-4">Nội dung yêu cầu</th>
                          <th className="pb-6 pr-4">Thời gian</th>
                          <th className="pb-6">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {inquiries.map((inquiry) => (
                          <tr key={inquiry.id} className="group transition hover:bg-slate-50/50">
                            <td className="py-8 pr-4">
                              <div className="font-black text-[#041837] uppercase tracking-tight text-lg mb-1">{inquiry.full_name}</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Lead</div>
                            </td>
                            <td className="py-8 pr-4">
                              <div className="flex flex-col gap-1">
                                <div className="text-sm font-bold text-slate-600">{inquiry.email}</div>
                                <div className="text-sm font-black text-amber-600">{inquiry.phone}</div>
                              </div>
                            </td>
                            <td className="py-8 pr-4 max-w-md">
                              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{inquiry.content}"</p>
                            </td>
                            <td className="py-8 pr-4">
                              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {new Date(inquiry.created_at).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1">
                                {new Date(inquiry.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="py-8">
                              <div className="flex flex-col gap-3">
                                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider ${inquiry.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  inquiry.status === 'contacted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full bg-current ${inquiry.status === 'pending' ? 'animate-pulse' : ''}`} />
                                  {inquiry.status === 'pending' ? 'Chờ xử lý' :
                                    inquiry.status === 'contacted' ? 'Đã nhận' : 'Hoàn thành'}
                                </span>
                                {inquiry.assigned_lawyer && (
                                  <div className="text-[9px] font-bold text-slate-400 italic">
                                    Bởi: {inquiry.assigned_lawyer.full_name}
                                  </div>
                                )}

                                {inquiry.status === 'pending' ? (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await api.patch(`/inquiries/${inquiry.id}`, {
                                          status: 'contacted',
                                          lawyerId: user?.id
                                        });
                                        toast.success('Đã nhận yêu cầu tư vấn này!');
                                        fetchDashboardData();
                                      } catch (error) {
                                        toast.error('Lỗi khi nhận yêu cầu');
                                      }
                                    }}
                                    className="px-4 py-2 bg-[#041837] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 hover:text-[#041837] transition-all shadow-lg"
                                  >
                                    Tiếp nhận
                                  </button>
                                ) : inquiry.status === 'contacted' && inquiry.lawyer_id === user?.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      id={`reply-${inquiry.id}`}
                                      placeholder="Nhập nội dung đã phản hồi cho khách..."
                                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 text-[10px] font-bold outline-none focus:border-amber-400"
                                      defaultValue={inquiry.lawyer_reply || ''}
                                    />
                                    <button
                                      onClick={async () => {
                                        const replyVal = document.getElementById(`reply-${inquiry.id}`).value;
                                        try {
                                          await api.patch(`/inquiries/${inquiry.id}`, {
                                            status: 'resolved',
                                            lawyerReply: replyVal
                                          });
                                          toast.success('Đã hoàn thành xử lý yêu cầu!');
                                          fetchDashboardData();
                                        } catch (error) {
                                          toast.error('Lỗi khi cập nhật');
                                        }
                                      }}
                                      className="w-full px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg"
                                    >
                                      Hoàn thành
                                    </button>
                                  </div>
                                ) : inquiry.lawyer_reply ? (
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Của luật sư:</p>
                                    <p className="text-[10px] font-bold text-slate-600 italic">"{inquiry.lawyer_reply}"</p>
                                  </div>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination Inquiries */}
                    <div className="mt-8 border-t border-slate-50 pt-8 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {inquiryPagination.page} / {inquiryPagination.totalPages}</span>
                      {inquiryPagination.totalPages > 1 && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fetchInquiries(inquiryPagination.page - 1)}
                            disabled={inquiryPagination.page === 1 || inquiriesLoading}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                          >
                            <HiChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() => fetchInquiries(inquiryPagination.page + 1)}
                            disabled={inquiryPagination.page === inquiryPagination.totalPages || inquiriesLoading}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                          >
                            <HiChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-px w-8 bg-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Resource Management</span>
                  </div>
                  <h2 className="text-4xl font-black text-[#041837] tracking-tight uppercase">Quản lý lịch tư vấn</h2>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="px-6 py-2 text-center border-r border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng khung giờ</p>
                    <p className="text-xl font-black text-[#041837]">{availabilitySlots.length}</p>
                  </div>
                  <div className="px-6 py-2 text-center">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Cần người chọn</p>
                    <p className="text-xl font-black text-amber-500">{availabilitySlots.filter(s => s.status === 'available').length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
                <div className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform">
                    <HiOutlineCalendar className="h-32 w-32 text-[#041837]" />
                  </div>
                  <div className="relative z-10">
                    <div className="mb-10 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setBulkMode(false)}
                          className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!bulkMode ? 'bg-[#041837] text-white' : 'bg-slate-50 text-slate-400'}`}
                        >
                          Đơn lẻ
                        </button>
                        <button
                          type="button"
                          onClick={() => setBulkMode(true)}
                          className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${bulkMode ? 'bg-amber-500 text-[#041837]' : 'bg-slate-50 text-slate-400'}`}
                        >
                          Hàng loạt (X-PRO)
                        </button>
                      </div>
                      <h3 className="text-2xl font-black text-[#041837] tracking-tight uppercase mb-2">
                        {bulkMode ? 'Lập lịch hàng loạt' : 'Thiết lập khung giờ'}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        {bulkMode ? 'Tự động nhân bản lịch theo tuần' : 'Mở khóa thời gian tư vấn mới'}
                      </p>
                    </div>

                    <form onSubmit={handleCreateAvailability} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                            {bulkMode ? 'Bắt đầu từ (Ngày & Giờ)' : 'Thời gian bắt đầu'}
                          </label>
                          <input type="datetime-local" min={getNowLocalInputValue()} required value={newSlot.startTime} onChange={(e) => setNewSlot((p) => ({ ...p, startTime: e.target.value }))} className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50/50 p-5 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all" />
                        </div>

                        {!bulkMode ? (
                          <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Thời gian kết thúc</label>
                            <input type="datetime-local" min={newSlot.startTime || getNowLocalInputValue()} required value={newSlot.endTime} onChange={(e) => setNewSlot((p) => ({ ...p, endTime: e.target.value }))} className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50/50 p-5 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all" />
                          </div>
                        ) : (
                          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Số phiên</label>
                                <input type="number" min="1" max="10" value={bulkConfig.sessions} onChange={(e) => setBulkConfig(p => ({ ...p, sessions: parseInt(e.target.value) || 1 }))} className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none border-2 border-transparent focus:border-amber-400" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Độ dài (phút)</label>
                                <select value={bulkConfig.duration} onChange={(e) => setBulkConfig(p => ({ ...p, duration: parseInt(e.target.value) }))} className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none">
                                  <option value={30}>30 phút</option>
                                  <option value={60}>60 phút</option>
                                  <option value={90}>90 phút</option>
                                  <option value={120}>120 phút</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Lặp lại các thứ</label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { v: 1, l: 'T2' }, { v: 2, l: 'T3' }, { v: 3, l: 'T4' },
                                  { v: 4, l: 'T5' }, { v: 5, l: 'T6' }, { v: 6, l: 'T7' }, { v: 0, l: 'CN' }
                                ].map(day => (
                                  <button
                                    key={day.v}
                                    type="button"
                                    onClick={() => setBulkConfig(p => ({
                                      ...p,
                                      repeatDays: p.repeatDays.includes(day.v)
                                        ? p.repeatDays.filter(d => d !== day.v)
                                        : [...p.repeatDays, day.v]
                                    }))}
                                    className={`h-9 w-9 rounded-lg text-[10px] font-black transition-all ${bulkConfig.repeatDays.includes(day.v) ? 'bg-amber-500 text-[#041837] shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                  >
                                    {day.l}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Khoảng nghỉ</label>
                                <input type="number" min="0" step="5" value={bulkConfig.buffer} onChange={(e) => setBulkConfig(p => ({ ...p, buffer: parseInt(e.target.value) || 0 }))} className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Số tuần lặp</label>
                                <input type="number" min="1" max="12" value={bulkConfig.weeks} onChange={(e) => setBulkConfig(p => ({ ...p, weeks: parseInt(e.target.value) || 1 }))} className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Phương thức tư vấn</label>
                        <div className="relative">
                          <select value={newSlot.consultationType} onChange={(e) => setNewSlot((p) => ({ ...p, consultationType: e.target.value }))} className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50/50 p-5 text-sm font-black text-[#041837] focus:border-amber-500 focus:bg-white outline-none appearance-none cursor-pointer">
                            <option value="video">VIDEO CALL (DI ĐỘNG/WEB)</option>
                            <option value="phone">TƯ VẤN QUA ĐIỆN THOẠI</option>
                            <option value="in_person">GẶP MẶT TẠI VĂN PHÒNG</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                            <HiChevronRight className="h-5 w-5 text-slate-300 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="w-full rounded-[28px] bg-[#041837] py-6 text-xs font-black uppercase tracking-[0.2em] text-amber-500 shadow-2xl transition-all hover:bg-black active:scale-95 mt-4">
                        {bulkMode ? 'KÍCH HOẠT CHUỖI LỊCH' : 'KÍCH HOẠT LỊCH TRỰC'}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                      <h3 className="text-xl font-black text-[#041837] uppercase tracking-tight">Quản lý phiên trực</h3>
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button
                          onClick={() => setAvailabilitySubTab('all')}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${availabilitySubTab === 'all' ? 'bg-[#041837] text-white shadow-lg' : 'text-slate-400 hover:text-[#041837]'}`}
                        >
                          Tất cả
                        </button>
                        <button
                          onClick={() => setAvailabilitySubTab('booked')}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${availabilitySubTab === 'booked' ? 'bg-amber-500 text-[#041837] shadow-lg' : 'text-slate-400 hover:text-[#041837]'}`}
                        >
                          Đã xác nhận
                        </button>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black text-xs">
                      {availabilitySlots.filter(s => s.status !== 'cancelled' && (availabilitySubTab === 'all' || s.status === 'booked')).length}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {availabilitySlots.filter(s => s.status !== 'cancelled' && (availabilitySubTab === 'all' || s.status === 'booked')).length === 0 ? (
                      <div className="col-span-full rounded-[50px] border-2 border-dashed border-slate-100 bg-white py-40 text-center flex flex-col items-center justify-center">
                        <HiOutlineClock className="h-16 w-16 text-slate-100 mb-6" />
                        <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px]">
                          {availabilitySubTab === 'all' ? 'Hiện đang không có khung giờ nào' : 'Chưa có lịch hẹn nào được xác nhận'}
                        </p>
                      </div>
                    ) : (
                      availabilitySlots
                        .filter(s => s.status !== 'cancelled' && (availabilitySubTab === 'all' || s.status === 'booked'))
                        .map((slot) => {
                          const TypeIcon = getConsultationTypeIcon(slot.consultation_type || slot.consultationType);
                          const statusMeta = getAvailabilityStatusMeta(slot.status);
                          return (
                            <div key={slot.id} className="group relative rounded-[40px] bg-white border border-slate-50 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border-l-8 border-l-transparent hover:border-l-amber-500">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-3xl -z-0 group-hover:bg-amber-50 transition-colors" />

                              <div className="relative z-10 flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="h-14 w-14 rounded-2xl bg-[#041837] text-amber-500 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                    <TypeIcon className="h-7 w-7" />
                                  </div>
                                  <span className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${statusMeta.className}`}>
                                    {statusMeta.label}
                                  </span>
                                </div>
                                <div className="flex gap-3">
                                  {slot.status === 'missed' ? (
                                    <button
                                      onClick={() => handleRestoreSlot(slot.id)}
                                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#041837] shadow-lg hover:bg-black hover:text-amber-500 transition-all active:scale-95"
                                    >
                                      <HiClock className="h-4 w-4" />
                                      Mở lại lịch
                                    </button>
                                  ) : (
                                    <>
                                      <button onClick={() => handleOpenEditSlot(slot)} className="h-11 w-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#041837] hover:text-white transition-all"><HiPencil className="h-4 w-4" /></button>
                                      <button onClick={() => handleCancelAvailability(slot.id)} className="h-11 w-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><HiTrash className="h-4 w-4" /></button>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#041837]">Khung giờ làm việc</span>
                                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">{formatCaseType(slot.consultation_type || slot.consultationType)}</span>
                                </div>
                                <p className="text-2xl font-black text-[#041837] mb-2 tracking-tight">
                                  {new Date(slot.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="flex items-center justify-between mt-4">
                                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] bg-amber-50 px-4 py-1.5 rounded-xl w-fit">
                                    {new Date(slot.start_time).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                                  </p>
                                  {slot.status === 'booked' && (
                                    <div className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                                      <span className="text-[9px] font-black uppercase text-[#041837]">Ready to Call</span>
                                    </div>
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
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div>
                  <h2 className="text-3xl font-black text-[#041837] uppercase tracking-tight mb-2">Đánh giá khách hàng</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Uy tín là thước đo giá trị của Luật sư</p>
                </div>
                <div className="flex bg-white/50 backdrop-blur-xl border border-white p-2 rounded-[30px] shadow-sm">
                  <div className="px-6 py-3 text-center border-r border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đánh giá</p>
                    <p className="text-xl font-black text-[#041837] tracking-tight">{reviewsSummary?.averageRating || 0}<span className="text-amber-500 font-black ml-1">★</span></p>
                  </div>
                  <div className="px-6 py-3 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng lượt</p>
                    <p className="text-xl font-black text-[#041837] tracking-tight">{reviewsSummary?.totalReviews || 0}</p>
                  </div>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="h-[400px] rounded-[50px] bg-slate-50 animate-pulse" />
                  <div className="lg:col-span-2 space-y-6">
                    {[1, 2, 3].map(n => <div key={n} className="h-40 rounded-[40px] bg-slate-50 animate-pulse" />)}
                  </div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="rounded-[60px] border-2 border-dashed border-slate-100 bg-white py-40 text-center flex flex-col items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <HiStar className="h-10 w-10 text-slate-100" />
                  </div>
                  <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px]">Chưa có khách hàng nào đánh giá</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="space-y-8">
                    <div className="rounded-[50px] bg-[#041837] p-10 text-center relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-500/20 transition-all cursor-default" />
                      <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Điểm trung bình</p>
                      <h3 className="text-7xl font-black text-white mb-4 tracking-tighter">{reviewsSummary?.averageRating || 0}</h3>
                      <div className="flex justify-center gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map(star => (
                          <HiStar
                            key={star}
                            className={`h-6 w-6 ${star <= Math.round(reviewsSummary?.averageRating || 0) ? 'text-amber-500' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs font-bold px-6">Dựa trên {reviewsSummary?.totalReviews} lượt đánh giá thực tế từ khách hàng</p>
                    </div>

                    <div className="rounded-[50px] bg-white border border-slate-50 p-10 shadow-xl">
                      <h4 className="text-[10px] font-black text-[#041837] uppercase tracking-widest mb-8 border-b border-slate-50 pb-4">Phân bổ đánh giá</h4>
                      <div className="space-y-5">
                        {[5, 4, 3, 2, 1].map(score => {
                          const count = reviewsSummary?.breakdown?.[score] || 0;
                          const percent = reviewsSummary?.totalReviews ? Math.round((count / reviewsSummary.totalReviews) * 100) : 0;
                          return (
                            <div key={score} className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>{score} Sao</span>
                                <span>{count} Lượt</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="group relative rounded-[50px] bg-white border border-slate-50 p-10 shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[60px] -z-0 group-hover:bg-amber-50/50 transition-colors" />

                        <div className="flex items-start justify-between mb-8 relative z-10">
                          <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-[24px] bg-slate-100 overflow-hidden shadow-lg group-hover:-rotate-3 transition-transform border-4 border-white">
                              <img
                                src={resolveAvatarUrl(rev.clientUser?.avatar)}
                                alt={rev.clientUser?.full_name}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(rev.clientUser?.full_name || 'U'); }}
                              />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-[#041837] tracking-tight">{rev.clientUser?.full_name || 'Khách hàng ẩn danh'}</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(rev.created_at).toLocaleDateString('vi-VN', {
                                  day: '2-digit', month: '2-digit', year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <HiStar
                                key={star}
                                className={`h-5 w-5 ${star <= rev.rating ? 'text-amber-500' : 'text-slate-100'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="relative z-10 bg-slate-50/50 rounded-[30px] p-8 border border-white group-hover:bg-white transition-colors duration-500">
                          <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dossiers' && (
            <ClientDossiersTab
              onAddClient={() => setIsCreateClientOpen(true)}
              refreshKey={refreshKey}
            />
          )}

          {activeTab === 'messages' && (
            <MessageCenter onRefresh={handleMessagesRefresh} />
          )}

          {activeTab === 'video' && <VideoChatTab conversations={conversations} />}

          {activeTab === 'orders' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Financial History</p>
                  <h2 className="text-4xl font-black text-[#041837] tracking-tight uppercase mt-2">Lịch sử giao dịch</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl">
                  <HiOutlineCurrencyDollar className="h-6 w-6" />
                </div>
              </div>

              <div className="rounded-[40px] border border-white bg-white p-10 shadow-sm overflow-hidden relative min-h-[400px]">
                {ordersLoading && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="pb-6 pr-4 whitespace-nowrap">Khách hàng</th>
                        <th className="pb-6 pr-4 whitespace-nowrap">Nội dung</th>
                        <th className="pb-6 pr-4 whitespace-nowrap">Ngày giao dịch</th>
                        <th className="pb-6 pr-4 whitespace-nowrap">Số tiền thực nhận</th>
                        <th className="pb-6 whitespace-nowrap">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.map((order) => (
                        <tr key={order.id} className="group transition hover:bg-slate-50/50">
                          <td className="py-6 pr-4 font-bold text-[#041837]">{order.client?.full_name || 'Khách hàng ẩn'}</td>
                          <td className="py-6 pr-4 text-slate-500 font-medium">
                            <div className="text-[#041837]">{order.title}</div>
                            <div className="mt-1 text-xs text-slate-400 font-bold uppercase tracking-wider">{formatCaseType(order.caseType)}</div>
                          </td>
                          <td className="py-6 pr-4 text-slate-500 font-medium">{new Date(order.paidAt).toLocaleDateString('vi-VN')}</td>
                          <td className="py-6 pr-4 font-black text-[#041837]">
                            <div className="flex flex-col">
                              <span>{formatCurrency(order.netAmount)}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">(Gốc: {formatCurrency(order.amount)})</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {order.status === 'completed' ? 'Hoàn tất' : 'Chờ xử lý'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!orders.length && !ordersLoading && (
                        <tr><td colSpan={5} className="py-20 text-center text-sm italic text-slate-400 font-medium">Không có dữ liệu giao dịch</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Orders */}
                <div className="mt-8 border-t border-slate-50 pt-8 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {orderPagination.page} / {orderPagination.totalPages}</span>
                  {orderPagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchOrders(orderPagination.page - 1)}
                        disabled={orderPagination.page === 1 || ordersLoading}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                      >
                        <HiChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => fetchOrders(orderPagination.page + 1)}
                        disabled={orderPagination.page === orderPagination.totalPages || ordersLoading}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-[#041837] hover:bg-[#041837] hover:text-white transition-all disabled:opacity-30"
                      >
                        <HiChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedChatPartner && (
            <ChatBox partnerId={selectedChatPartner.id} partnerName={selectedChatPartner.name} onClose={() => setSelectedChatPartner(null)} />
          )}

          <LawyerCreateCaseModal
            isOpen={isCreateCaseOpen}
            onClose={() => setIsCreateCaseOpen(false)}
            onAddClient={() => setIsCreateClientOpen(true)}
            onSuccess={fetchDashboardData}
            cases={cases}
          />

          <LawyerCreateClientModal
            isOpen={isCreateClientOpen}
            onClose={() => setIsCreateClientOpen(false)}
            onSuccess={() => {
              fetchDashboardData();
              setRefreshKey(prev => prev + 1);
            }}
          />
        </>
      )
      }
      {/* Edit Availability Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#041837]/60 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
          <div className="w-full max-w-xl overflow-hidden rounded-[50px] bg-white shadow-2xl relative">
            <div className="bg-[#041837] p-10 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <HiCalendar size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight uppercase">Chỉnh sửa khung giờ</h3>
                <p className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Cập nhật thông tin lịch làm việc</p>
              </div>
              <button
                onClick={() => setEditingSlot(null)}
                className="absolute top-10 right-10 h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-amber-500 hover:text-[#041837] transition-all"
              >
                <HiX size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateAvailability} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bắt đầu</label>
                  <input
                    type="datetime-local"
                    required
                    value={editSlotForm.startTime}
                    onChange={(e) => setEditSlotForm(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50 p-5 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Kết thúc</label>
                  <input
                    type="datetime-local"
                    required
                    value={editSlotForm.endTime}
                    onChange={(e) => setEditSlotForm(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50 p-5 text-sm font-bold text-[#041837] focus:border-amber-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Phương thức tư vấn</label>
                <div className="relative">
                  <select
                    value={editSlotForm.consultationType}
                    onChange={(e) => setEditSlotForm(p => ({ ...p, consultationType: e.target.value }))}
                    className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50 p-5 text-sm font-black text-[#041837] focus:border-amber-500 focus:bg-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="video">VIDEO CALL (DI ĐỘNG/WEB)</option>
                    <option value="phone">TƯ VẤN QUA ĐIỆN THOẠI</option>
                    <option value="in_person">GẶP MẶT TẠI VĂN PHÒNG</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <HiChevronRight className="h-5 w-5 text-slate-300 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-[28px] bg-[#041837] py-6 text-xs font-black uppercase tracking-[0.2em] text-amber-500 shadow-2xl transition-all hover:shadow-amber-500/20 active:scale-95"
                >
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-10 rounded-[28px] bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-200 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout >
  );
};

export default LawyerDashboard;
