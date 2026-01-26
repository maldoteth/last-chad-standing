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
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );