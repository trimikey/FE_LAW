import api from '../api';

export const fetchAdminStats = () =>
  api.get('/admin/dashboard/stats');

export const fetchRecentUsers = (params) =>
  api.get('/admin/users', { params });

export const fetchPendingLawyers = () =>
  api.get('/admin/lawyers/pending');

export const verifyLawyerApi = (lawyerId, status) =>
  api.patch(`/admin/lawyers/${lawyerId}/verify`, { status });

export const toggleUserStatusApi = (userId, isActive) =>
  api.patch(`/admin/users/${userId}/status`, {
    isActive: !isActive,
  });

export const fetchReviews = () =>
  api.get('/admin/reviews');

export const toggleReviewVisibilityApi = (reviewId, isHidden) =>
  api.patch(`/admin/reviews/${reviewId}/visibility`, { isHidden });
