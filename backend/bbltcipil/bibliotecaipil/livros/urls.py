from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, AutorViewSet, AlunoViewSet, LivroViewSet, ReservaViewSet, EmprestimoViewSet, RegistarAlunoViewSet

router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'emprestimos', EmprestimoViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'cadastros', RegistarAlunoViewSet, basename='cadastro')

urlpatterns = [
    path('', include(router.urls)),
]