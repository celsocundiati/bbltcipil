// import { useState, useEffect, createContext, useContext } from "react";
// import api from "../../service/api/api";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Buscar usuário autenticado
//   const fetchUser = async () => {
//     try {
//       const refreshRes = await api.post("/accounts/refresh/", {}, { withCredentials: true });
//       const access = refreshRes.data.access;

//       const res = await api.get("/accounts/me/", {
//         headers: {
//           Authorization: `Bearer ${access}`
//         }
//       });

//       setUser(res.data);

//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Carrega usuário ao iniciar aplicação
//     useEffect(() => {
//         const token = sessionStorage.getItem("access_token");
//         if (token) {
//             fetchUser();
//         } else {
//             setLoading(false); // sem token, apenas define loading como false
//             setUser(null);
//         }
//     }, []);

//   // Login
//   const login = async (n_identificacao, password) => {

//     try {

//       const res = await api.post("/accounts/login/", {
//         n_identificacao,
//         password
//       });

//       sessionStorage.setItem("access_token", res.data.access);
//       sessionStorage.setItem("refresh_token", res.data.refresh);

//       await fetchUser();

//     } catch (error) {

//       throw error;

//     }
//   };

//   // Logout
//  const logout = async () => {
//     // 1️⃣ Notifica o backend para invalidar o token (sessão)
//     await api.post("/accounts/logout/");

//     // 2️⃣ Remove os tokens do frontend
//     sessionStorage.removeItem("access_token");
//     sessionStorage.removeItem("refresh_token");

//     // 3️⃣ Limpa o estado do usuário no contexto
//     setUser(null);

//     // 4️⃣ Redireciona para a página de login
//     // window.location.href = "/login";
//  };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         login,
//         logout,
//         loading
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // Hook para usar o contexto
// export const useAuth = () => {

//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth deve ser usado dentro de AuthProvider");
//   }

//   return context;
// };









import { useState, useEffect, createContext, useContext } from "react";
import api from "../../service/api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Busca usuário autenticado
  const fetchUser = async () => {
    try {
      const res = await api.get("/accounts/me/"); // usa access temporário do interceptor
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verifica autenticação ao iniciar app (só se cookie existir)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
      } catch {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 🔹 Login
  const login = async (n_identificacao, password) => {
    setLoading(true);
    try {
      await api.post("/accounts/login/", { n_identificacao, password });
      await fetchUser(); // atualiza estado do usuário
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
    } catch (error) {
      console.log("Erro no logout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};