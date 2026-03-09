import api from "../api/api";

export const getPerfilUsuario = async () => {
  try {
    const res = await api.get("/accounts/me/");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUsuario = async () => {
  await api.post("/accounts/logout/");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};