import { verifyLawyerApi } from '../api/admin.api';

export const verifyLawyer = async (lawyerId, status) => {
  await verifyLawyerApi(lawyerId, status);
};
