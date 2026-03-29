// utils/permissoes.js

export function podeGerir(user) {
  const userData = user?.user;

  return (
    userData?.is_superuser ||
    userData?.grupos?.includes("Admin")
  );
}