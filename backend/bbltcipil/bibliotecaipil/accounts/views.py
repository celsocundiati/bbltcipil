from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupAlunoSerializer, LoginAlunoSerializer
from administracao.models import AlunoOficial
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()


# =====================================================
# SIGNUP - Ativação de Conta
# =====================================================

class SignupAlunoView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = SignupAlunoSerializer(data=request.data)
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

        try:
            aluno = AlunoOficial.objects.get(user=user)
        except AlunoOficial.DoesNotExist:
            aluno = None

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "grupo": [group.name for group in user.groups.all()],
            "aluno": {
                "n_processo": aluno.n_processo if aluno else None,
                "nome_completo": aluno.nome_completo if aluno else None,
                "curso": aluno.curso if aluno else None,
                "classe": aluno.classe if aluno else None,
                "data_nascimento": aluno.data_nascimento if aluno else None,
                "idade": aluno.idade if aluno else None,
            }
        })