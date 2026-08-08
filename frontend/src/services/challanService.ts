import { apiClient } from './apiClient';

export const challanService = {
  list: () => apiClient.get<any>('/challans'),
  get: (id: string) => apiClient.get<any>(`/challans/${id}`),
  create: (body: unknown) => apiClient.post<any>('/challans', body),
  confirm: (id: string) => apiClient.post<any>(`/challans/${id}/confirm`),
  cancel: (id: string) => apiClient.post<any>(`/challans/${id}/cancel`),
};
