import axios, { AxiosRequestConfig } from "axios";
export const APIURL = 'https://api.lastchadstanding.site'
// export const APIURL = 'http://localhost:4000';
export const baseURL = `${APIURL}/api/`;

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