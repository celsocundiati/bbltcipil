from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginAlunoSerializer
from .models import AlunoOficial, FuncionarioOficial, Funcionario
from livros.models import Aluno
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()


# =====================================================
# SIGNUP - Ativação de Conta
# =====================================================

class SignupView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "mensagem": "Conta criada com sucesso."
        }, status=status.HTTP_201_CREATED)


# =====================================================
# LOGIN - n_processo + senha
# =====================================================

class LoginAlunoView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginAlunoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


# =====================================================
# LOGOUT
# =====================================================

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass

        return Response(
            {"detail": "Logout realizado com sucesso."},
            status=status.HTTP_200_OK
        )


# =====================================================
# ME - Dados do usuário autenticado
# =====================================================




class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        perfil_tipo = None
        aluno = None
        funcionario = None

        # Verifica primeiro se o usuário tem perfil ativo de aluno
        try:
            aluno = Aluno.objects.select_related('aluno_oficial').get(user=user)
            perfil_tipo = "aluno"
        except Aluno.DoesNotExist:
            # Se não for aluno, tenta funcionário
            try:
                funcionario = Funcionario.objects.select_related('funcionario_oficial').get(user=user)
                perfil_tipo = "funcionario"
            except Funcionario.DoesNotExist:
                # Nenhum perfil encontrado
                perfil_tipo = None

        response_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "grupo": [group.name for group in user.groups.all()],
            "tipo_perfil": perfil_tipo,
            "aluno": None,
            "funcionario": None
        }

        if perfil_tipo == "aluno" and aluno:
            ao = aluno.aluno_oficial
            response_data["aluno"] = {
                "n_processo": ao.n_processo,
                "nome_completo": ao.nome_completo,
                "curso": ao.curso,
                "classe": ao.classe,
                "data_nascimento": ao.data_nascimento,
                "idade": ao.idade,
                "telefone": aluno.telefone,
                "estado": aluno.estado,
                "n_reservas": aluno.n_reservas,
                "n_emprestimos": aluno.n_emprestimos
            }

        elif perfil_tipo == "funcionario" and funcionario:
            fo = funcionario.funcionario_oficial
            response_data["funcionario"] = {
                "n_agente": fo.n_agente,
                "nome": fo.nome,
                "n_bilhete": fo.n_bilhete,
                "cargo": fo.cargo,
                "telefone": funcionario.telefone,
                "estado": funcionario.estado,
                "n_reservas": funcionario.n_reservas,
                "n_emprestimos": funcionario.n_emprestimos
            }

        return Response(response_data)
    

