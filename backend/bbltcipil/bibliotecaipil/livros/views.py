from rest_framework.generics import ListCreateAPIView
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno
from .serializers import LivroSerializer, AutorSerializer, CategoriaSerializer, ReservaSerializer, EmprestimoSerializer, AlunoSerializer

class LivroAPIView(ListCreateAPIView):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer

class AutorAPIView(ListCreateAPIView):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

class CategoriaAPIView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class RerservaAPIView(ListCreateAPIView):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

class EmprestimoAPIView(ListCreateAPIView):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer

class AlunoAPIView(ListCreateAPIView):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer