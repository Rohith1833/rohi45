import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Unexpected API error';

    return Promise.reject(new Error(message));
  }
);

export const api = {
  getHealth: async () => {
    const response = await axios.get('/health');
    return response.data;
  },

  getTickets: async () => {
    const response = await apiClient.get('/tickets');
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },

  analyzeMessage: async (message) => {
    const response = await apiClient.post('/analyze', { message });
    return response.data;
  },

  updateTicket: async (id, payload) => {
    const response = await apiClient.put(`/tickets/${id}`, payload);
    return response.data;
  },

  resolveTicket: async (id) => {
    const response = await apiClient.post(`/tickets/${id}/resolve`);
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await apiClient.delete(`/tickets/${id}`);
    return response.data;
  },
};

export default apiClient;
