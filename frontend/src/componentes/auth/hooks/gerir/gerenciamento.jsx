import { usePermission } from "../permissao/permissao";

function Permissao({ roles = [], children, fallback = null }) {
    const { hasRole } = usePermission();

    if (!hasRole(roles)) {
        return fallback;
    }

    return children;
}

export default Permissao;