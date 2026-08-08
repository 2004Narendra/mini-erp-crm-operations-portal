import { apiClient } from './apiClient';

export const customerService = {
  list: (search = '') => apiClient.get<any>(`/customers?search=${encodeURIComponent(search)}`),
  get: (id: string) => apiClient.get<any>(`/customers/${id}`),
  create: (body: unknown) => apiClient.post<any>('/customers', body),
  update: (id: string, body: unknown) => apiClient.put<any>(`/customers/${id}`, body),
  addFollowUp: (id: string, note: string) => apiClient.post<any>(`/customers/${id}/follow-up`, { note }),
};
