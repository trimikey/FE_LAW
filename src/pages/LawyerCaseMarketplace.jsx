import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const LawyerCaseMarketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    caseType: '',
    priority: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });
  const [selectedCase, setSelectedCase] = useState(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestForm, setInterestForm] = useState({
    message: '',
    proposedFee: '',
    estimatedDuration: ''
  });

  useEffect(() => {
    fetchCases();
  }, [filters.search, filters.caseType, filters.priority, filters.page]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        limit: filters.limit
      });
      if (filters.search) params.append('search', filters.search);
      if (filters.caseType) params.append('caseType', filters.caseType);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/marketplace/cases/available?${params}`);
      setCases(response.data.data.cases);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Không thể tải danh sách vụ việc');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    try {
      await api.post(`/marketplace/cases/${selectedCase.id}/interest`, interestForm);
      toast.success('Đã gửi quan tâm đến vụ việc thành công');
      setShowInterestModal(false);
      setSelectedCase(null);
      setInterestForm({ message: '', proposedFee: '', estimatedDuration: '' });
      fetchCases();
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi quan tâm');
    }
  };

  const handleWithdrawInterest = async (caseId) => {
    if (!confirm('Bạn có chắc muốn rút lại quan tâm?')) return;

    try {
      await api.delete(`/marketplace/cases/${caseId}/interest`);
      toast.success('Đã rút lại quan tâm');
      fetchCases();
    } catch (error) {
      console.error('Error withdrawing interest:', error);
      toast.error('Lỗi khi rút lại quan tâm');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      in_progress: 'Đang xử lý',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority) => {
    const texts = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao',
      urgent: 'Khẩn cấp'
    };
    return texts[priority] || priority;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Marketplace - Tìm Vụ Việc</h1>
          <p className="text-slate-600">Khám phá các vụ việc phù hợp với chuyên môn của bạn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
          <form onSubmit={(e) => { e.preventDefault(); setFilters({ ...filters, page: 1 }); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  placeholder="Tiêu đề, mô tả..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại vụ việc</label>
                <select
                  value={filters.caseType}
                  onChange={(e) => setFilters({ ...filters, caseType: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="consultation">Tư vấn</option>
                  <option value="contract">Hợp đồng</option>
                  <option value="dispute">Tranh chấp</option>
                  <option value="corporate">Doanh nghiệp</option>
                  <option value="labor">Lao động</option>
                  <option value="tax">Thuế</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ưu tiên</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy vụ việc nào
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cases.map((caseItem) => (
                <div key={caseItem.id} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{caseItem.title}</h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">{caseItem.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(caseItem.status)}`}>
                          {getStatusText(caseItem.status)}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(caseItem.priority)}`}>
                          {getPriorityText(caseItem.priority)}
                        </span>
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                          📋 {caseItem.case_type}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <span>👤</span>
                          <span className="font-medium">Khách hàng:</span> {caseItem.client?.full_name}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <span>📅</span>
                          <span className="font-medium">Ngày tạo:</span> {new Date(caseItem.created_at).toLocaleDateString('vi-VN')}
                        </p>
                        {caseItem.interestCount > 0 && (
                          <p className="text-blue-700 font-semibold flex items-center gap-2">
                            <span>⭐</span>
                            {caseItem.interestCount} luật sư đã quan tâm
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    {caseItem.hasInterest ? (
                      <button
                        onClick={() => handleWithdrawInterest(caseItem.id)}
                        className="px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
                      >
                        Rút lại quan tâm
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedCase(caseItem);
                          setShowInterestModal(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                      >
                        ⭐ Quan tâm vụ việc này
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/cases/${caseItem.id}`)}
                      className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2">
                  Trang {filters.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page >= pagination.totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}

        {/* Interest Modal */}
        {showInterestModal && selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Gửi quan tâm đến vụ việc</h2>
              <p className="text-gray-600 mb-4">{selectedCase.title}</p>
              <form onSubmit={handleExpressInterest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lời nhắn (tùy chọn)
                  </label>
                  <textarea
                    value={interestForm.message}
                    onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                    rows={4}
                    placeholder="Giới thiệu về bạn, kinh nghiệm, cách bạn sẽ xử lý vụ việc..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phí đề xuất (VNĐ) - Tùy chọn
                  </label>
                  <input
                    type="number"
                    value={interestForm.proposedFee}
                    onChange={(e) => setInterestForm({ ...interestForm, proposedFee: e.target.value })}
                    placeholder="Ví dụ: 5000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian ước tính (ngày) - Tùy chọn
                  </label>
                  <input
                    type="number"
                    value={interestForm.estimatedDuration}
                    onChange={(e) => setInterestForm({ ...interestForm, estimatedDuration: e.target.value })}
                    placeholder="Ví dụ: 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Gửi quan tâm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInterestModal(false);
                      setSelectedCase(null);
                      setInterestForm({ message: '', proposedFee: '', estimatedDuration: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerCaseMarketplace;
