import { apiClient } from './apiClient';

export const productService = {
  list: () => apiClient.get<any>('/products'),
  get: (id: string) => apiClient.get<any>(`/products/${id}`),
  create: (body: unknown) => apiClient.post<any>('/products', body),
  update: (id: string, body: unknown) => apiClient.put<any>(`/products/${id}`, body),
};
