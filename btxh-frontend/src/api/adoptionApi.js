import axiosClient from './axiosClient';

const adoptionApi = {
  getAll: (params) => axiosClient.get('/adoptions', { params }),
  getById: (id) => axiosClient.get(`/adoptions/${id}`),
  create: (data) => axiosClient.post('/adoptions', data),
  update: (id, data) => axiosClient.put(`/adoptions/${id}`, data),
  approve: (id) => axiosClient.patch(`/adoptions/${id}/approve`),
  reject: (id, reason) => axiosClient.patch(`/adoptions/${id}/reject`, { reason }),
  uploadDocument: (id, formData) =>
    axiosClient.post(`/adoptions/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default adoptionApi;
