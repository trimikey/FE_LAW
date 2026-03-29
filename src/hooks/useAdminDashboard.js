import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminDashboard } from '../services/usecases/getAdminDashboard';
import { verifyLawyer } from '../services/usecases/verifyLawyer';
import { toggleUserStatus } from '../services/usecases/toggleUserStatus';
import { toggleReviewVisibilityApi } from '../services/api/admin.api';
import api from '../services/api';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewPagination, setReviewPagination] = useState({ page: 1, totalPages: 1 });
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1 });
  const [lawyers, setLawyers] = useState([]);
  const [lawyerPagination, setLawyerPagination] = useState({ page: 1, totalPages: 1 });
  const [transactions, setTransactions] = useState([]);
  const [transactionPagination, setTransactionPagination] = useState({ page: 1, totalPages: 1 });
  const [inquiries, setInquiries] = useState([]);
  const [inquiryPagination, setInquiryPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [lawyersLoading, setLawyersLoading] = useState(false);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [lawyerKpi, setLawyerKpi] = useState(null);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [payoutsLoading, setPayoutsLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      setStats(res.stats);
      setPendingLawyers(res.pendingLawyers);
    } catch (e) {
      toast.error('Lỗi khi tải dữ liệu admin');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLawyer = async (lawyerId, status) => {
    try {
      await verifyLawyer(lawyerId, status);
      toast.success(
        `Luật sư đã được ${status === 'verified' ? 'duyệt' : 'từ chối'
        }`
      );
      setLawyers(prev => prev.map(l => l.id === lawyerId ? { ...l, verification_status: status } : l));
      loadDashboard();
    } catch {
      toast.error('Lỗi khi duyệt luật sư');
    }
  };

  const handleNegotiateLawyer = async (lawyerId, message) => {
    try {
      const res = await api.post(`/admin/lawyers/${lawyerId}/negotiate`, { message });
      if (res.data?.success) {
        toast.success('Email thương thảo đã được gửi thành công');
        loadDashboard();
      }
    } catch {
      toast.error('Lỗi khi gửi yêu cầu thương thảo');
    }
  };

  const handleUpdateLawyerFee = async (lawyerId, consultationFee) => {
    try {
      const res = await api.put(`/admin/lawyers/${lawyerId}/fee`, { consultationFee });
      if (res.data?.success) {
        toast.success('Mức phí đã được điều chỉnh thành công');
        setLawyers(prev => prev.map(l => l.id === lawyerId ? { ...l, consultation_fee: consultationFee } : l));
        loadDashboard();
        return true;
      }
      return false;
    } catch {
      toast.error('Lỗi khi cập nhật phí');
      return false;
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await toggleUserStatus(userId, isActive);
      toast.success(
        `Tài khoản đã được ${!isActive ? 'kích hoạt' : 'khóa'
        }`
      );
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: isActive } : u));
      loadDashboard();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleToggleReviewVisibility = async (reviewId, isHidden) => {
    try {
      await toggleReviewVisibilityApi(reviewId, !isHidden);
      toast.success(`Đã ${!isHidden ? 'ẳn' : 'hiện'} đánh giá`);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, is_hidden: !isHidden } : r));
      loadDashboard();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái đánh giá');
    }
  };

  const fetchTransactions = async (page = 1, limit = 10) => {
    try {
      setTransactionsLoading(true);
      const res = await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setTransactions(res.data.data.transactions);
        setTransactionPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách giao dịch');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchReviews = async (page = 1, limit = 10) => {
    try {
      setReviewsLoading(true);
      const res = await api.get(`/admin/reviews?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setReviews(res.data.data.reviews);
        setReviewPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setUsersLoading(true);
      const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      if (res.data?.success) {
        setUsers(res.data.data.users);
        setUserPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchLawyers = async (page = 1, limit = 10, status = '', search = '') => {
    try {
      setLawyersLoading(true);
      const res = await api.get(`/admin/lawyers?page=${page}&limit=${limit}&status=${status}&search=${search}`);
      if (res.data?.success) {
        setLawyers(res.data.data.lawyers);
        setLawyerPagination(res.data.data.pagination);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách luật sư');
    } finally {
      setLawyersLoading(false);
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

  const fetchLawyerKPI = async (month) => {
    try {
      setKpiLoading(true);
      const res = await api.get(`/admin/lawyers/kpi${month ? `?month=${month}` : ''}`);
      if (res.data?.success) {
        setLawyerKpi(res.data.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải KPI luật sư');
    } finally {
      setKpiLoading(false);
    }
  };

  const fetchPayouts = async (month) => {
    try {
      setPayoutsLoading(true);
      const res = await api.get(`/admin/payouts${month ? `?month=${month}` : ''}`);
      if (res.data?.success) {
        setPayouts(res.data.data.payouts);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách quyết toán');
    } finally {
      setPayoutsLoading(false);
    }
  };

  const handleGeneratePayouts = async (month) => {
    try {
      setPayoutsLoading(true);
      const res = await api.post('/admin/payouts/generate', { month });
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchPayouts(month);
      }
    } catch (error) {
      toast.error('Lỗi khi khởi tạo quyết toán');
    } finally {
      setPayoutsLoading(false);
    }
  };

  const handleConfirmPayout = async (payoutId, notes, month) => {
    try {
      const res = await api.put(`/admin/payouts/${payoutId}/confirm`, { notes });
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchPayouts(month);
      }
    } catch (error) {
      toast.error('Lỗi khi xác nhận thanh toán');
    }
  };

  const handleUpdateBonus = async (payoutId, bonusAmount, notes, month) => {
    try {
      const res = await api.put(`/admin/payouts/${payoutId}/bonus`, { bonusAmount, notes });
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchPayouts(month);
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật thưởng');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    stats,
    users,
    userPagination,
    usersLoading,
    lawyers,
    lawyerPagination,
    lawyersLoading,
    pendingLawyers,
    reviews,
    reviewPagination,
    reviewsLoading,
    transactions,
    transactionPagination,
    transactionsLoading,
    inquiries,
    inquiryPagination,
    inquiriesLoading,
    loading,
    handleVerifyLawyer,
    handleToggleUserStatus,
    handleToggleReviewVisibility,
    fetchTransactions,
    fetchReviews,
    fetchUsers,
    fetchLawyers,
    fetchInquiries,
    handleNegotiateLawyer,
    handleUpdateLawyerFee,
    fetchLawyerKPI,
    lawyerKpi,
    kpiLoading,
    fetchPayouts,
    handleGeneratePayouts,
    handleConfirmPayout,
    handleUpdateBonus,
    payouts,
    payoutsLoading,
  };
};
