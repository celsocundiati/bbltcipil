import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useauth";

/**
 * Protege rotas por roles
 * @param {ReactNode} children Componentes filhos
 * @param {Array<string>} allowedRoles Roles permitidas
 */

export function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  const userRoles = user?.user?.grupos || [];
  const isSuperUser = user?.user?.is_superuser;

  // Superuser tem acesso total
  if (isSuperUser) return children;

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) return <Navigate to="/" replace />;

  return children;
}

