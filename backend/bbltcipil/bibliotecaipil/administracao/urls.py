from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReservaAdminViewSet,
    EmprestimoAdminViewSet,
    AlunoAdminViewSet,
    AutorAdminViewSet,
    CategoriaAdminViewSet,
    LivroAdminViewSet
)

router = DefaultRouter()
router.register(r'reservas', ReservaAdminViewSet, basename='reserva-admin')
router.register(r'emprestimos', EmprestimoAdminViewSet, basename='emprestimo-admin')
router.register(r'alunos', AlunoAdminViewSet, basename='aluno-admin')
router.register(r'autores', AutorAdminViewSet, basename='autor-admin')
router.register(r'categorias', CategoriaAdminViewSet, basename='categoria-admin')
router.register(r'livros', LivroAdminViewSet, basename='livro-admin')

urlpatterns = [
    path('', include(router.urls)),
]
