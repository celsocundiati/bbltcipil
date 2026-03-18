from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer, AlterarSenhaSerializer
from .models import Perfil
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
        serializer = LoginSerializer(data=request.data)
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

# class MeView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):

#         user = request.user

#         perfil = Perfil.objects.select_related(
#             "aluno_oficial",
#             "funcionario_oficial"
#         ).filter(user=user).first()

#         dados_oficiais = {}
#         perfil_data = {}

#         if perfil:

#             if perfil.tipo == "aluno" and perfil.aluno_oficial:
#                 ao = perfil.aluno_oficial

#                 dados_oficiais = {
#                     "n_processo": ao.n_processo,
#                     "nome_completo": ao.nome_completo,
#                     "curso": ao.curso,
#                     "classe": ao.classe,
#                     "data_nascimento": ao.data_nascimento,
#                     "idade": ao.idade,
#                     "n_bilhete": ao.n_bilhete,
#                 }

#             elif perfil.tipo == "funcionario" and perfil.funcionario_oficial:
#                 fo = perfil.funcionario_oficial

#                 dados_oficiais = {
#                     "n_agente": fo.n_agente,
#                     "nome": fo.nome,
#                     "cargo": fo.cargo,
#                     "n_bilhete": fo.n_bilhete,
#                 }

#             perfil_data = {
#                 "tipo": perfil.tipo,
#                 "telefone": perfil.telefone,
#                 "estado": perfil.estado,
#                 "n_reservas": perfil.n_reservas,
#                 "n_emprestimos": perfil.n_emprestimos
#             }

#         else:
#             # Caso seja superuser ou usuário sem perfil
#             perfil_data = {
#                 "tipo": "admin" if user.is_superuser else None,
#                 "telefone": None,
#                 "estado": "ativo",
#                 "n_reservas": 0,
#                 "n_emprestimos": 0
#             }

#         response_data = {

#             "user": {
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#                 "is_superuser": user.is_superuser,
#                 "grupos": [g.name for g in user.groups.all()]
#             },

#             "perfil": perfil_data,

#             "dados_oficiais": dados_oficiais
#         }

#         return Response(response_data)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return self._get_data(request.user)

    def put(self, request):
        return self._update_user(request.user, request.data)

    def patch(self, request):
        return self._update_user(request.user, request.data, partial=True)

    def _update_user(self, user, data, partial=False):
        """
        Atualiza parcialmente ou totalmente email e telefone
        """
        perfil = getattr(user, "perfil", None)

        email = data.get("email")
        telefone = data.get("telefone")

        # Atualização parcial
        if email:
            user.email = email
            user.save(update_fields=["email"])

        if telefone and perfil:
            perfil.telefone = telefone
            perfil.save(update_fields=["telefone"])

        return self._get_data(user)

    def _get_data(self, user):
        perfil = Perfil.objects.select_related(
            "aluno_oficial",
            "funcionario_oficial"
        ).filter(user=user).first()

        dados_oficiais = {}
        perfil_data = {}

        if perfil:
            if perfil.tipo == "aluno" and perfil.aluno_oficial:
                ao = perfil.aluno_oficial
                dados_oficiais = {
                    "n_processo": ao.n_processo,
                    "nome_completo": ao.nome_completo,
                    "curso": ao.curso,
                    "classe": ao.classe,
                    "data_nascimento": ao.data_nascimento,
                    "idade": ao.idade,
                    "n_bilhete": ao.n_bilhete,
                }
            elif perfil.tipo == "funcionario" and perfil.funcionario_oficial:
                fo = perfil.funcionario_oficial
                dados_oficiais = {
                    "n_agente": fo.n_agente,
                    "nome": fo.nome,
                    "cargo": fo.cargo,
                    "n_bilhete": fo.n_bilhete,
                }

            perfil_data = {
                "tipo": perfil.tipo,
                "telefone": perfil.telefone,
                "estado": perfil.estado,
                "n_reservas": perfil.n_reservas,
                "n_emprestimos": perfil.n_emprestimos
            }
        else:
            perfil_data = {
                "tipo": "admin" if user.is_superuser else None,
                "telefone": None,
                "estado": "ativo",
                "n_reservas": 0,
                "n_emprestimos": 0
            }

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "is_superuser": user.is_superuser,
                "grupos": [g.name for g in user.groups.all()]
            },
            "perfil": perfil_data,
            "dados_oficiais": dados_oficiais
        })


class AlterarSenhaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = AlterarSenhaSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():

            user = request.user
            nova_senha = serializer.validated_data["nova_senha"]

            user.set_password(nova_senha)
            user.save()

            return Response(
                {"detail": "Senha alterada com sucesso."},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



