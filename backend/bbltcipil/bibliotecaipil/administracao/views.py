from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from livros.models import Reserva, Emprestimo, Aluno, Autor, Categoria, Livro
from .models import AuditLog, AlunoOficial
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
from .audit_service import AuditService

# -----------------------------
# LIVRO
# -----------------------------
class LivroAdminViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroAdminSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        livro = serializer.save()
        AuditService.log(
            user=self.request.user,
            action="Adicionou",
            instance=livro,
            extra={"titulo": livro.titulo}
        )

    def perform_update(self, serializer):
        livro = serializer.save()
        AuditService.log(
            user=self.request.user,
            action="Atualizou",
            instance=livro,
            extra={"titulo": livro.titulo}
        )

    def perform_destroy(self, instance):
        AuditService.log(
            user=self.request.user,
            action="Removeu",
            instance=instance,
            extra={"titulo": instance.titulo}
        )
        instance.delete()

# -----------------------------
# RESERVA
# -----------------------------
class ReservaAdminViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaAdminSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        reserva = serializer.save()
        AuditService.log(
            user=self.request.user,
            action="Criou",
            instance=reserva,
            extra={
                "livro": reserva.livro.titulo,
                "estado": reserva.estado,
                "data_reserva": str(reserva.data_reserva)
            }
        )

    def perform_update(self, serializer):
        reserva = serializer.save()
        estado_antigo = getattr(reserva, "_estado_antigo", None)
        acao = "Aprovou" if reserva.estado == "reservado" else "Cancelou"
        AuditService.log(
            user=self.request.user,
            action=acao,
            instance=reserva,
            extra={
                "livro": reserva.livro.titulo,
                "estado": reserva.estado,
                "data_reserva": str(reserva.data_reserva)
            }
        )

    def perform_destroy(self, instance):
        AuditService.log(
            user=self.request.user,
            action="Cancelou",
            instance=instance,
            extra={
                "livro": instance.livro.titulo,
                "estado": instance.estado
            }
        )
        instance.delete()

# -----------------------------
# EMPRÉSTIMO
# -----------------------------
class EmprestimoAdminViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoAdminSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        emprestimo = serializer.save()
        AuditService.log(
            user=self.request.user,
            action="Criou",
            instance=emprestimo,
            extra={
                "livro": emprestimo.reserva.livro.titulo,
                "aluno": emprestimo.reserva.aluno.user.username,
                "data_devolucao": str(emprestimo.data_devolucao),
                "estado": emprestimo.acoes
            }
        )

    def perform_update(self, serializer):
        emprestimo = serializer.save()
        AuditService.log(
            user=self.request.user,
            action="Atualizou",
            instance=emprestimo,
            extra={
                "livro": emprestimo.reserva.livro.titulo,
                "aluno": emprestimo.reserva.aluno.user.username,
                "data_devolucao": str(emprestimo.data_devolucao),
                "estado": emprestimo.acoes
            }
        )

    def perform_destroy(self, instance):
        AuditService.log(
            user=self.request.user,
            action="Cancelou",
            instance=instance,
            extra={
                "livro": instance.reserva.livro.titulo,
                "aluno": instance.reserva.aluno.user.username
            }
        )
        instance.delete()

# -----------------------------
# ALUNO
# -----------------------------
class AlunoAdminViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoAdminSerializer
    permission_classes = [IsAdminUser]


# -----------------------------
# AUTOR
# -----------------------------
class AutorAdminViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorAdminSerializer
    permission_classes = [IsAdminUser]

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
    permission_classes = [IsAdminUser]

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
    permission_classes = [IsAdminUser]

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
# AUDIT LOG (READ ONLY)
# -----------------------------
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-criado_em')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]

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