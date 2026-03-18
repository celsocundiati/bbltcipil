from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import Group
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from administracao.models import AuditLog
from .models import AlunoOficial, FuncionarioOficial, Perfil

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

        # Verifica email já existente
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Já existe uma conta com este email.")

        instance = None
        tipo = None

        # 1️⃣ Tenta como aluno
        try:
            instance = AlunoOficial.objects.get(
                n_processo=n_identificacao,
                n_bilhete=n_bilhete
            )
            tipo = "aluno"
            nome_completo = instance.nome_completo
        except AlunoOficial.DoesNotExist:
            pass

        # 2️⃣ Se não for aluno, tenta como funcionário
        if not instance:
            try:
                instance = FuncionarioOficial.objects.get(
                    n_agente=n_identificacao,
                    n_bilhete=n_bilhete
                )
                tipo = "funcionario"
                nome_completo = instance.nome
            except FuncionarioOficial.DoesNotExist:
                raise serializers.ValidationError(
                    "Utilizador não encontrado ou dados incorretos."
                )

        # 3️⃣ Verifica se já tem conta ativa
        if instance.perfil:
            raise serializers.ValidationError(
                "Este utilizador já possui conta ativa."
            )

        data["instance"] = instance
        data["tipo"] = tipo
        data["nome_completo"] = nome_completo
        return data

    def create(self, validated_data):
        instance = validated_data["instance"]
        tipo = validated_data["tipo"]
        email = validated_data["email"]
        password = validated_data["password"]
        n_identificacao = validated_data["n_identificacao"]
        nome_completo = validated_data["nome_completo"]

        # Cria User
        user = User.objects.create_user(
            username=n_identificacao,
            email=email,
            password=password,
            first_name=nome_completo
        )

        # Define grupo automaticamente
        grupo_nome = "Aluno" if tipo == "aluno" else "Funcionario"
        grupo, _ = Group.objects.get_or_create(name=grupo_nome)
        user.groups.add(grupo)

        # 🔹 Cria Perfil vinculado ao User
        perfil = Perfil.objects.create(
            user=user,
            tipo=tipo,
            telefone="",
        )

        # 🔹 Associa o Perfil ao registro oficial
        instance.perfil = perfil
        instance.save()

        # Auditoria
        AuditLog.objects.create(
            usuario=user,
            acao="Sign up",
            modelo="User",
            objeto_id=user.id,
            alteracoes={
                "tipo": tipo,
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
                "tipo": user.perfil.tipo if hasattr(user, "perfil") else None
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





