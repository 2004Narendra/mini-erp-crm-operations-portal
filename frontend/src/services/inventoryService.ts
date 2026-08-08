import { apiClient } from './apiClient';

export const inventoryService = {
  list: () => apiClient.get<any>('/inventory'),
  movements: () => apiClient.get<any>('/inventory/movements'),
  lowStock: () => apiClient.get<any>('/inventory/low-stock'),
};
