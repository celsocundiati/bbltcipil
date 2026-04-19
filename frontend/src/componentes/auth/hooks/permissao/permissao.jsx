import { useAuth } from "../../userAuth/useauth";

export function usePermission() {
    const { user } = useAuth();

    const roles = user?.user?.grupos || [];
    const isSuperuser = user?.user?.is_superuser;

    const hasRole = (allowedRoles = []) => {
        if (isSuperuser) return true;

        return allowedRoles.some(role => roles.includes(role));
    };

    return {
        hasRole,
        isSuperuser
    };
}