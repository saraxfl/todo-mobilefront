import api from "./api";

export const validateTokenWithBackend = async () => {
  const response = await api.get("/auth");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/auth/user");
  return response.data;
};