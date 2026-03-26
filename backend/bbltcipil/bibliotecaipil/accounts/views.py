from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer, AlterarSenhaSerializer
from .models import Perfil
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.http import JsonResponse
import json
import os
import requests

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


# @csrf_exempt
# def password_reset_request(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Método não permitido"}, status=405)

#     try:
#         data = json.loads(request.body)
#         email = data.get("email")
#     except Exception:
#         return JsonResponse({"error": "JSON inválido"}, status=400)

#     if not email:
#         return JsonResponse({"error": "Email é obrigatório"}, status=400)

#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         return JsonResponse({"error": "Email não encontrado"}, status=404)

#     token = default_token_generator.make_token(user)
#     uid = user.pk
#     reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"

#     send_mail(
#         subject="Recuperação de senha - Biblioteca IPIL",
#         message="",
#         from_email=settings.DEFAULT_FROM_EMAIL,
#         recipient_list=[email],
#         html_message=f"""
#         <h2>Recuperação de senha</h2>
#         <p>Clique no botão abaixo para redefinir sua senha:</p>
#         <a href="{reset_link}" style="
#             padding:10px 20px;
#             background:#2563eb;
#             color:white;
#             text-decoration:none;
#             border-radius:5px;
#         ">Redefinir senha</a>
#         """
#     )

#     return JsonResponse({"message": "Email de recuperação enviado"})

# def password_reset_request(request):
#     email = request.POST.get("email")
#     if not email:
#         return JsonResponse({"error": "Email é obrigatório"}, status=400)
    
#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         return JsonResponse({"error": "Email não encontrado"}, status=404)

#     token = default_token_generator.make_token(user)
#     uid = user.pk

#     reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"

#     # Enviar email
#     send_mail(
#         subject="Recuperação de senha - Biblioteca IPIL",
#         message="",
#         from_email=settings.DEFAULT_FROM_EMAIL,
#         recipient_list=[email],
#         html_message=f"""
#         <h2>Recuperação de senha</h2>
#         <p>Clique no botão abaixo para redefinir sua senha:</p>
#         <a href="{reset_link}" style="
#             padding:10px 20px;
#             background:#2563eb;
#             color:white;
#             text-decoration:none;
#             border-radius:5px;
#         ">Redefinir senha</a>
#         """
#     )

#     return JsonResponse({"message": "Email de recuperação enviado"})
# accounts/views.py


@csrf_exempt
def password_reset_request(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método não permitido"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    if not email:
        return JsonResponse({"error": "Email é obrigatório"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "Email não encontrado"}, status=404)

    token = default_token_generator.make_token(user)
    uid = user.pk
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

    # Envia email via Brevo API
    headers = {
        "accept": "application/json",
        "api-key": os.getenv("BREVO_API_KEY"),
        "Content-Type": "application/json",
    }
    payload = {
        "sender": {"name": "Biblioteca IPIL", "email": "celsocundiati@gmail.com"},
        "to": [{"email": email}],
        "subject": "Recuperação de senha - Biblioteca IPIL",
        "htmlContent": f"""
            <h2>Recuperação de senha</h2>
            <p>Clique no botão abaixo para redefinir sua senha:</p>
            <a href="{reset_link}" style="
                padding:10px 20px;
                background:#2563eb;
                color:white;
                text-decoration:none;
                border-radius:5px;
            ">Redefinir senha</a>
        """
    }
    response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
    if response.status_code != 201 and response.status_code != 200:
        return JsonResponse({"error": "Falha ao enviar email", "details": response.json()}, status=500)

    return JsonResponse({"message": "Email de recuperação enviado"})


@csrf_exempt
def password_reset_confirm(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método não permitido"}, status=405)

    data = json.loads(request.body)
    uid = data.get("uid")
    token = data.get("token")
    new_password = data.get("new_password")

    if not uid or not token or not new_password:
        return JsonResponse({"error": "Dados incompletos"}, status=400)

    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return JsonResponse({"error": "Usuário não encontrado"}, status=404)

    if not default_token_generator.check_token(user, token):
        return JsonResponse({"error": "Token inválido ou expirado"}, status=400)

    user.set_password(new_password)
    user.save()

    return JsonResponse({"message": "Senha redefinida com sucesso"})


