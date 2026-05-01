from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Categoria, Autor, Livro, Reserva, Emprestimo, Notificacao, Exposicao, Evento, Participacao
from .serializers import (
    CategoriaSerializer, AutorSerializer, LivroSerializer, ReservaSerializer, EmprestimoSerializer, 
    NotificacaoSerializer, ExposicaoSerializer, EventoSerializer, ParticipacaoSerializer
)
from .service import criar_reserva, cancelar_reserva, reservar_exposicao, reservar_evento, cancelar_participacao
User = get_user_model()
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

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
            return Response({
                "erro": "campo_obrigatorio",
                "mensagem": "Livro é obrigatório"
            }, status=400)

        try:
            livro = Livro.objects.get(id=livro_id)

            reserva = criar_reserva(
                usuario=request.user,
                livro=livro
            )

            serializer = self.get_serializer(reserva)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Livro.DoesNotExist:
            return Response({
                "erro": "livro_nao_encontrado",
                "mensagem": "Livro não encontrado"
            }, status=404)

        except (DRFValidationError, DjangoValidationError) as e:

            # 🔥 aqui está a chave
            detail = e.detail if hasattr(e, "detail") else e.messages

            # normalizar resposta
            if isinstance(detail, dict):
                data = detail
            elif isinstance(detail, list):
                data = {
                    "erro": "validacao",
                    "mensagem": detail[0]
                }
            else:
                data = {
                    "erro": "validacao",
                    "mensagem": str(detail)
                }

            return Response(data, status=400)


        def update(self, request, *args, **kwargs):
            raise PermissionDenied("Usuário não pode editar reservas.")

        def partial_update(self, request, *args, **kwargs):
            raise PermissionDenied("Usuário não pode editar reservas.")

        def destroy(self, request, *args, **kwargs):

            reserva = self.get_object()

            cancelar_reserva(reserva, request.user)

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


class ExposicaoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExposicaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Exposicao.objects.filter(
            estado='Disponível'
        ).order_by('-data_inicio')

    @action(detail=True, methods=['post'])
    def reservar(self, request, pk=None):

        exposicao = self.get_object()

        try:
            participacao = reservar_exposicao(request.user, exposicao.id)
            return Response(
                ParticipacaoSerializer(participacao).data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"erro": str(e)}, status=400)

    @action(detail=True, methods=['post'])
    def cancelar_reserva(self, request, pk=None):

        participacao = Participacao.objects.filter(
            usuario=request.user,
            exposicao_id=pk
        ).first()

        if not participacao:
            return Response({"erro": "Participação não encontrada."}, status=404)

        cancelar_participacao(participacao, request.user)

        return Response({"mensagem": "Reserva cancelada com sucesso."})


class EventoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evento.objects.filter(
            estado='Disponível'
        ).order_by('-data_inicio')

    @action(detail=True, methods=['post'])
    def reservar(self, request, pk=None):

        evento = self.get_object()

        try:
            participacao = reservar_evento(request.user, evento.id)
            return Response(
                ParticipacaoSerializer(participacao).data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"erro": str(e)}, status=400)

    @action(detail=True, methods=['post'])
    def cancelar_reserva(self, request, pk=None):

        participacao = Participacao.objects.filter(
            usuario=request.user,
            evento_id=pk
        ).first()

        if not participacao:
            return Response({"erro": "Participação não encontrada."}, status=404)

        cancelar_participacao(participacao, request.user)

        return Response({"mensagem": "Reserva cancelada com sucesso."})


class ParticipacaoViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Participacao.objects.filter(usuario=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.usuario != self.request.user:
            raise PermissionDenied("Sem permissão.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.usuario != self.request.user:
            raise PermissionDenied("Sem permissão.")
        instance.delete()


class MinhasExposicoesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ParticipacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Participacao.objects.filter(
            usuario=self.request.user
        ).select_related('exposicao').order_by('-data_registro')
    

class MeusEventosViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ParticipacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Participacao.objects.filter(
            usuario=self.request.user
        ).select_related('evento').order_by('-data_registro')
    

    