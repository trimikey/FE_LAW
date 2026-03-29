import { toggleUserStatusApi } from "../api/admin.api";

export const toggleUserStatus = async (userId, isActive) => {
  await toggleUserStatusApi(userId, isActive);
};
