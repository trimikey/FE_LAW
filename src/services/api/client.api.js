import api from "../api";

export const getClientDashboardStats = () =>
  api.get('/client/dashboard/stats');

export const getMyCases = (limit = 5) =>
  api.get(`/client/cases?limit=${limit}`);

export const getMyConsultations = (limit = 5) =>
  api.get(`/client/consultations?limit=${limit}`);

export const searchLawyers = (search = '') =>
  api.get(`/client/lawyers/search?search=${search}&limit=10`);

export const createCase = (data) =>
  api.post('/client/cases', data);

export const bookConsultation = (data) =>
  api.post('/client/consultations/book', data);
