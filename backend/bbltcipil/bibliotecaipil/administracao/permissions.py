from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Admin").exists()


class IsBibliotecario(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Bibliotecario").exists()
    