from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer, AlterarSenhaSerializer
from django.contrib.auth.models import update_last_login
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken
from audit.models import AuditLog
from .models import AlunoOficial, FuncionarioOficial, Perfil
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
import json
from django.core import signing
from django.contrib.auth.models import User, Group
from django.contrib.contenttypes.models import ContentType

User = get_user_model()


# =====================================================
# SIGNUP - Ativação de Conta
# =====================================================
class SignupView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        serializer = SignupSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Erro na validação dos dados",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        result = serializer.save()

        return Response(
            {
                "success": True,
                "message": (
                    "Email de ativação enviado. "
                    "Verifica a tua caixa de entrada."
                ),
                "email": result["email"],
                "email_verification_sent": True
            },
            status=status.HTTP_200_OK
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, token):

        try:

            data = signing.loads(
                token,
                salt="signup-activation",
                max_age=60 * 60 * 24  # 24 horas
            )

            email = data["email"]
            password = data["password"]
            n_identificacao = data["n_identificacao"]
            grupo_nome = data["grupo_nome"]
            nome_completo = data["nome_completo"]
            tipo = data["tipo"]

            if User.objects.filter(email=email).exists():
                return Response(
                    {
                        "message": (
                            "Já existe uma conta com este email."
                        )
                    },
                    status=400
                )

            if tipo == "aluno":

                instance = AlunoOficial.objects.get(
                    n_processo=n_identificacao
                )

            else:

                instance = FuncionarioOficial.objects.get(
                    n_agente=n_identificacao
                )

            if instance.perfil:
                return Response(
                    {
                        "message": (
                            "Este utilizador já possui conta ativa."
                        )
                    },
                    status=400
                )

            user = User.objects.create_user(
                username=n_identificacao,
                email=email,
                password=password,
                first_name=nome_completo,
                is_active=True
            )

            grupo, _ = Group.objects.get_or_create(
                name=grupo_nome
            )

            user.groups.add(grupo)

            perfil = Perfil.objects.create(
                user=user,
                telefone=""
            )

            instance.perfil = perfil
            instance.save()

            AuditLog.objects.create(
                usuario=user,
                acao="Sign up",
                modelo=ContentType.objects.get_for_model(user),
                objeto_id=user.id,
                alteracoes={
                    "grupo": grupo_nome,
                    "identificacao": n_identificacao
                }
            )

            return Response(
                {
                    "message": "Conta ativada com sucesso."
                },
                status=200
            )

        except signing.SignatureExpired:
            return Response(
                {
                    "message": "Link expirado."
                },
                status=400
            )

        except signing.BadSignature:
            return Response(
                {
                    "message": "Link inválido."
                },
                status=400
            )

        except Exception as e:
            return Response(
                {
                    "message": str(e)
                },
                status=400
            )


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Não autenticado"}, status=401)
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            user_id = refresh["user_id"]
            user = User.objects.filter(id=user_id).first()

            # 🔐 Rotacionar refresh token
            response = Response({
                "access": access_token,
                "user": {
                    "id": user.id if user else None,
                    "username": user.username if user else None
                }
            })

            # Atualiza cookie refresh
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,  # True em produção
                samesite="Lax",
                max_age=7*24*60*60
            )

            return response

        except Exception:
            return Response({"error": "Token inválido"}, status=401)   


# =====================================================
# LOGIN - n_processo + senha
# =====================================================
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh = serializer.validated_data["refresh"]
        user = serializer.validated_data["user_obj"]   # vamos usar o objeto user

        # atualiza último login
        update_last_login(None, user)

        response = Response({
            "message": "Login efetuado com sucesso",
            "user": serializer.validated_data["user"]
        }, status=200)

        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=False,   # True em produção
            samesite="Lax",
            max_age=7 * 24 * 60 * 60
        )

        return response

# =====================================================
# LOGOUT
# =====================================================

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response = Response({"message": "Logout efetuado"})
        response.delete_cookie("refresh_token")
        return response


