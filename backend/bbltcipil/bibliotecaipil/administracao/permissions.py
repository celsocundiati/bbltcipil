# from rest_framework import permissions
# from rest_framework.permissions import BasePermission

# # =========================
# # 🔹 HELPERS (ROLES)
# # =========================

# def is_superuser(user):
#     return user and user.is_authenticated and user.is_superuser


# def is_admin(user):
#     return user and user.is_authenticated and user.groups.filter(name="Admin").exists()


# def is_bibliotecario(user):
#     return user and user.is_authenticated and user.groups.filter(name="Bibliotecario").exists()



# # =========================
# # 🔥 PERMISSÃO PRINCIPAL
# # =========================

# class SistemaPermission(permissions.BasePermission):
#     """
#     Controle global baseado em roles:
#     - Superuser: tudo
#     - Admin: quase tudo (exceto logs)
#     - Bibliotecário: acesso limitado
#     """

#     def has_permission(self, request, view):

#         user = request.user

#         if not user or not user.is_authenticated:
#             return False

#         # 👑 SUPERUSER → acesso total
#         if is_superuser(user):
#             return True

#         # 🧑‍💼 ADMIN (GRUPO)
#         if is_admin(user):
#             return self.admin_permissions(request, view)

#         # 📚 BIBLIOTECÁRIO
#         if is_bibliotecario(user):
#             return self.bibliotecario_permissions(request, view)

#         return False


#     # =========================
#     # 🔹 ADMIN RULES
#     # =========================
#     def admin_permissions(self, request, view):

#         # 🚫 Logs são altamente sensíveis → apenas superuser
#         if view.basename == "audit-admin":
#             return False

#         # ✔ Admin pode tudo no resto
#         return True


#     # =========================
#     # 🔹 BIBLIOTECÁRIO RULES
#     # =========================
#     # def bibliotecario_permissions(self, request, view):

#     #     method = request.method
#     #     resource = view.basename

#     #     # 🔹 leitura geral permitida
#     #     if method in ["GET", "HEAD", "OPTIONS"]:
#     #         return True

#     #     # =========================
#     #     # 📌 RESERVAS
#     #     # =========================
#     #     if resource == "reserva":
#     #         return True  # pode criar, aprovar, cancelar, etc.

#     #     # =========================
#     #     # 📦 EMPRÉSTIMOS
#     #     # =========================
#     #     if resource == "emprestimo":
#     #         return True

#     #     # =========================
#     #     # 📚 LIVROS / AUTORES / CATEGORIAS
#     #     # =========================
#     #     if resource in ["livro", "autor", "categoria"]:
#     #         return False

#     #     # =========================
#     #     # 💰 MULTAS → SOMENTE LEITURA
#     #     # =========================
#     #     if resource == "multa":
#     #         return False  # já passou GET acima

#     #     # =========================
#     #     # ⚙️ CONFIGURAÇÕES → SOMENTE LEITURA
#     #     # =========================
#     #     if resource == "configuracao":
#     #         return False

#     #     # =========================
#     #     # 📊 LOGS → PROIBIDO
#     #     # =========================
#     #     if resource == "audit-admin":
#     #         return False

#     #     return False
#     def bibliotecario_permissions(self, request, view):

#         method = request.method
#         resource = view.basename

#         # 🔹 leitura geral permitida
#         if method in ["GET", "HEAD", "OPTIONS"]:
#             return True

#         # =========================
#         # 📌 RESERVAS
#         # =========================
#         if "reserva" in resource:
#             return True

#         # =========================
#         # 📦 EMPRÉSTIMOS
#         # =========================
#         if "emprestimo" in resource:
#             return True

#         # =========================
#         # 📚 LIVROS / AUTORES / CATEGORIAS → BLOQUEADO
#         # =========================
#         if any(r in resource for r in ["livro", "autor", "categoria"]):
#             return False

#         # =========================
#         # 💰 MULTAS → SOMENTE LEITURA
#         # =========================
#         if "multa" in resource:
#             return False

#         # =========================
#         # ⚙️ CONFIGURAÇÕES → SOMENTE LEITURA
#         # =========================
#         if "configuracao" in resource:
#             return False

#         # =========================
#         # 📊 LOGS → PROIBIDO
#         # =========================
#         if "audit" in resource:
#             return False

#         return False

# # =========================
# # 🔐 PERMISSÃO EXCLUSIVA
# # =========================

# class OnlySuperUser(permissions.BasePermission):
#     """
#     Apenas superuser pode acessar (logs, auditoria sensível, etc)
#     """

#     def has_permission(self, request, view):
#         return is_superuser(request.user)
    




from rest_framework import permissions


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
    - Admin: gestão operacional + gestão limitada de usuários
    - Bibliotecário: execução (reservas/empréstimos) + leitura
    """

    def has_permission(self, request, view):

        user = request.user

        if not user or not user.is_authenticated:
            return False

        # 👑 SUPERUSER → acesso total
        if is_superuser(user):
            return True

        # 🧑‍💼 ADMIN
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

        action = getattr(view, "action", None)
        resource = view.basename

        # 🚫 LOGS → apenas superuser
        if resource == "audit-admin":
            return False

        # =========================
        # 👤 USUÁRIOS ADMIN
        # =========================
        if resource == "user":

            # 📖 visualizar → permitido
            if action in ["list", "retrieve"]:
                return True

            # 🔼 promover → permitido (mas controlado no serializer)
            if action == "promote":
                return True

            # ❌ deletar → só superuser (bloqueado aqui)
            if action == "destroy":
                return False

            # ❌ editar direto → evitar bypass
            if action in ["update", "partial_update"]:
                return False

            return False

        # ✔ resto do sistema → permitido
        return True


    # =========================
    # 🔹 BIBLIOTECÁRIO RULES
    # =========================
    def bibliotecario_permissions(self, request, view):

        action = getattr(view, "action", None)
        resource = view.basename

        # 🔹 leitura global
        if action in ["list", "retrieve"]:
            return True

        # =========================
        # 📌 RESERVAS
        # =========================
        if resource == "reserva":
            return action in ["create", "aprovar", "finalizar", "cancelar"]

        # =========================
        # 📦 EMPRÉSTIMOS
        # =========================
        if resource == "emprestimo":
            return action in ["create", "update", "partial_update", "destroy", "devolver"]

        # =========================
        # 📚 LIVROS / AUTORES / CATEGORIAS → SOMENTE LEITURA
        # =========================
        if resource in ["livro", "autor", "categoria"]:
            return False

        # =========================
        # 💰 MULTAS → SOMENTE LEITURA
        # =========================
        if resource == "multa":
            return False

        # =========================
        # ⚙️ CONFIGURAÇÕES → BLOQUEADO
        # =========================
        if resource == "configuracao":
            return False

        # =========================
        # 📊 LOGS → PROIBIDO
        # =========================
        if resource == "audit-admin":
            return False

        # =========================
        # 👤 USUÁRIOS → SOMENTE VISUALIZAÇÃO
        # =========================
        if resource == "user":
            return action in ["list", "retrieve"]

        return False


# =========================
# 🔐 PERMISSÃO EXCLUSIVA
# =========================

class OnlySuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return is_superuser(request.user)




