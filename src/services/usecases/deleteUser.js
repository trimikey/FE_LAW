import { deleteUserApi } from "../api/admin.api";

export const deleteUser = async (userId) => {
  await deleteUserApi(userId);
};
