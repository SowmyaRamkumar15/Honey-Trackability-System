import apiClient from '../../../services/axios'

export const disputeApi = {
  createDispute: (data) => apiClient.post('/api/disputes', data),
  getMyDisputes: (params) => apiClient.get('/api/disputes/my', { params }),
  getDisputeById: (id) => apiClient.get(`/api/disputes/${id}`),
}

export default disputeApi
