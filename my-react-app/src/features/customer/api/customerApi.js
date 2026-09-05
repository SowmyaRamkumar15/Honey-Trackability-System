import apiClient from '../../../services/axios'

export const customerApi = {
  getProfile: () => apiClient.get('/api/customers/profile'),
  createProfile: (data) => apiClient.post('/api/customers/profile', data),
  updateProfile: (data) => apiClient.put('/api/customers/profile', data),
  getProfileStatus: () => apiClient.get('/api/customers/profile/status'),
}

export default customerApi
