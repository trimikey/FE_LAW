import { useState, useCallback, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const INITIAL_CASE = {
  title: '',
  description: '',
  caseType: 'consultation',
  priority: 'medium',
  estimatedFee: ''
};

const INITIAL_CONSULTATION = {
  scheduledAt: '',
  duration: 60,
  consultationType: 'video',
  fee: ''
};

export const useClientDashboard = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Initialize from URL param, fallback to overview
  const currentTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTabState] = useState(currentTab);

  // Sync state when URL changes (e.g. browser back button)
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    if (tab !== activeTab) {
      setActiveTabState(tab);
    }
  }, [searchParams]);

  // Wrapper to update both state and URL
  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    setSearchParams({ tab: newTab });
  };

  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [showCreateCase, setShowCreateCase] = useState(false);
  const [showBookConsultation, setShowBookConsultation] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const [newCase, setNewCase] = useState(INITIAL_CASE);
  const [newConsultation, setNewConsultation] = useState(INITIAL_CONSULTATION);

  const loadDashboard = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [statsRes, casesRes, consultationsRes, conversationsRes] = await Promise.all([
        api.get('/client/dashboard/stats'),
        api.get('/client/cases?limit=5'),
        api.get('/client/consultations?limit=5'),
        api.get('/messages/conversations')
      ]);

      setStats(statsRes.data.data);
      setCases(casesRes.data.data.cases);
      setConsultations(consultationsRes.data.data.consultations);

      const nextConversations = conversationsRes.data.data || [];
      setConversations(nextConversations);
      setUnreadMessages(nextConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0));
    } catch {
      toast.error('Lỗi khi tải dữ liệu dashboard');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const attachAvailabilityToLawyers = async (lawyerList = []) => {
    const enriched = await Promise.all(
      lawyerList.map(async (lawyer) => {
        try {
          const lawyerUserId = Number(lawyer?.user_id || lawyer?.id || 0);
          if (!lawyerUserId) return { ...lawyer, availableSlots: [] };
          const res = await api.get(`/client/lawyers/${lawyerUserId}/availability`);
          return { ...lawyer, availableSlots: res.data.data || [] };
        } catch {
          return { ...lawyer, availableSlots: [] };
        }
      })
    );
    return enriched;
  };

  const searchLawyers = async (keyword = '') => {
    try {
      const res = await api.get(`/client/lawyers/search?search=${keyword}&limit=10`);
      const enrichedLawyers = await attachAvailabilityToLawyers(res.data.data.lawyers || []);
      setLawyers(enrichedLawyers);
    } catch {
      toast.error('Lỗi khi tìm kiếm luật sư');
    }
  };

  const createCase = async () => {
    await api.post('/client/cases', newCase);
    toast.success('Tạo vụ việc thanh cong');
    setShowCreateCase(false);
    setNewCase(INITIAL_CASE);
    loadDashboard();
  };

  const bookConsultation = async () => {
    if (!selectedLawyer) return toast.error('Vui long chon luật sư');

    await api.post('/client/consultations/book', {
      ...newConsultation,
      lawyerId: selectedLawyer.id
    });

    toast.success('Dat lich tu van thanh cong');
    setShowBookConsultation(false);
    setSelectedLawyer(null);
    setNewConsultation(INITIAL_CONSULTATION);
    loadDashboard();
  };

  const bookConsultationFromSlot = async (slot) => {
    try {
      await api.post('/client/consultations/book-from-slot', { slotId: slot.id });
      toast.success('Dat lich tu khung gio trong thanh cong');
      setShowBookConsultation(false);
      setSelectedLawyer(null);
      setNewConsultation(INITIAL_CONSULTATION);
      await loadDashboard();
      await searchLawyers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Dat lich that bai');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboard(false);
      if (activeTab === 'lawyers') {
        searchLawyers();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [loadDashboard, activeTab]);

  return {
    loading,
    activeTab,
    setActiveTab,

    stats,
    cases,
    consultations,
    lawyers,
    conversations,
    unreadMessages,
    missedCallsCount: (consultations || []).filter(c => c.status === 'no_show').length,

    showCreateCase,
    setShowCreateCase,
    showBookConsultation,
    setShowBookConsultation,

    selectedLawyer,
    setSelectedLawyer,

    newCase,
    setNewCase,
    newConsultation,
    setNewConsultation,

    searchLawyers,
    createCase,
    deleteCase: async (caseId) => {
      try {
        await api.delete(`/client/cases/${caseId}`);
        toast.success('Xóa vụ việc thành công');
        loadDashboard();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa vụ việc');
      }
    },
    archiveCase: async (caseId) => {
      try {
        await api.patch(`/client/cases/${caseId}/archive`);
        toast.success('Đã lưu trữ vụ việc');
        loadDashboard();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi lưu trữ vụ việc');
      }
    },
    restoreCase: async (caseId) => {
      try {
        await api.patch(`/client/cases/${caseId}/restore`);
        toast.success('Đã khôi phục vụ việc');
        loadDashboard();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi khôi phục vụ việc');
      }
    },
    bookConsultation,
    bookConsultationFromSlot,
    refreshDashboard: loadDashboard
  };
};
