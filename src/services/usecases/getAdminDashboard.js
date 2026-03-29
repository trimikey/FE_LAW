import { fetchAdminStats, fetchPendingLawyers, fetchRecentUsers, fetchReviews } from "../api/admin.api";

export const getAdminDashboard = async () => {
  const [statsRes, usersRes, lawyersRes, reviewsRes] = await Promise.all([
    fetchAdminStats(),
    fetchRecentUsers({ limit: 20 }),
    fetchPendingLawyers(),
    fetchReviews(),
  ]);

  return {
    stats: statsRes.data.data,
    users: usersRes.data.data.users,
    pendingLawyers: lawyersRes.data.data.lawyers,
    reviews: reviewsRes.data.data.reviews,
  };
};