# =====================================================
# ME - Dados do usuário autenticado
# =====================================================
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return self._get_data(request.user)

    def put(self, request):
        return self._update_user(request.user, request.data, request=request)

    def patch(self, request):
        return self._update_user(request.user, request.data, partial=True, request=request)

    def _update_user(self, user, data, partial=False, request=None):
        perfil = getattr(user, "perfil", None)

        email = data.get("email")
        telefone = data.get("telefone")
        foto = request.FILES.get("foto")

        if email:
            user.email = email
            user.save(update_fields=["email"])

        if telefone and perfil:
            perfil.telefone = telefone
            perfil.save(update_fields=["telefone"])
            
        if foto and perfil:
            perfil.foto = foto
            perfil.save(update_fields=["foto"])

        return self._get_data(user)

    def _get_data(self, user):
        perfil = getattr(user, "perfil", None)

        grupos = list(user.groups.values_list("name", flat=True))

        dados_oficiais = {}
        perfil_data = {}

        ao = getattr(perfil, "aluno_oficial", None) if perfil else None
        fo = getattr(perfil, "funcionario_oficial", None) if perfil else None

        if perfil:
            if "Aluno" in grupos and ao:
                dados_oficiais = {
                    "n_processo": ao.n_processo,
                    "nome_completo": ao.nome_completo,
                    "curso": ao.curso,
                    "classe": ao.classe,
                    "data_nascimento": ao.data_nascimento,
                    "idade": ao.idade,
                    "n_bilhete": ao.n_bilhete,
                }

            elif "Funcionario" in grupos and fo:
                dados_oficiais = {
                    "n_agente": fo.n_agente,
                    "nome": fo.nome,
                    "cargo": fo.cargo,
                    "n_bilhete": fo.n_bilhete,
                }

            perfil_data = {
                "telefone": perfil.telefone,
                "foto": perfil.foto.url if perfil.foto else None,
                "n_reservas": perfil.n_reservas,
                "n_emprestimos": perfil.n_emprestimos
            }

        else:
            perfil_data = {
                "telefone": None,
                "foto": None,
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
                "grupos": grupos
            },
            "perfil": perfil_data,
            "dados_oficiais": dados_oficiais,
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


@csrf_exempt
def password_reset_request(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Método não permitido"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
    except Exception:
        return JsonResponse({"success": False, "error": "JSON inválido"}, status=400)

    if not email:
        return JsonResponse({"success": False, "error": "Email é obrigatório"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"success": False, "error": "Email não encontrado"}, status=404)

    token = default_token_generator.make_token(user)
    uid = user.pk
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"

    try:
        send_mail(
            subject="Recuperação de senha - Biblioteca IPIL",
            message=f"""
                Olá,

                Recebeste este email porque pediste recuperação de senha.

                Clica no link abaixo para redefinir:

                {reset_link}

                Se não foste tu, ignora este email.
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False
        )

        return JsonResponse({
            "success": True,
            "message": "Email de recuperação enviado"
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": "Falha ao enviar email",
            "details": str(e)
        }, status=500)



@csrf_exempt
def password_reset_confirm(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Método não permitido"}, status=405)

    try:
        data = json.loads(request.body)
        uid = data.get("uid")
        token = data.get("token")
        new_password = data.get("new_password")
    except Exception:
        return JsonResponse({"success": False, "error": "JSON inválido"}, status=400)

    if not uid or not token or not new_password:
        return JsonResponse({"success": False, "error": "Dados incompletos"}, status=400)

    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return JsonResponse({"success": False, "error": "Usuário não encontrado"}, status=404)

    if not default_token_generator.check_token(user, token):
        return JsonResponse({"success": False, "error": "Token inválido ou expirado"}, status=400)

    user.set_password(new_password)
    user.save()

    return JsonResponse({
        "success": True,
        "message": "Senha redefinida com sucesso"
    })


