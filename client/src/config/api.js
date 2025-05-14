import axios from 'axios';

// Konfigurasi base URL berdasarkan environment
const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://central-computers-production.up.railway.app' // URL Railway
  : 'http://localhost:5001';

// Membuat instance axios dengan konfigurasi
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Untuk mengirim cookie jika dibutuhkan
});

// Interceptor untuk menghandle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error disini (misalnya untuk autentikasi)
    if (error.response && error.response.status === 401) {
      // Redirect ke halaman login atau refresh token
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 