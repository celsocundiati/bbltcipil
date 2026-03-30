import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useauth";
import Loading from "../../layout/motion/motion";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // if (loading) return <div className="text-center">Carregando...</div>;

  if (loading) return <Loading />;
  

  if (!user) return <Navigate to="/login" replace />;

  return children;
}