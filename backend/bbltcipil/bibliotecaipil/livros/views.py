from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .models import Categoria, Autor, Aluno, Livro, Reserva, Emprestimo, Notificacao
from .serializers import (
    CategoriaSerializer, AutorSerializer, AlunoSerializer,
    LivroSerializer, ReservaSerializer, EmprestimoSerializer,
    NotificacaoSerializer
)


# ==============================
# Base ViewSet para DRY
# ==============================
class BaseDebugViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet com tratamento padrão de erros e logging
    Herda por todas as Views para evitar repetição de código
    """

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
# Alunos
# ==============================

class AlunoViewSet(BaseDebugViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Apenas admin vê todos, usuário comum só o próprio
        queryset = super().get_queryset().select_related("aluno_oficial", "user")
        return queryset if user.is_staff else queryset.filter(user=user)

# ==============================
# Livros
# ==============================
class LivroViewSet(BaseDebugViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"])
    def reservar(self, request, pk=None):
        """Cria reserva para o usuário logado"""
        livro = self.get_object()
        user = request.user

        if livro.estado_atual != "Disponível":
            return Response({"erro": "Livro não disponível"}, status=status.HTTP_400_BAD_REQUEST)

        # Cria reserva real (sempre que possível)
        AlunoModel = apps.get_model('livros', 'Aluno')
        try:
            aluno = AlunoModel.objects.get(user=user)
        except AlunoModel.DoesNotExist:
            return Response({"erro": "Aluno não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        reserva = Reserva.objects.create(livro=livro, aluno=aluno, estado='pendente')
        return Response({"mensagem": "Reserva enviada com sucesso", "reserva_id": reserva.pk})


# ==============================
# Reservas
# ==============================

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retorna apenas reservas do usuário logado"""
        user = self.request.user
        return self.queryset.filter(aluno__user=user)

# ==============================
# Empréstimos
# ==============================
class EmprestimoViewSet(BaseDebugViewSet):
    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        hoje = timezone.now().date()

        queryset = Emprestimo.objects.filter(reserva__aluno__user=user)

        # Atualiza status atrasado automaticamente
        queryset.filter(acoes='ativo', data_devolucao__lt=hoje).update(acoes='atrasado')
        return queryset


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
        """Retorna apenas notificações do usuário logado"""
        queryset = Notificacao.objects.filter(usuario=self.request.user)
        lidas = self.request.query_params.get('lidas')
        if lidas is not None:
            if lidas.lower() == 'false':
                queryset = queryset.filter(lida=False)
            elif lidas.lower() == 'true':
                queryset = queryset.filter(lida=True)
        return queryset

    def perform_create(self, serializer):
        """Define automaticamente o usuário"""
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=["post"])
    def marcar_lida(self, request, pk=None):
        """Marca uma notificação como lida"""
        try:
            notif = self.get_object()
            notif.lida = True
            notif.save(update_fields=['lida'])
            return Response({"status": "ok"})
        except Notificacao.DoesNotExist:
            return Response({"error": "Notificação não encontrada"}, status=status.HTTP_404_NOT_FOUND)