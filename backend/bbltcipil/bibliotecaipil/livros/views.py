from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Categoria, Autor, Livro, Reserva, Emprestimo, Notificacao
from .serializers import (
    CategoriaSerializer, AutorSerializer, LivroSerializer,
    ReservaSerializer, EmprestimoSerializer, NotificacaoSerializer
)
from administracao.audit_service import AuditService


# ==============================
# Base ViewSet para DRY
# ==============================
class BaseDebugViewSet(viewsets.ModelViewSet):
    """Base ViewSet com tratamento padrão de erros"""
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==============================
# Categorias
# ==============================
class CategoriaViewSet(BaseDebugViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# ==============================
# Autores
# ==============================
class AutorViewSet(BaseDebugViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer


# ==============================
# Perfis (Alunos + Funcionários)
# ==============================
# class PerfilViewSet(viewsets.ModelViewSet):
#     queryset = Perfil.objects.select_related('aluno_oficial', 'funcionario_oficial', 'user').all()
#     serializer_class = PerfilSerializer
#     permission_classes = [IsAuthenticated]

#     filter_backends = [filters.SearchFilter, filters.OrderingFilter]
#     search_fields = [
#         'user__username',
#         'telefone',
#         'aluno_oficial__nome_completo',
#         'aluno_oficial__n_processo',
#         'funcionario_oficial__nome',
#         'funcionario_oficial__n_agente',
#         'funcionario_oficial__cargo'
#     ]
#     ordering_fields = ['user__username', 'n_reservas', 'n_emprestimos']
#     ordering = ['user__username']

#     def get_queryset(self):
#         """Admins veem todos, usuários normais só o próprio perfil"""
#         user = self.request.user
#         queryset = super().get_queryset()
#         if not user.is_staff:
#             queryset = queryset.filter(user=user)
#         return queryset


# ==============================
# Livros
# ==============================
class LivroViewSet(BaseDebugViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['titulo', 'autor__nome', 'categoria__nome']
    ordering_fields = ['publicado_em', 'titulo', 'isbn', 'estado']
    ordering = ['publicado_em']

    @action(detail=True, methods=["post"])
    def reservar(self, request, pk=None):
        livro = self.get_object()
        user = request.user
        if livro.estado_atual != "Disponível":
            return Response({"erro": "Livro não disponível"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            reserva = Reserva.objects.create(usuario=user, livro=livro, estado='pendente')
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"mensagem": "Reserva enviada com sucesso", "reserva_id": reserva.pk})


# ==============================
# Reservas
# ==============================
class ReservaViewSet(BaseDebugViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        reserva = serializer.save(usuario=self.request.user)
        reserva._request = self.request
        
        return reserva

    def perform_update(self, serializer):
        reserva = serializer.save()
        reserva._request = self.request
        return reserva
    

# ==============================
# Empréstimos
# ==============================
class EmprestimoViewSet(BaseDebugViewSet):
    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        hoje = timezone.now().date()
        queryset = Emprestimo.objects.filter(reserva__usuario=user)
        queryset.filter(acoes='ativo', data_devolucao__lt=hoje).update(acoes='atrasado')
        return queryset

    def perform_create(self, serializer):
        emprestimo = serializer.save()
        emprestimo._request = self.request
        return emprestimo

    def perform_update(self, serializer):
        emprestimo = serializer.save()
        emprestimo._request = self.request
        return emprestimo


# ==============================
# Notificações
# ==============================
class NotificacaoViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['criada_em']
    ordering = ['-criada_em']

    def get_queryset(self):
        queryset = Notificacao.objects.filter(usuario=self.request.user)
        lidas = self.request.query_params.get('lidas')
        if lidas is not None:
            queryset = queryset.filter(lida=(lidas.lower() == 'true'))
        return queryset

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=["post"])
    def marcar_lida(self, request, pk=None):
        notif = self.get_object()
        notif.lida = True
        notif.save(update_fields=['lida'])
        return Response({"status": "ok"})
    

