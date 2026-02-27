from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from administracao.models import AlunoOficial, AuditLog
from livros.models import Aluno

User = get_user_model()


# =====================================================
# SIGNUP - ATIVAÇÃO DE CONTA (Aluno Oficial)
# =====================================================


class SignupAlunoSerializer(serializers.Serializer):
    n_processo = serializers.CharField(max_length=15)
    n_bilhete = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        n_processo = data["n_processo"]
        n_bilhete = data["n_bilhete"]
        email = data["email"]

        # Verifica se já existe email registado
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Já existe uma conta com este email.")

        # Verifica existência na base oficial
        try:
            aluno = AlunoOficial.objects.get(
                n_processo=n_processo,
                n_bilhete=n_bilhete
            )
        except AlunoOficial.DoesNotExist:
            raise serializers.ValidationError("Aluno não encontrado ou dados incorretos.")

        # Verifica se já ativou conta
        if aluno.user:
            raise serializers.ValidationError("Este aluno já possui conta ativa.")

        data["aluno_instance"] = aluno
        return data
    
    def create(self, validated_data):
        aluno_oficial = validated_data["aluno_instance"]
        email = validated_data["email"]
        password = validated_data["password"]

        # Cria o User
        user = User.objects.create_user(
            username=aluno_oficial.n_processo,
            email=email,
            password=password
        )

        # Adiciona ao grupo Aluno
        grupo_aluno, _ = Group.objects.get_or_create(name="Aluno")
        user.groups.add(grupo_aluno)

        # Associa ao AlunoOficial
        aluno_oficial.user = user
        aluno_oficial.save()

        # Cria o perfil Aluno
        Aluno.objects.create(
            user=user,
            aluno_oficial=aluno_oficial,
        )

        # Auditoria
        AuditLog.objects.create(
            usuario=user,
            acao="create",
            modelo="User",
            objeto_id=user.id,
            alteracoes={
                "n_processo": aluno_oficial.n_processo,
                "email": email
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