from rest_framework import serializers
from .models import Multa, ConfiguracaoSistema
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro, Exposicao, Evento, Participacao
from accounts.models import Perfil, AlunoOficial, FuncionarioOficial
from django.contrib.auth.models import User, Group
from audit.models import AuditLog
from django.db import transaction


# --------------------------
# Reserva e Empréstimo
# --------------------------
class ReservaAdminSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="livro.titulo", read_only=True)
    usuario_nome = serializers.CharField(source="usuario.first_name", read_only=True)
    data_formatada = serializers.DateTimeField(format="%d/%m/%Y", source='data_reserva', read_only=True)
    hora_formatada = serializers.DateTimeField(format="%H:%M:%S", source='data_reserva', read_only=True)
    usuario_grupos = serializers.SerializerMethodField()

    class Meta:
        model = Reserva
        fields = '__all__'

    def get_usuario_grupos(self, obj):
        """Retorna os grupos do usuário da reserva"""
        user = getattr(obj, "usuario", None)
        if not user:
            return []
        return list(user.groups.values_list("name", flat=True))


class EmprestimoAdminSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="reserva.livro.titulo", read_only=True)
    usuario_nome = serializers.CharField(source="reserva.usuario.first_name", read_only=True)

    class Meta:
        model = Emprestimo
        fields = "__all__"
        extra_kwargs = {
            "data_devolucao": {"required": False}
        }

    def validate(self, data):
        reserva = data.get("reserva")
        if not reserva:
            raise serializers.ValidationError("Reserva é obrigatória.")

        usuario = reserva.usuario
        if not usuario:
            raise serializers.ValidationError("Reserva sem usuário associado.")

        # 🔥 PEGAR GRUPOS DO USUÁRIO
        grupos = list(usuario.groups.values_list("name", flat=True))

        if "Funcionario" not in grupos:
            raise serializers.ValidationError(
                "Apenas usuários do grupo 'Funcionario' podem realizar empréstimos. Usuários comuns devem permanecer em reservas."
            )

        return data


# --------------------------
# Perfil unificado
# --------------------------

class PerfilAdminSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    nome = serializers.SerializerMethodField()
    dados_oficiais = serializers.SerializerMethodField()
    grupos = serializers.SerializerMethodField()

    class Meta:
        model = Perfil
        fields = [
            "id",
            "user",
            "grupos",
            "telefone",
            "estado",
            "n_reservas",
            "n_emprestimos",
            "nome",
            "dados_oficiais",
        ]

    def get_nome(self, obj):
        if hasattr(obj, "aluno_oficial") and obj.aluno_oficial:
            return obj.aluno_oficial.nome_completo
        elif hasattr(obj, "funcionario_oficial") and obj.funcionario_oficial:
            return obj.funcionario_oficial.nome
        return getattr(obj.user, "username", None)

    def get_user(self, obj):
        user = getattr(obj, "user", None)
        if not user:
            return {}
        return {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }

    def get_grupos(self, obj):
        """Retorna uma lista com os nomes dos grupos do usuário"""
        user = getattr(obj, "user", None)
        if not user:
            return []
        return list(user.groups.values_list("name", flat=True))

    def get_dados_oficiais(self, obj):
        grupos = self.get_grupos(obj)
        try:
            if "Aluno" in grupos and hasattr(obj, "aluno_oficial") and obj.aluno_oficial:
                ao = obj.aluno_oficial
                return {
                    "n_processo": ao.n_processo,
                    "nome_completo": ao.nome_completo,
                    "curso": ao.curso,
                    "classe": ao.classe,
                    "data_nascimento": ao.data_nascimento,
                    "idade": ao.idade,
                    "n_bilhete": ao.n_bilhete
                }
            elif "Funcionario" in grupos and hasattr(obj, "funcionario_oficial") and obj.funcionario_oficial:
                fo = obj.funcionario_oficial
                return {
                    "n_agente": fo.n_agente,
                    "nome": fo.nome,
                    "cargo": fo.cargo,
                    "n_bilhete": fo.n_bilhete
                }
        except Exception as e:
            return {"erro": str(e)}
        return {}


# --------------------------
# AuditLog
# --------------------------
class AuditLogSerializer(serializers.ModelSerializer):
    modelo_nome = serializers.SerializerMethodField()
    usuario_nome = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "usuario_nome",
            "acao",
            "modelo_nome",
            "objeto_id",
            "alteracoes",
            "origem",
            "ip_address",
            "trace_id",
            "criado_em"
        ]

    def get_modelo_nome(self, obj):
        return obj.modelo.model if obj.modelo else None

    def get_usuario_nome(self, obj):
        if obj.usuario:
            return obj.usuario.first_name or obj.usuario.username
        return "Sistema"


