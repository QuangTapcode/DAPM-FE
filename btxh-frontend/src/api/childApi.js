import axiosClient from './axiosClient';

const childApi = {
  getAll: (params) => axiosClient.get('/children', { params }),
  getById: (id) => axiosClient.get(`/children/${id}`),
  create: (data) => axiosClient.post('/children', data),
  update: (id, data) => axiosClient.put(`/children/${id}`, data),
  delete: (id) => axiosClient.delete(`/children/${id}`),
  uploadDocument: (id, formData) =>
    axiosClient.post(`/children/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default childApi;
