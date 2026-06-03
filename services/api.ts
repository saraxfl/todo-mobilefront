import axios from "axios";
import { getToken } from "./authService";

const api = axios.create({
  baseURL: "https://todo-backend-4c3m.onrender.com",
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {

    const token = await getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  }
);

export default api;