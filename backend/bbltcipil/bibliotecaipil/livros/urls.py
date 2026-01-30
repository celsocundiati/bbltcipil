from django.urls import path
# from rest_framework.routers import DefaultRouter
from .views import LivroAPIView, AutorAPIView, CategoriaAPIView, RerservaAPIView, EmprestimoAPIView, AlunoAPIView

urlpatterns = [
    path('livros/', LivroAPIView.as_view()),
    path('autores/', AutorAPIView.as_view()),
    path('categorias/', CategoriaAPIView.as_view()),
    path('reservas/', RerservaAPIView.as_view()),
    path('emprestimos/', EmprestimoAPIView.as_view()),
    path('alunos/', AlunoAPIView.as_view()),
]
