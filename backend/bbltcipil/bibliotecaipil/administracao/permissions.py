from rest_framework import permissions
from rest_framework.permissions import BasePermission

# =========================
# 🔹 HELPERS (ROLES)
# =========================

def is_superuser(user):
    return user and user.is_authenticated and user.is_superuser


def is_admin(user):
    return user and user.is_authenticated and user.groups.filter(name="Admin").exists()


def is_bibliotecario(user):
    return user and user.is_authenticated and user.groups.filter(name="Bibliotecario").exists()



# =========================
# 🔥 PERMISSÃO PRINCIPAL
# =========================

class SistemaPermission(permissions.BasePermission):
    """
    Controle global baseado em roles:
    - Superuser: tudo
    - Admin: quase tudo (exceto logs)
    - Bibliotecário: acesso limitado
    """

    def has_permission(self, request, view):

        user = request.user

        if not user or not user.is_authenticated:
            return False

        # 👑 SUPERUSER → acesso total
        if is_superuser(user):
            return True

        # 🧑‍💼 ADMIN (GRUPO)
        if is_admin(user):
            return self.admin_permissions(request, view)

        # 📚 BIBLIOTECÁRIO
        if is_bibliotecario(user):
            return self.bibliotecario_permissions(request, view)

        return False


    # =========================
    # 🔹 ADMIN RULES
    # =========================
    def admin_permissions(self, request, view):

        # 🚫 Logs são altamente sensíveis → apenas superuser
        if view.basename == "audit-admin":
            return False

        # ✔ Admin pode tudo no resto
        return True


    # =========================
    # 🔹 BIBLIOTECÁRIO RULES
    # =========================
    def bibliotecario_permissions(self, request, view):

        method = request.method
        resource = view.basename

        # 🔹 leitura geral permitida
        if method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # =========================
        # 📌 RESERVAS
        # =========================
        if resource == "reserva":
            return True  # pode criar, aprovar, cancelar, etc.

        # =========================
        # 📦 EMPRÉSTIMOS
        # =========================
        if resource == "emprestimo":
            return True

        # =========================
        # 📚 LIVROS / AUTORES / CATEGORIAS
        # =========================
        if resource in ["livro", "autor", "categoria"]:
            # opcional: bloquear delete
            if method == "DELETE":
                return False
            if method in ["PUT", "PATCH"]:
                return False
            return True

        # =========================
        # 💰 MULTAS → SOMENTE LEITURA
        # =========================
        if resource == "multa":
            return False  # já passou GET acima

        # =========================
        # ⚙️ CONFIGURAÇÕES → SOMENTE LEITURA
        # =========================
        if resource == "configuracao":
            return False

        # =========================
        # 📊 LOGS → PROIBIDO
        # =========================
        if resource == "audit-admin":
            return False

        return False


# =========================
# 🔐 PERMISSÃO EXCLUSIVA
# =========================

class OnlySuperUser(permissions.BasePermission):
    """
    Apenas superuser pode acessar (logs, auditoria sensível, etc)
    """

    def has_permission(self, request, view):
        return is_superuser(request.user)