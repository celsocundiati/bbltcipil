from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro
from accounts.models import AlunoOficial, FuncionarioOficial, Perfil
from .models import AuditLog
from .serializers import (
    ReservaAdminSerializer,
    EmprestimoAdminSerializer,
    AutorAdminSerializer,
    CategoriaAdminSerializer,
    LivroAdminSerializer,
    AuditLogSerializer,
    AlunoOficialAdminSerializer,
    FuncionarioOficialAdminSerializer,
    PerfilAdminSerializer
)
from .audit_service import AuditService

User = get_user_model()


# -----------------------------
# LIVRO
# -----------------------------
class LivroAdminViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        livro = serializer.save()
        AuditService.log(user=self.request.user, action="Adicionou", instance=livro, extra={"titulo": livro.titulo})

    def perform_update(self, serializer):
        livro = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=livro, extra={"titulo": livro.titulo})

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance, extra={"titulo": instance.titulo})
        instance.delete()


# -----------------------------
# RESERVA
# -----------------------------
class ReservaAdminViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        reserva = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=reserva,
                         extra={"livro": reserva.livro.titulo, "estado": reserva.estado, "data_reserva": str(reserva.data_reserva)})

    def perform_update(self, serializer):
        reserva = serializer.save()
        acao = "Aprovou" if reserva.estado == "reservado" else "Cancelou"
        AuditService.log(user=self.request.user, action=acao, instance=reserva,
                         extra={"livro": reserva.livro.titulo, "estado": reserva.estado, "data_reserva": str(reserva.data_reserva)})

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Cancelou", instance=instance,
                         extra={"livro": instance.livro.titulo, "estado": instance.estado})
        instance.delete()


# -----------------------------
# EMPRÉSTIMO
# -----------------------------
class EmprestimoAdminViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        emprestimo = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=emprestimo,
                         extra={"livro": emprestimo.reserva.livro.titulo,
                                "aluno": emprestimo.reserva.usuario.username,
                                "data_devolucao": str(emprestimo.data_devolucao),
                                "estado": emprestimo.acoes})

    def perform_update(self, serializer):
        emprestimo = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=emprestimo,
                         extra={"livro": emprestimo.reserva.livro.titulo,
                                "aluno": emprestimo.reserva.usuario.username,
                                "data_devolucao": str(emprestimo.data_devolucao),
                                "estado": emprestimo.acoes})

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Cancelou", instance=instance,
                         extra={"livro": instance.reserva.livro.titulo,
                                "aluno": instance.reserva.usuario.username})
        instance.delete()


# -----------------------------
# AUTOR
# -----------------------------
class AutorAdminViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        autor = serializer.save()
        AuditService.log(user=self.request.user, action="Adicionou", instance=autor)

    def perform_update(self, serializer):
        autor = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=autor)

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance)
        instance.delete()


# -----------------------------
# CATEGORIA
# -----------------------------
class CategoriaAdminViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        categoria = serializer.save()
        AuditService.log(user=self.request.user, action="Adicionou", instance=categoria)

    def perform_update(self, serializer):
        categoria = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=categoria)

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance)
        instance.delete()


# -----------------------------
# ALUNO OFICIAL
# -----------------------------
class AlunoOficialAdminViewSet(viewsets.ModelViewSet):
    queryset = AlunoOficial.objects.all()
    serializer_class = AlunoOficialAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        aluno = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=aluno)

    def perform_update(self, serializer):
        aluno = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=aluno)

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance)
        instance.delete()


# -----------------------------
# FUNCIONÁRIO OFICIAL
# -----------------------------
class FuncionarioOficialAdminViewSet(viewsets.ModelViewSet):
    queryset = FuncionarioOficial.objects.all()
    serializer_class = FuncionarioOficialAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        funcionario = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=funcionario)

    def perform_update(self, serializer):
        funcionario = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=funcionario)

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance)
        instance.delete()


# -----------------------------
# PERFIL UNIFICADO (ALUNO + FUNCIONÁRIO)
# -----------------------------
class PerfilAdminViewSet(viewsets.ModelViewSet):
    """
    ViewSet unificado para perfis de Aluno e Funcionário.
    Permite filtros, pesquisa e ordenação por dados oficiais.
    """
    queryset = Perfil.objects.select_related('aluno_oficial', 'funcionario_oficial', 'user').all()
    serializer_class = PerfilAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'estado']
    search_fields = [
        'user__username',
        'telefone',
        'aluno_oficial__nome_completo',
        'aluno_oficial__n_processo',
        'funcionario_oficial__nome',
        'funcionario_oficial__n_agente',
        'funcionario_oficial__cargo'
    ]
    ordering_fields = ['user__username', 'n_reservas', 'n_emprestimos']
    ordering = ['user__username']


# -----------------------------
# AUDIT LOG (READ ONLY) COM PESQUISA
# -----------------------------
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Permite pesquisa por usuário, ação e modelo.
    """
    queryset = AuditLog.objects.all().order_by('-criado_em')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['acao', 'modelo']
    search_fields = ['usuario__username']
    ordering_fields = ['criado_em', 'usuario__username', 'acao']
    ordering = ['-criado_em']

