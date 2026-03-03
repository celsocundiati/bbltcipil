from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from administracao.models import AuditLog
from .models import AlunoOficial, FuncionarioOficial, Funcionario
from livros.models import Aluno

User = get_user_model()


# =====================================================
# SIGNUP - ATIVAÇÃO DE CONTA (Aluno Oficial)
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
            except FuncionarioOficial.DoesNotExist:
                raise serializers.ValidationError(
                    "Utilizador não encontrado ou dados incorretos."
                )

        # 3️⃣ Verifica se já tem conta ativa
        if instance.user:
            raise serializers.ValidationError(
                "Este utilizador já possui conta ativa."
            )

        data["instance"] = instance
        data["tipo"] = tipo
        return data

    def create(self, validated_data):
        instance = validated_data["instance"]
        tipo = validated_data["tipo"]
        email = validated_data["email"]
        password = validated_data["password"]
        n_identificacao = validated_data["n_identificacao"]

        # Cria User
        user = User.objects.create_user(
            username=n_identificacao,
            email=email,
            password=password
        )

        # Define grupo automaticamente
        grupo_nome = "Aluno" if tipo == "aluno" else "Funcionario"
        grupo, _ = Group.objects.get_or_create(name=grupo_nome)
        user.groups.add(grupo)

        # Associa ao oficial
        instance.user = user
        instance.save()

        # 🔵 Se for aluno → cria perfil Aluno
        if tipo == "aluno":
            Aluno.objects.create(
                user=user,
                aluno_oficial=instance
            )

        # 🟢 Se for funcionário → cria perfil Funcionario
        if tipo == "funcionario":
            Funcionario.objects.create(
                user=user,
                funcionario_oficial=instance,
                telefone="",  # pode depois permitir editar no perfil
            )

        # Auditoria
        AuditLog.objects.create(
            usuario=user,
            acao="signin",
            modelo="User",
            objeto_id=user.id,
            alteracoes={
                "tipo": tipo,
                "identificacao": n_identificacao
            }
        )

        return user
    


# =====================================================
# LOGIN - n_processo + senha
# =====================================================

class LoginAlunoSerializer(serializers.Serializer):
    n_processo = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        n_processo = data["n_processo"]
        password = data["password"]

        user = authenticate(username=n_processo, password=password)

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
                "groups": [group.name for group in user.groups.all()]
            }
        }
    

