import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
});

// --- Перехватчики для преобразования snake_case <-> camelCase ---

apiClient.interceptors.response.use((response) => {
  if (response.data && response.headers['content-type'] === 'application/json') {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

apiClient.interceptors.request.use((config) => {
  const newConfig = { ...config };
  if (newConfig.headers['Content-Type'] === 'multipart/form-data') {
    return newConfig;
  }
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }
  return newConfig;
});

// --- Перехватчик для автоматического обновления токена ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiClient.defaults.baseURL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('accessToken', data.access);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
          
          return apiClient(originalRequest);

        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete apiClient.defaults.headers.common['Authorization'];
          window.location.href = '/login'; 
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ЭКСПОРТИРУЕМ КАК ЭКСПОРТ ПО УМОЛЧАНИЮ
export default apiClient;