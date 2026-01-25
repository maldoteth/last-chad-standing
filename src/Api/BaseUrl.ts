import axios, { AxiosRequestConfig } from "axios";

// export const baseURL = 'http://localhost:5122/api/';
//https://standing-chad-backend.vercel.app
export const baseURL = 'http://localhost:4100';
// 

export const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    const token = localStorage.getItem('token');

    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);