import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useauth";
import Loading from "../../layout/motion/motion";

/**
 * Protege rotas por roles e permissões
 * @param {ReactNode} children
 * @param {Array<string>} allowedRoles
 * @param {boolean} apenasAdmin - restringe apenas para Admin/SuperUser
 */

export function RoleRoute({ children, allowedRoles = [], apenasAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  const userData = user?.user;
 
  const userRoles = userData?.grupos || [];
  const isSuperUser = userData?.is_superuser;
  const isAdmin = userRoles.includes("Admin");

  // 🔥 Superuser sempre passa
  if (isSuperUser) return children;

  // 🔥 Regra crítica (novo)
  if (apenasAdmin && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 🔥 Regra padrão (já tinhas)
  if (allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasAccess) return <Navigate to="/" replace />;
  }

  return children;
}