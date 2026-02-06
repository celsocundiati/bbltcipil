# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import LivroAPIView, AutorAPIView, CategoriaAPIView, RerservaAPIView, EmprestimoAPIView, AlunoAPIView


# urlpatterns = [
#     path('livros/', LivroAPIView.as_view()),
#     path('autores/', AutorAPIView.as_view()),
#     path('categorias/', CategoriaAPIView.as_view()),
#     path('reservas/', RerservaAPIView.as_view()),
#     path('emprestimos/', EmprestimoAPIView.as_view()),
#     path('alunos/', AlunoAPIView.as_view()),
# ]


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, AutorViewSet, AlunoViewSet, LivroViewSet, ReservaViewSet, EmprestimoViewSet

router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'emprestimos', EmprestimoViewSet)
router.register(r'alunos', AlunoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]