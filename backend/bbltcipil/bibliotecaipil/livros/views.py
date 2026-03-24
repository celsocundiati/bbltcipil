from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError

from django.contrib.auth import get_user_model

from .models import Categoria, Autor, Livro, Reserva, Emprestimo, Notificacao
from .serializers import (
    CategoriaSerializer, AutorSerializer, LivroSerializer,
    ReservaSerializer, EmprestimoSerializer, NotificacaoSerializer
)

from .service import criar_reserva

User = get_user_model()



# ==============================
# BASE VIEWSET (SEGURANÇA)
# ==============================
class BaseDebugViewSet(viewsets.ModelViewSet):

    def update(self, request, *args, **kwargs):
        raise PermissionDenied("Edição não permitida.")

    def partial_update(self, request, *args, **kwargs):
        raise PermissionDenied("Edição não permitida.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==============================
# CATEGORIAS (READ ONLY)
# ==============================
class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]


# ==============================
# AUTORES (READ ONLY)
# ==============================
class AutorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer
    permission_classes = [IsAuthenticated]


# ==============================
# LIVROS
# ==============================
class LivroViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['titulo', 'autor__nome', 'categoria__nome']
    ordering_fields = ['publicado_em', 'titulo']
    ordering = ['-publicado_em']

    @action(detail=True, methods=["post"])
    def reservar(self, request, pk=None):

        livro = self.get_object()

        try:
            reserva = criar_reserva(
                usuario=request.user,
                livro=livro
            )

            return Response({
                "mensagem": "Reserva criada com sucesso",
                "reserva_id": reserva.id,
                "estado": reserva.estado
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"erro": e.messages}, status=400)


# ==============================
# RESERVAS
# ==============================
class ReservaViewSet(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reserva.objects.filter(usuario=self.request.user)

    def create(self, request, *args, **kwargs):

        livro_id = request.data.get("livro")

        if not livro_id:
            return Response({"erro": "Livro é obrigatório"}, status=400)

        try:
            livro = Livro.objects.get(id=livro_id)

            reserva = criar_reserva(
                usuario=request.user,
                livro=livro
            )

            serializer = self.get_serializer(reserva)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Livro.DoesNotExist:
            return Response({"erro": "Livro não encontrado"}, status=404)

        except ValidationError as e:
            return Response({"erro": e.messages}, status=400)

    def update(self, request, *args, **kwargs):
        raise PermissionDenied("Usuário não pode editar reservas.")

    def partial_update(self, request, *args, **kwargs):
        raise PermissionDenied("Usuário não pode editar reservas.")

    def destroy(self, request, *args, **kwargs):

        reserva = self.get_object()

        if reserva.usuario_id != request.user.id:
            raise PermissionDenied("Sem permissão para cancelar esta reserva.")

        if reserva.estado not in ["pendente", "reservado"]:
            raise PermissionDenied("Só pode cancelar reservas ativas.")

        reserva.delete()

        return Response({"mensagem": "Reserva cancelada com sucesso"})



# ==============================
# EMPRÉSTIMOS (READ ONLY)
# ==============================
class EmprestimoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Emprestimo.objects.filter(reserva__usuario=self.request.user)


# ==============================
# NOTIFICAÇÕES
# ==============================
class NotificacaoViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacaoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['criada_em']
    ordering = ['-criada_em']

    def get_queryset(self):
        return Notificacao.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=["post"])
    def marcar_lida(self, request, pk=None):

        notif = self.get_object()
        notif.lida = True
        notif.save(update_fields=['lida'])

        return Response({"status": "ok"})
    






    