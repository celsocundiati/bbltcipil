import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center">Carregando...</div>; // opcional: spinner

  if (!user) return <Navigate to="/login" replace />; // redireciona se não logado

  return children;
}