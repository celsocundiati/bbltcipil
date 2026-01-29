from rest_framework.generics import ListCreateAPIView
from .models import Livro, Autor, Categoria
from .serializers import LivroSerializer, AutorSerializer, CategoriaSerializer

class LivroAPIView(ListCreateAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer

class AutorAPIView(ListCreateAPIView):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

class CategoriaAPIView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


