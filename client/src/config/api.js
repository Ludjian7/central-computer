import axios from 'axios';

// Konfigurasi base URL berdasarkan environment
const baseURL = process.env.NODE_ENV === 'production'
  ? '/api'  // Use relative path in production
  : 'http://localhost:5001/api';

// Membuat instance axios dengan konfigurasi
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Untuk mengirim cookie
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show access denied message
          console.error('Access denied');
          break;
        case 404:
          // Not found - show not found message
          console.error('Resource not found');
          break;
        case 405:
          // Method not allowed - show error message
          console.error('Method not allowed');
          break;
        default:
          // Handle other errors
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 