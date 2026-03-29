import { updateUserApi } from "../api/admin.api";

export const updateUser = async (userId, payload) => {
  await updateUserApi(userId, payload);
};
