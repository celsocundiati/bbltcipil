from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from livros.models import Aluno
from .serializers import RegistarAlunoSerializer, LoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


User = get_user_model()


# ================== Cadastro de Aluno ==================
class RegistarAlunoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistarAlunoSerializer(data=request.data)
        if serializer.is_valid():
            aluno = serializer.save()
            return Response({
                "mensagem": "Aluno registado com sucesso",
                "aluno_id": aluno.n_processo,
                "username": aluno.user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


# ================== Logout ==================
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


# ================== Me / Dados do Usuário ==================
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            aluno = Aluno.objects.get(user=user)
        except Aluno.DoesNotExist:
            aluno = None

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "aluno": {
                "n_processo": aluno.n_processo if aluno else None,
                "curso": aluno.curso if aluno else None,
                "classe": aluno.classe if aluno else None,
                "estado": aluno.estado if aluno else None,
            }
        })
