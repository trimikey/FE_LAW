import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { resolveAvatarUrl } from "../../utils/avatar";
import defaultAvatar from "../../assets/default_lawyer_avatar.png";

const LawyerCard = ({ lawyer }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRegister = () => {
    navigate(`/lawyer/${lawyer.id}`);
  };

  // Parse specialites
  let specialtiesText = "Chưa cập nhật";
  if (lawyer.specialties) {
    try {
      const parsed = typeof lawyer.specialties === 'string' ? JSON.parse(lawyer.specialties) : lawyer.specialties;
      specialtiesText = Array.isArray(parsed) ? parsed.join(", ") : parsed;
    } catch (e) {
      specialtiesText = lawyer.specialties;
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">

      {/* Left Column: Avatar & Social */}
      <div className="md:w-64 bg-gray-50 p-6 flex flex-row md:flex-col items-center justify-around md:justify-center border-b md:border-b-0 md:border-r border-gray-100">
        <div className="relative mb-4">
          {/* Pro Badge (Mock) */}
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded shadow z-10 text-yellow-900 border border-yellow-200">
            PRO
          </span>
          {lawyer.user?.avatar ? (
            <img
              src={resolveAvatarUrl(lawyer.user.avatar)}
              alt={lawyer.user?.full_name}
              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
          ) : (
            <img src={defaultAvatar} alt="" className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform" />
          )}
        </div>

        {/* Social Icons Mock */}
        <div className="flex gap-3 mt-2">
          <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs cursor-pointer hover:bg-blue-700">f</span>
          <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs cursor-pointer hover:bg-red-700">G+</span>
          <span className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs cursor-pointer hover:bg-blue-500">in</span>
        </div>
      </div>

      {/* Middle Column: Info */}
      <div className="flex-1 p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">LUẬT SƯ / CÔNG TY LUẬT</p>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 hover:text-blue-700 transition">
              <Link to={`/lawyer/${lawyer.id}`}>{lawyer.user?.full_name?.toUpperCase()}</Link>
            </h3>
          </div>
          {/* Price Badge */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dịch vụ tư vấn</span>
            <span className="bg-emerald-50 text-emerald-700 text-sm px-4 py-1.5 rounded-xl font-black border border-emerald-100 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {lawyer.consultation_fee > 0 ? `${Number(lawyer.consultation_fee).toLocaleString('vi-VN')}đ` : 'Thoả thuận'}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-600">
          <p className="line-clamp-2"><span className="font-semibold text-gray-900">Lĩnh vực:</span> {specialtiesText}</p>
          <p><span className="font-semibold text-gray-900">Đoàn luật sư:</span> {lawyer.city || 'TP. Hồ Chí Minh'} (Tạm tính)</p>
          <p><span className="font-semibold text-gray-900">Trường đào tạo:</span> {lawyer.education || 'Học viện Tư pháp'}</p>
          <p><span className="font-semibold text-gray-900">Kinh nghiệm:</span> <span className="text-blue-700 font-bold">{lawyer.years_of_experience || 1} năm</span></p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap gap-2">
          <Link to={`/lawyer/${lawyer.id}`} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded hover:bg-gray-50 transition uppercase">
            Xem Chi Tiết
          </Link>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-yellow-500 text-white text-sm font-bold rounded hover:bg-yellow-600 transition uppercase shadow-md hover:shadow-lg">
            Nhắn tin với Luật sư
          </button>
        </div>
      </div>

      {/* Right Column: Contact & Rate */}
      <div className="md:w-64 bg-gray-50 border-1 border-gray-100 p-6 flex flex-col justify-start space-y-4 text-sm">

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-lg">📍</span>
            <span className="text-gray-600 text-xs">{lawyer.law_firm || 'Văn phòng luật sư'} <br /> {lawyer.address || 'Quận 1, TPHCM'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📞</span>
            <span className="text-gray-600 font-medium">{lawyer.user?.phone || '0987654321'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✉️</span>
            <span className="text-gray-600 truncate max-w-[150px]">{lawyer.user?.email}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <a href="#" className="block w-full text-center py-2 border border-red-500 text-red-500 font-semibold rounded hover:bg-red-50 transition uppercase text-xs mb-3">
            Xem Website
          </a>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Đánh giá:</span>
            <div className="flex text-yellow-400 text-sm">
              ★★★★★ <span className="text-gray-400 text-xs ml-1">(5.0)</span>
            </div>
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{lawyer.review_count || 12} bình luận</p>
        </div>
      </div>

    </div>
  );
};

export default LawyerCard;
