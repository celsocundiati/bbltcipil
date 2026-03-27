import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useauth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center">Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}