from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from livros.models import Reserva, Emprestimo, Aluno, Autor, Categoria, Livro
from .serializers import (
    ReservaAdminSerializer,
    EmprestimoAdminSerializer,
    AlunoAdminSerializer,
    AutorAdminSerializer,
    CategoriaAdminSerializer,
    LivroAdminSerializer
)

class LivroAdminViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroAdminSerializer
    permission_classes = [IsAdminUser]

class ReservaAdminViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaAdminSerializer
    permission_classes = [IsAdminUser]

class EmprestimoAdminViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoAdminSerializer
    permission_classes = [IsAdminUser]


class AlunoAdminViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoAdminSerializer
    permission_classes = [IsAdminUser]


class AutorAdminViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorAdminSerializer
    permission_classes = [IsAdminUser]


class CategoriaAdminViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaAdminSerializer
    permission_classes = [IsAdminUser]
