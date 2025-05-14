import axios from 'axios';

// Define available backend URLs
const BACKEND_URLS = {
  render: 'https://central-computers-backend.onrender.com/api',  // Update with your Render URL when available
  railway: 'https://central-computers.up.railway.app/api',
  local: 'http://localhost:5001/api'
};

// Konfigurasi base URL berdasarkan environment
const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return BACKEND_URLS.render; // Use Render in production
  }
  return BACKEND_URLS.local; // Use local in development
};

// Membuat instance axios dengan konfigurasi
const api = axios.create({
  baseURL: getBackendUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true, // Untuk mengirim cookie
  timeout: 15000, // 15 second timeout for slower serverless cold starts
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
    // Network error handling
    if (!error.response) {
      console.error('Network error - please check your connection');
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    // Server error handling
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Authentication required - redirecting to login');
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
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          // Handle other errors
          console.error('An error occurred:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 