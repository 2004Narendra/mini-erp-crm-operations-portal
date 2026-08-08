import { apiClient } from './apiClient';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<{ token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/login', { email, password });
    return response;
  },
};
