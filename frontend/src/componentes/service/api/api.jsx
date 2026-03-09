import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000, // timeout de 10s
});

api.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      sessionStorage.removeItem("access_token");

      window.location.href = "/login"; // redireciona sem hooks
    }

    return Promise.reject(error);
  }

);

export default api;