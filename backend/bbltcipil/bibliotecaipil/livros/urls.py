from django.urls import path
# from rest_framework.routers import DefaultRouter
from .views import LivroAPIView, AutorAPIView, CategoriaAPIView

urlpatterns = [
    path('livros/', LivroAPIView.as_view()),
    path('autores/', AutorAPIView.as_view()),
    path('categorias/', CategoriaAPIView.as_view()),
]
