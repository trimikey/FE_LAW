import api from "../api";

export const getMyConsultations = () => {
  return api.get('/client/consultations/my');
};
