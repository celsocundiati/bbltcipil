from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import Categoria, Autor, Aluno, Livro, Reserva, Emprestimo
from .serializers import (
    CategoriaSerializer, AutorSerializer, AlunoSerializer,
    LivroSerializer, ReservaSerializer, EmprestimoSerializer,
    RegistarAlunoSerializer
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
# Cadastro de Aluno
# ==============================
class RegistarAlunoViewSet(BaseDebugViewSet):
    serializer_class = RegistarAlunoSerializer
    queryset = Aluno.objects.all()

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

# ==============================
# Livros
# ==============================
class LivroViewSet(BaseDebugViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer

    @action(detail=False, methods=['get'])
    def recentes(self, request):
        """Lista livros por ordem de cadastro"""
        livros = Livro.objects.order_by('-data')
        return Response(self.get_serializer(livros, many=True).data)
    
    @action(detail=False, methods=['get'])
    def populares(self, request):
        """Lista livros marcados como populares"""
        livros = Livro.objects.filter(is_popular=True)
        return Response(self.get_serializer(livros, many=True).data)

    @action(detail=True, methods=["post"])
    def reservar(self, request, pk=None):
        """Criar reserva simples do livro"""
        livro = self.get_object()

        if livro.estado_atual != "Disponível":
            return Response(
                {"erro": "Livro não disponível"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Aqui você poderia criar a reserva para o aluno logado
        return Response({"mensagem": "Reserva enviada com sucesso"})

# ==============================
# Reservas
# ==============================
class ReservaViewSet(BaseDebugViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

# ==============================
# Empréstimos
# ==============================
class EmprestimoViewSet(BaseDebugViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer

    def get_queryset(self):
        """Atualiza automaticamente empréstimos atrasados"""
        queryset = super().get_queryset()
        hoje = timezone.now().date()
        queryset.filter(acoes='ativo', data_devolucao__lt=hoje).update(acoes='atrasado')
        return queryset


'''
Views Dinamicamente
=========================

from rest_framework import viewsets
from .models import Categoria, Autor, Aluno, Livro, Reserva, Emprestimo, Devolucao
from .serializers import SERIALIZERS

MODELS = [Categoria, Autor, Aluno, Livro, Reserva, Emprestimo, Devolucao]

VIEWS = {}

for model in MODELS:
    viewset = type(
        f"{nodel.__name__}ViewSet",
        (viewsets.ModelViewSet,),
        {
            "queryset": model.objects.all(),
            "serializer_class": SERIALIZERS[model.__name__]
        }
    )
    VIEWS[model.__name__] = viewset

'''