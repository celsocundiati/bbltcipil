// ==========================
// 🔹 AuthContext.jsx
// ==========================
import { useState, useEffect, createContext, useContext } from "react";
import api from "../../service/api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Busca usuário autenticado
  const fetchUser = async () => {
    try {
      const res = await api.get("/accounts/me/"); // usa token ou cookie
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verifica autenticação ao iniciar app
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Login
  const login = async (n_identificacao, password) => {
    setLoading(true);
    try {
      await api.post("/accounts/login/", { n_identificacao, password });
      await fetchUser();
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/accounts/logout/", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro no logout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook para acessar contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};