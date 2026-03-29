// import { Navigate } from "react-router-dom";
// import { useAuth } from "../userAuth/useauth";

// /**
//  * Protege rotas por roles
//  * @param {ReactNode} children Componentes filhos
//  * @param {Array<string>} allowedRoles Roles permitidas
//  */

// export function RoleRoute({ children, allowedRoles }) {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Carregando...</div>;

//   const userRoles = user?.user?.grupos || [];
//   const isSuperUser = user?.user?.is_superuser;

//   // Superuser tem acesso total
//   if (isSuperUser) return children;

//   const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

//   if (!hasAccess) return <Navigate to="/" replace />;

//   return children;
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../userAuth/useauth";

/**
 * Protege rotas por roles e permissões
 * @param {ReactNode} children
 * @param {Array<string>} allowedRoles
 * @param {boolean} apenasAdmin - restringe apenas para Admin/SuperUser
 */

export function RoleRoute({ children, allowedRoles = [], apenasAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

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