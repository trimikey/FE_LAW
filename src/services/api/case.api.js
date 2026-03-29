import api from '../api';

export const getMyCases = (params) =>
  api.get('/client/cases', { params });

export const createCase = (data) =>
  api.post('/client/cases', data);
