from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReservaAdminViewSet,
    EmprestimoAdminViewSet,
    AutorAdminViewSet,
    CategoriaAdminViewSet,
    LivroAdminViewSet,
    AuditLogViewSet,
    AlunoOficialAdminViewSet,
    FuncionarioOficialAdminViewSet,
    PerfilAdminViewSet
)

router = DefaultRouter()
router.register(r'reservas', ReservaAdminViewSet, basename='reserva-admin')
router.register(r'emprestimos', EmprestimoAdminViewSet, basename='emprestimo-admin')
router.register(r'autores', AutorAdminViewSet, basename='autor-admin')
router.register(r'categorias', CategoriaAdminViewSet, basename='categoria-admin')
router.register(r'livros', LivroAdminViewSet, basename='livro-admin')
router.register(r'auditlog', AuditLogViewSet, basename='audit-admin')
router.register(r'alunosoficiais', AlunoOficialAdminViewSet, basename='alunosoficiais-admin')
router.register(r'funcionarios', FuncionarioOficialAdminViewSet, basename='funcionario')
router.register(r'perfil', PerfilAdminViewSet, basename='perfil-admin')

urlpatterns = [
    path('', include(router.urls)),
]
