import { usePermission } from "../permissao/permissao";

// function Permissao({ roles = [], children, fallback = null }) {
//     const { hasRole } = usePermission();

//     if (!hasRole(roles)) {
//         return fallback;
//     }

//     return children;
// }

// export default Permissao;



function Permissao({ roles = [], condition = true, children, fallback = null }) {
    const { hasRole } = usePermission();

    // 1. bloqueio por condição
    if (!condition) return fallback;

    // 2. bloqueio por role
    if (!hasRole(roles)) return fallback;

    return children;
}

export default Permissao;