import axios from "axios";

const secureAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useSecureAxios = () => {
  secureAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage or other storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return secureAxios;
};
