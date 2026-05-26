from rest_framework import serializers
from .models import Multa, ConfiguracaoSistema
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro, Exposicao, Evento, Participacao
from accounts.models import Perfil, AlunoOficial, FuncionarioOficial
from django.contrib.auth.models import User, Group
from audit.models import AuditLog
from django.db import transaction
import re
from datetime import date



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
            "is_active": user.is_active,
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

    def validate_nome(self, value):
        value = value.strip()

        if not re.match(r'^[A-Za-zÀ-ÿ\s]{5,100}$', value):
            raise serializers.ValidationError(
                "Nome inválido."
            )

        # bloqueia repetições
        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Nome inválido."
            )

        return value.title()

    def validate_nacionalidade(self, value):
        value = value.strip()

        if not re.match(r'^[A-Za-zÀ-ÿ\s]{3,40}$', value):
            raise serializers.ValidationError(
                "Nacionalidade inválida."
            )

        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Nacionalidade inválida."
            )

        return value.title()


class CategoriaAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

    def validate_nome(self, value):
        value = value.strip()

        # apenas letras e espaços
        if not re.match(r'^[A-Za-zÀ-ÿ\s]{3,50}$', value):
            raise serializers.ValidationError(
                "O nome deve conter apenas letras e entre 3 e 50 caracteres."
            )

        # impede nomes completos
        palavras = value.split()
        if len(palavras) > 3:
            raise serializers.ValidationError(
                "Categoria inválida. Evite nomes completos."
            )

        # bloqueia repetições tipo kkkk
        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Categoria inválida."
            )

        # exige ao menos uma vogal
        if not re.search(r'[aeiouáéíóúàèìòùãõ]', value.lower()):
            raise serializers.ValidationError(
                "Categoria inválida."
            )

        return value.title()


    def validate_descricao(self, value):
        value = value.strip()

        # tamanho
        if len(value) < 10 or len(value) > 250:
            raise serializers.ValidationError(
                "A descrição deve ter entre 10 e 250 caracteres."
            )

        # precisa conter letras
        if not re.search(r'[A-Za-zÀ-ÿ]', value):
            raise serializers.ValidationError(
                "A descrição deve conter texto válido."
            )

        # bloqueia repetições
        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Descrição inválida."
            )

        return value


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
    grupos = serializers.ListField(child=serializers.CharField(), required=False)
    is_superuser = serializers.BooleanField(required=False, default=False)

    ALLOWED_GROUPS = {"Admin", "Bibliotecario"}

    def validate(self, data):
        request = self.context["request"]

        if not request.user.is_superuser:
            raise serializers.ValidationError("Sem permissão.")

        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Utilizador não encontrado.")

        data["user_instance"] = user
        return data

    def update(self, instance, validated_data):
        grupos = validated_data.get("grupos", None)
        is_superuser = validated_data.get("is_superuser", None)

        with transaction.atomic():

            # 🔥 SUPERUSER
            if is_superuser is not None:
                instance.is_superuser = is_superuser
                instance.is_staff = is_superuser or instance.is_staff

            # 🔥 GRUPOS (SÓ SE FOREM ENVIADOS)
            if grupos is not None:
                invalid = set(grupos) - self.ALLOWED_GROUPS
                if invalid:
                    raise serializers.ValidationError(f"Grupos inválidos: {invalid}")

                new_groups = Group.objects.filter(name__in=grupos)

                # ⚠️ NÃO destruir tudo, apenas gerir admin roles
                admin_groups = Group.objects.filter(
                    name__in=self.ALLOWED_GROUPS
                )

                # remove apenas grupos administrativos antigos
                instance.groups.remove(*admin_groups)

                # adiciona novos
                instance.groups.add(*new_groups)

            instance.is_staff = instance.is_superuser or instance.groups.exists()
            instance.save()

        return instance  


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

    def validate_titulo(self, value):
        value = value.strip()

        if len(value) < 5 or len(value) > 100:
            raise serializers.ValidationError(
                "Título deve ter entre 5 e 100 caracteres."
            )

        # bloqueia repetições
        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Título inválido."
            )

        # precisa ter pelo menos uma vogal
        if not re.search(r'[aeiouáéíóúãõ]', value.lower()):
            raise serializers.ValidationError(
                "Título inválido."
            )

        return value.title()


    def validate_descricao(self, value):
        value = value.strip()

        if len(value) < 10 or len(value) > 500:
            raise serializers.ValidationError(
                "Descrição inválida."
            )

        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Descrição inválida."
            )

        return value


    def validate_local(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError(
                "Local inválido."
            )

        if re.match(r'^(.)\1+$', value.lower()):
            raise serializers.ValidationError(
                "Local inválido."
            )

        return value.title()


    def validate(self, data):
        if data["data_inicio"] < date.today():
            raise serializers.ValidationError({
                "data_inicio":
                "A data inicial não pode ser anterior a hoje."
            })

        if data["data_fim"] < data["data_inicio"]:
            raise serializers.ValidationError({
                "data_fim":
                "A data final não pode ser menor que a inicial."
            })

        if data["capacidade_maxima"] <= 0:
            raise serializers.ValidationError({
                "capacidade_maxima":
                "Capacidade inválida."
            })

        return data
    

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
    



