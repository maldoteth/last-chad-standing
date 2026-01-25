import axios, { AxiosRequestConfig } from "axios";
export const APIURL = 'https://api.lastchadstanding.site'
// export const APIURL = 'http://localhost:4000';
export const baseURL = `${APIURL}/api/`;

export const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Priority: Use Admin Token if available, otherwise regular token
    const adminToken = localStorage.getItem('admin_token');
    const token = localStorage.getItem('token');

    const finalToken = adminToken || token;

    if (finalToken) {
      config.headers['Authorization'] = `Bearer ${finalToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);