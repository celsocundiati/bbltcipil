from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from .models import Categoria, Autor, Aluno, Livro, Reserva, Emprestimo
from .serializers import CategoriaSerializer, AutorSerializer, AlunoSerializer, LivroSerializer, ReservaSerializer, EmprestimoSerializer


class BaseDebugViewSet(viewsets.ModelViewSet):

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(str(e))
            return Response(
                {"error": "Erro ao apagar"},
                status=status.HTTP_400_BAD_REQUEST
            )


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        categoria = self.get_object()
        serializer = self.get_serializer(categoria, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        print(serializer.errors)  # 👈 DEBUG IGUAL AO CREATE
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            categoria = self.get_object()
            categoria.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(str(e))  # 👈 DEBUG direto no console
            return Response(
                {"error": "Erro ao apagar"},
                status=status.HTTP_400_BAD_REQUESTcategoria
            )

class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        autor = self.get_object()
        serializer = self.get_serializer(autor, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        print(serializer.errors)  # 👈 DEBUG IGUAL AO CREATE
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            autor = self.get_object()
            autor.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(str(e))  # 👈 DEBUG direto no console
            return Response(
                {"error": "Erro ao apagar"},
                status=status.HTTP_400_BAD_REQUEST
            )

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        aluno = self.get_object()
        serializer = self.get_serializer(aluno, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        print(serializer.errors)  # 👈 DEBUG IGUAL AO CREATE
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            aluno = self.get_object()
            aluno.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(str(e))  # 👈 DEBUG direto no console
            return Response(
                {"error": "Erro ao apagar"},
                status=status.HTTP_400_BAD_REQUEST
            )

class LivroViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer

    @action(detail=False, methods=['get'])
    def recentes(self, request):
        livros = Livro.objects.order_by('-data')
        return Response(self.get_serializer(livros, many=True).data)
    
    @action(detail=False, methods=['get'])
    def populares(self, request):
        livros = Livro.objects.filter(is_popular=True)
        return Response(self.get_serializer(livros, many=True).data)


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        livro = self.get_object()
        serializer = self.get_serializer(livro, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        print(serializer.errors)  # 👈 DEBUG IGUAL AO CREATE
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            livro = self.get_object()
            livro.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(str(e))  # 👈 DEBUG direto no console
            return Response(
                {"error": "Erro ao apagar"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=["post"])
    def reservar(self, request, pk=None):
        livro = self.get_object()

        if livro.estado != "Disponível":
            return Response(
                {"erro":"Livro não Disponível"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        livro.estado = "Pendente"
        livro.save()

        

        return Response({"mensagem":"Reserva enviada com sucesso"})



class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

class EmprestimoViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer



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