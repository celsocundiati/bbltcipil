from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet, AutorViewSet, 
    AlunoViewSet, LivroViewSet, ReservaViewSet, 
    EmprestimoViewSet, NotificacaoViewSet
    )

router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'emprestimos', EmprestimoViewSet, basename='emprestimo')
router.register(r'alunos', AlunoViewSet)
router.register(r"notificacoes", NotificacaoViewSet, basename="notificacao")

urlpatterns = [
    path('', include(router.urls)),
]