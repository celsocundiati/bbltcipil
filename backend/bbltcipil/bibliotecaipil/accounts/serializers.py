from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import Group
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from audit.models import AuditLog
from .models import AlunoOficial, FuncionarioOficial, Perfil
from django.contrib.contenttypes.models import ContentType
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
        n_identificacao = data["n_identificacao"]
        n_bilhete = data["n_bilhete"]
        email = data["email"]

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Já existe uma conta com este email.")

        instance = None
        grupo_nome = None
        nome_completo = None

        # 🔹 Aluno
        try:
            instance = AlunoOficial.objects.get(
                n_processo=n_identificacao,
                n_bilhete=n_bilhete
            )
            grupo_nome = "Aluno"
            nome_completo = instance.nome_completo
        except AlunoOficial.DoesNotExist:
            pass

        # 🔹 Funcionário
        if not instance:
            try:
                instance = FuncionarioOficial.objects.get(
                    n_agente=n_identificacao,
                    n_bilhete=n_bilhete
                )
                grupo_nome = "Funcionario"
                nome_completo = instance.nome
            except FuncionarioOficial.DoesNotExist:
                raise serializers.ValidationError(
                    "Utilizador não encontrado ou dados incorretos."
                )

        if instance.perfil:
            raise serializers.ValidationError(
                "Este utilizador já possui conta ativa."
            )

        data["instance"] = instance
        data["grupo_nome"] = grupo_nome
        data["nome_completo"] = nome_completo

        return data

    def create(self, validated_data):
        instance = validated_data["instance"]
        grupo_nome = validated_data["grupo_nome"]
        email = validated_data["email"]
        password = validated_data["password"]
        n_identificacao = validated_data["n_identificacao"]
        nome_completo = validated_data["nome_completo"]

        # 🔥 Criação do user
        user = User.objects.create_user(
            username=n_identificacao,
            email=email,
            password=password,
            first_name=nome_completo
        )

        # 🔥 Grupo
        grupo, _ = Group.objects.get_or_create(name=grupo_nome)
        user.groups.add(grupo)

        # 🔥 Perfil SEM tipo
        perfil = Perfil.objects.create(
            user=user,
            telefone=""
        )

        # 🔥 Vincular ao registro oficial
        instance.perfil = perfil
        instance.save()

        # 🔥 Auditoria
        AuditLog.objects.create(
            usuario=user,
            acao="Sign up",
            modelo=ContentType.objects.get_for_model(user),  # ✅ CERTO
            objeto_id=user.id,
            alteracoes={
                "grupo": grupo_nome,
                "identificacao": n_identificacao
            }
        )

        return user
    

# =====================================================
# LOGIN - n_processo/n_agente + senha
# =====================================================

class LoginSerializer(serializers.Serializer):
    n_identificacao = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        n_identificacao = data["n_identificacao"]
        password = data["password"]

        user = authenticate(username=n_identificacao, password=password)

        if not user:
            raise AuthenticationFailed("Credenciais inválidas.")

        if not user.is_active:
            raise AuthenticationFailed("Conta desativada.")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "groups": [group.name for group in user.groups.all()],
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





