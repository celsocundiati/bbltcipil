from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAdminUser
from .models import AuditLog, AlunoOficial
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from livros.models import Reserva, Emprestimo, Aluno, Autor, Categoria, Livro
from .serializers import (
    ReservaAdminSerializer,
    EmprestimoAdminSerializer,
    AlunoAdminSerializer,
    AutorAdminSerializer,
    CategoriaAdminSerializer,
    LivroAdminSerializer,
    AuditLogSerializer,
    AlunoOficialAdminSerializer
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


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Logs de auditoria — somente admins logados.
    """
    queryset = AuditLog.objects.all().order_by('-criado_em')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        acao = self.request.query_params.get('acao')
        modelo = self.request.query_params.get('modelo')

        if search:
            queryset = queryset.filter(usuario__username__icontains=search)
        if acao:
            queryset = queryset.filter(acao=acao)
        if modelo:
            queryset = queryset.filter(modelo=modelo)
        return queryset
    

class AlunoOficialAdminViewSet(viewsets.ModelViewSet):
    queryset = AlunoOficial.objects.all()
    serializer_class = AlunoOficialAdminSerializer
    permission_classes = [IsAdminUser]

