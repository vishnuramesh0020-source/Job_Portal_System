import axios from 'axios';

// Create an Axios instance for API communications
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // mock/placeholder base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth credentials or tokens if present
api.interceptors.request.use(
  (config) => {
    const userSession = localStorage.getItem('job_portal_auth_user');
    if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        console.error('Error parsing auth token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('job_portal_auth_user');
    }
    return Promise.reject(error);
  }
);

export default api;