# --------------------------
# Autores, Categorias e Livros
# --------------------------
class AutorAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'


class CategoriaAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class LivroAdminSerializer(serializers.ModelSerializer):
    autor_nome = serializers.CharField(source="autor.nome", read_only=True)
    categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)

    class Meta:
        model = Livro
        fields = '__all__'


# --------------------------
# ALUNO OFICIAL
# --------------------------
class AlunoOficialAdminSerializer(serializers.ModelSerializer):
    idade = serializers.ReadOnlyField()

    class Meta:
        model = AlunoOficial
        fields = [
            "id",
            "n_processo",
            "nome_completo",
            "n_bilhete",
            "curso",
            "classe",
            "data_nascimento",
            "idade",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "idade"]


# --------------------------
# FUNCIONÁRIO OFICIAL
# --------------------------
class FuncionarioOficialAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuncionarioOficial
        fields = [
            "id",
            "n_agente",
            "nome",
            "n_bilhete",
            "cargo",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class MultaSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.ReadOnlyField(source="usuario.first_name")

    class Meta:
        model = Multa
        fields = [
            "id",
            "usuario",
            "usuario_nome",
            "emprestimo",
            "motivo",
            "valor",
            "estado",
            "data_criacao",
            "data_pagamento",
            "criado_por",
            "atualizado_em",
        ]

        read_only_fields = [
            "usuario",
            "estado",
            "data_criacao",
            "data_pagamento",
            "atualizado_em",
            "valor",
            "criado_por",
        ]
        

class ConfiguracaoSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoSistema
        fields = "__all__"

    def validate(self, data):
        if data["horario_semana_abertura"] >= data["horario_semana_fecho"]:
            raise serializers.ValidationError("Horário de semana inválido.")

        if data["horario_fim_semana_abertura"] >= data["horario_fim_semana_fecho"]:
            raise serializers.ValidationError("Horário de fim de semana inválido.")

        return data


class UserListSerializer(serializers.ModelSerializer):
    grupos_display = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_login",
            "is_active",
            "is_superuser",
            "is_staff",
            "grupos_display"
        ]

    def get_grupos_display(self, obj):
        return list(obj.groups.values_list("name", flat=True))


class PromoteUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    grupos = serializers.ListField(
        child=serializers.CharField(),
        required=True
    )

    ALLOWED_GROUPS = {"Admin", "Bibliotecario"}

    def validate(self, data):
        request = self.context["request"]
        admin = request.user

        username = data["username"]
        grupos = data["grupos"]

        if not admin.is_superuser and not admin.is_staff:
            raise serializers.ValidationError("Sem permissão.")

        invalid = set(grupos) - self.ALLOWED_GROUPS
        if invalid:
            raise serializers.ValidationError(f"Grupos inválidos: {invalid}")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Utilizador não encontrado.")

        data["user_instance"] = user
        return data

    def create(self, validated_data):
        user = validated_data["user_instance"]
        grupos = validated_data["grupos"]

        with transaction.atomic():
            groups = Group.objects.filter(name__in=grupos)

            user.groups.set(groups)
            user.is_staff = groups.exists()
            user.save()

        return user


# =============================
# EXPOSIÇÃO
# =============================
class ExposicaoAdminSerializer(serializers.ModelSerializer):
    vagas_disponiveis = serializers.SerializerMethodField()

    class Meta:
        model = Exposicao
        fields = "__all__"

    def get_vagas_disponiveis(self, obj):
        return obj.vagas_disponiveis()


# =============================
# EVENTO
# =============================
class EventoAdminSerializer(serializers.ModelSerializer):
    vagas_disponiveis = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = "__all__"

    def get_vagas_disponiveis(self, obj):
        return obj.vagas_disponiveis()


# =============================
# PARTICIPAÇÃO
# =============================
class ParticipacaoAdminSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source="usuario.username", read_only=True)
    alvo = serializers.SerializerMethodField()

    class Meta:
        model = Participacao
        fields = "__all__"

    def get_alvo(self, obj):
        if obj.evento:
            return f"Evento: {obj.evento.titulo}"
        if obj.exposicao:
            return f"Exposição: {obj.exposicao.titulo}"
        return None
    





