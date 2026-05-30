from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from .models import AlunoOficial, FuncionarioOficial
from django.conf import settings
from django.core import signing
from django.db.models import Q
from .services.email_service import send_verification_email, is_valid_email_basic

User = get_user_model()


# =====================================================
# SIGNUP - ATIVAÇÃO DE CONTA (Aluno ou Funcionário)
# =====================================================
class SignupSerializer(serializers.Serializer):
    n_identificacao = serializers.CharField(max_length=20)
    n_bilhete = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        print("🚀 VALIDANDO SIGNUP:", data)

        email = data["email"]
        n_identificacao = data["n_identificacao"]
        n_bilhete = data["n_bilhete"]

        # 🔴 duplicado
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "Já existe uma conta com este email."
            })

        # 🔴 validação básica primeiro (rápida)
        if not is_valid_email_basic(email):
            raise serializers.ValidationError({
                "email": "Email inválido."
            })

        # 🔴 validação externa (ZeroBounce)
        # if not validate_email(email):
        #     raise serializers.ValidationError({
        #         "email": "Email não é válido ou não pode ser verificado."
        #     })

        # 🔹 aluno ou funcionário
        instance = None
        grupo_nome = None
        nome_completo = None

        try:
            instance = AlunoOficial.objects.get(
                n_processo=n_identificacao,
                n_bilhete=n_bilhete
            )
            grupo_nome = "Aluno"
            nome_completo = instance.nome_completo

        except AlunoOficial.DoesNotExist:
            pass

        if not instance:
            try:
                instance = FuncionarioOficial.objects.get(
                    n_agente=n_identificacao,
                    n_bilhete=n_bilhete
                )
                grupo_nome = "Funcionario"
                nome_completo = instance.nome
            except FuncionarioOficial.DoesNotExist:
                raise serializers.ValidationError({
                    "identificacao": "Utilizador não encontrado ou dados incorretos."
                })

        # 🔴 já tem conta
        if instance.perfil:
            raise serializers.ValidationError({
                "identificacao": "Este utilizador já possui conta ativa."
            })

        data["instance"] = instance
        data["grupo_nome"] = grupo_nome
        data["nome_completo"] = nome_completo

        return data
    
    def create(self, validated_data):

        payload = {
            "email": validated_data["email"],
            "password": validated_data["password"],
            "n_identificacao": validated_data["n_identificacao"],
            "grupo_nome": validated_data["grupo_nome"],
            "nome_completo": validated_data["nome_completo"],
            "tipo": (
                "aluno"
                if validated_data["grupo_nome"] == "Aluno"
                else "funcionario"
            )
        }

        token = signing.dumps(
            payload,
            salt="signup-activation"
        )

        verify_link = (
            f"{settings.FRONTEND_URL}/verify-email/{token}"
        )

        email_sent = send_verification_email(
            validated_data["email"],
            verify_link
        )

        if not email_sent:
            raise serializers.ValidationError({
                "email": (
                    "Não foi possível enviar email de verificação."
                )
            })

        return {
            "email": validated_data["email"]
        }

        # def create(self, validated_data):
        #     instance = validated_data["instance"]
        #     grupo_nome = validated_data["grupo_nome"]
        #     email = validated_data["email"]
        #     password = validated_data["password"]
        #     n_identificacao = validated_data["n_identificacao"]
        #     nome_completo = validated_data["nome_completo"]

        #     # 🔥 criar user (ainda inativo)
        #     user = User.objects.create_user(
        #         username=n_identificacao,
        #         email=email,
        #         password=password,
        #         first_name=nome_completo,
        #         is_active=False
        #     )

        #     grupo, _ = Group.objects.get_or_create(name=grupo_nome)
        #     user.groups.add(grupo)

        #     perfil = Perfil.objects.create(user=user, telefone="")
        #     instance.perfil = perfil
        #     instance.save()

        #     # 🔥 gerar link
        #     uid = urlsafe_base64_encode(force_bytes(user.pk))
        #     token = default_token_generator.make_token(user)

        #     verify_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"

        #     # 🔥 ENVIAR EMAIL (CRÍTICO)
        #     email_sent = send_verification_email(user.email, verify_link)

        #     if not email_sent:
        #         # 🔥 rollback lógico
        #         user.delete()
        #         raise serializers.ValidationError({
        #             "email": "Não foi possível enviar email de verificação. Tente novamente."
        #         })

        #     AuditLog.objects.create(
        #         usuario=user,
        #         acao="Sign up",
        #         modelo=ContentType.objects.get_for_model(user),
        #         objeto_id=user.id,
        #         alteracoes={
        #             "grupo": grupo_nome,
        #             "identificacao": n_identificacao
        #         }
        #     )

        #     return user


# =====================================================
# LOGIN - n_processo/n_agente + senha
# =====================================================
class LoginSerializer(serializers.Serializer):
    email_or_username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data["email_or_username"]
        password = data["password"]

        user = User.objects.filter(
            Q(username=identifier) | Q(email=identifier)
        ).first()

        if not user:
            raise AuthenticationFailed("Utilizador não encontrado.")

        # 🔥 VERIFICA PASSWORD DIRETAMENTE
        if not user.check_password(password):
            raise AuthenticationFailed("Credenciais inválidas.")

        if not user.is_active:
            raise AuthenticationFailed("Conta desativada.")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user_obj": user,  # 🔥 adicionar isto
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "groups": list(user.groups.values_list("name", flat=True)),
            }
        }  


class AlterarSenhaSerializer(serializers.Serializer):
    senha_atual = serializers.CharField(required=True)
    nova_senha = serializers.CharField(required=True, validators=[validate_password])

    def validate(self, data):
        user = self.context["request"].user

        if not user.check_password(data["senha_atual"]):
            raise serializers.ValidationError({
                "senha_atual": "A senha atual está incorreta."
            })

        return data





