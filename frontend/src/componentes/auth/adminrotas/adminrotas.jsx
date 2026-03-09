import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useAuth";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!user || user?.perfil?.tipo !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}