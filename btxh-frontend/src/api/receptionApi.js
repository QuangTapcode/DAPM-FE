import axiosClient from './axiosClient';

const receptionApi = {
  getAll: (params) => axiosClient.get('/receptions', { params }),
  getById: (id) => axiosClient.get(`/receptions/${id}`),
  create: (data) => axiosClient.post('/receptions', data),
  update: (id, data) => axiosClient.put(`/receptions/${id}`, data),
  approve: (id) => axiosClient.patch(`/receptions/${id}/approve`),
  reject: (id, reason) => axiosClient.patch(`/receptions/${id}/reject`, { reason }),
};

export default receptionApi;
