import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const SelectLawyer = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [caseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interestsRes, caseRes] = await Promise.all([
        api.get(`/marketplace/cases/${caseId}/interests`),
        api.get(`/cases/${caseId}`)
      ]);
      setInterests(interestsRes.data.data.interests);
      setCaseData(caseRes.data.data.case);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLawyer = async () => {
    if (!selectedInterest) return;

    try {
      await api.post(`/marketplace/cases/${caseId}/select-lawyer`, {
        interestId: selectedInterest.id
      });
      toast.success('Đã chọn luật sư thành công!');
      navigate(`/cases/${caseId}`);
    } catch (error) {
      console.error('Error selecting lawyer:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi chọn luật sư');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/cases/${caseId}`)}
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại vụ việc
        </button>

        {caseData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{caseData.title}</h1>
            <p className="text-slate-600 text-lg leading-relaxed">{caseData.description}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">⚖️</span>
            Luật Sư Quan Tâm
            <span className="ml-2 px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-lg font-semibold">
              {interests.length}
            </span>
          </h2>

          {interests.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <div className="text-6xl mb-4">⚖️</div>
              <p className="text-slate-600 font-medium text-lg mb-2">Chưa có luật sư nào quan tâm vụ việc này</p>
              <p className="text-sm text-slate-400">Vui lòng đợi luật sư gửi quan tâm hoặc tìm luật sư trong marketplace</p>
            </div>
          ) : (
            <div className="space-y-6">
              {interests.map((interest) => {
                const lawyer = interest.lawyer;
                const lawyerInfo = lawyer.lawyer;
                const specialties = lawyerInfo?.specialties 
                  ? JSON.parse(lawyerInfo.specialties || '[]') 
                  : [];

                return (
                  <div
                    key={interest.id}
                    className={`border-2 rounded-2xl p-8 transition-all ${
                      selectedInterest?.id === interest.id
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                        : 'border-slate-200 hover:border-blue-300 bg-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            {lawyer.full_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">
                              {lawyer.full_name}
                            </h3>
                            {lawyerInfo?.law_firm && (
                              <p className="text-slate-600 font-medium">{lawyerInfo.law_firm}</p>
                            )}
                          </div>
                        </div>
                        {lawyerInfo?.years_of_experience && (
                          <p className="text-sm text-slate-600 mb-3 flex items-center gap-2">
                            <span>⭐</span>
                            <span className="font-semibold">Kinh nghiệm:</span> {lawyerInfo.years_of_experience} năm
                          </p>
                        )}
                        {specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {specialties.map((spec, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                        {lawyerInfo?.bio && (
                          <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                            <p className="text-sm text-slate-700 leading-relaxed">{lawyerInfo.bio}</p>
                          </div>
                        )}
                        {interest.message && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
                            <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              <span>💬</span>
                              Lời nhắn:
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed">{interest.message}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {interest.proposed_fee && (
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                              <p className="text-xs font-semibold text-emerald-700 mb-1">💰 Phí đề xuất</p>
                              <p className="text-lg font-bold text-emerald-900">
                                {Number(interest.proposed_fee).toLocaleString('vi-VN')} VNĐ
                              </p>
                            </div>
                          )}
                          {interest.estimated_duration && (
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                              <p className="text-xs font-semibold text-amber-700 mb-1">⏱️ Thời gian ước tính</p>
                              <p className="text-lg font-bold text-amber-900">
                                {interest.estimated_duration} ngày
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                          <span>📅</span>
                          Gửi quan tâm: {new Date(interest.created_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setSelectedInterest(interest);
                          setShowConfirmModal(true);
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                      >
                        ✅ Chọn luật sư này
                      </button>
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all"
                      >
                        📧 Liên hệ
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && selectedInterest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚖️</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Xác nhận chọn luật sư</h2>
                <p className="text-slate-600 mb-4">
                  Bạn có chắc muốn chọn <strong className="text-blue-700">{selectedInterest.lawyer.full_name}</strong> làm luật sư cho vụ việc này?
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    ⚠️ Sau khi chọn, các luật sư khác sẽ được thông báo rằng vụ việc đã có luật sư.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSelectLawyer}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  ✅ Xác nhận
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedInterest(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectLawyer;
