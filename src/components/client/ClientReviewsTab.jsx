import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiStar, HiUser, HiChatAlt, HiClock } from 'react-icons/hi';
import { resolveAvatarUrl } from '../../utils/avatar';
import defaultAvatar from '../../assets/default_lawyer_avatar.png';

const ClientReviewsTab = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get('/client/reviews');
            if (res.data.success) {
                setReviews(res.data.data.reviews);
            }
        } catch (error) {
            console.error('Fetch reviews error:', error);
            toast.error('Lỗi khi tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-black text-[#041837] uppercase tracking-tight">Đánh giá của bạn</h2>
                <p className="text-slate-400 text-sm font-medium">Xem lại tất cả các phản hồi và đánh giá bạn đã gửi cho đội ngũ luật sư</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full flex py-32 items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="col-span-full py-40 text-center flex flex-col items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                            <HiStar size={40} className="text-slate-200" />
                        </div>
                        <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Bạn chưa gửi đánh giá nào</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-[24px] overflow-hidden border-2 border-slate-50 shadow-lg group-hover:scale-110 transition-transform">
                                        {review.lawyerUser?.avatar ? (
                                            <img src={resolveAvatarUrl(review.lawyerUser.avatar)} className="h-full w-full object-cover" />
                                        ) : (
                                            <img src={defaultAvatar} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-[#041837] uppercase truncate max-w-[150px]">{review.lawyerUser?.full_name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Luật sư tư vấn</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                                    <span className="text-lg font-black text-amber-600">{review.rating}</span>
                                    <HiStar className="text-amber-500" size={18} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[100px] relative">
                                    <HiChatAlt className="absolute top-4 right-4 text-slate-100 h-8 w-8" />
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic relative z-10">
                                        "{review.comment || 'Không có nhận xét chi tiết.'}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 pt-2">
                                    <div className="flex items-center gap-2">
                                        <HiClock />
                                        <span>Gửi ngày: {new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    {review.is_hidden && (
                                        <span className="text-rose-500">Đã ẩn bởi Admin</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientReviewsTab;
