from rest_framework import serializers
from .models import AuditLog, Multa, ConfiguracaoSistema
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro
from accounts.models import Perfil, AlunoOficial, FuncionarioOficial
from django.contrib.auth.models import User, Group



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
    usuario_nome = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = AuditLog
        fields = ["id", "usuario", "usuario_nome", "acao", "modelo", "objeto_id", "alteracoes", "criado_em"]
        read_only_fields = fields


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


class UserAdminSerializer(serializers.ModelSerializer):
    grupos = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    grupos_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "password",
            "is_active",
            "is_superuser",
            "last_login",
            "grupos",
            "grupos_display"
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def get_grupos_display(self, obj):
        return list(obj.groups.values_list("name", flat=True))

    # VALIDAÇÃO CENTRAL (CRIAÇÃO + UPDATE)
    def validate(self, data):
        request = self.context["request"]
        user = request.user

        grupos = data.get("grupos", [])
        is_superuser = data.get("is_superuser", False)

        # Bibliotecário não pode criar nem editar
        if user.groups.filter(name="Bibliotecario").exists():
            raise serializers.ValidationError(
                "Bibliotecários não têm permissão para criar ou editar usuários."
            )

        # Admin não pode criar/editar superuser
        if not user.is_superuser and is_superuser:
            raise serializers.ValidationError(
                "Apenas superusuário pode criar superusers."
            )

        # Admin não pode atribuir grupo Superuser
        if not user.is_superuser and "Superuser" in grupos:
            raise serializers.ValidationError(
                "Você não pode atribuir esse nível de permissão."
            )

        # Admin só pode criar/editar Bibliotecário
        if not user.is_superuser and grupos:
            allowed = {"Bibliotecario"}
            for g in grupos:
                if g not in allowed:
                    raise serializers.ValidationError(
                        "Admin só pode criar ou editar Bibliotecários."
                    )

        return data

    def create(self, validated_data):
        grupos = validated_data.pop("grupos", [])
        password = validated_data.pop("password", None)
        is_superuser = validated_data.get("is_superuser", False)

        user = User(**validated_data)

        if not password:
            raise serializers.ValidationError("Password é obrigatório")

        user.set_password(password)

        # Superuser
        if is_superuser:
            user.is_superuser = True
            user.is_staff = True
        else:
            # Admin e Bibliotecário
            user.is_superuser = False
            user.is_staff = True

        user.save()

        # Grupos
        for grupo_nome in grupos:
            try:
                grupo = Group.objects.get(name=grupo_nome)
                user.groups.add(grupo)
            except Group.DoesNotExist:
                raise serializers.ValidationError(f"Grupo '{grupo_nome}' não existe")

        return user

    def update(self, instance, validated_data):
        grupos = validated_data.pop("grupos", None)
        password = validated_data.pop("password", None)

        request = self.context["request"]
        user = request.user

        # Bloquear bibliotecário
        if user.groups.filter(name="Bibliotecario").exists():
            raise serializers.ValidationError(
                "Bibliotecários não têm permissão para editar usuários."
            )

        # Admin não pode promover para superuser
        if not user.is_superuser and validated_data.get("is_superuser"):
            raise serializers.ValidationError(
                "Apenas superusuário pode promover usuários a superusuário."
            )

        # Admin só pode editar Bibliotecário
        if not user.is_superuser and grupos:
            allowed = {"Bibliotecario"}
            for g in grupos:
                if g not in allowed:
                    raise serializers.ValidationError(
                        "Admin só pode editar Bibliotecários."
                    )

        # UPDATE NORMAL
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        # Superuser sempre é staff
        if instance.is_superuser:
            instance.is_staff = True

        instance.save()

        # UPDATE GRUPOS
        if grupos is not None:
            instance.groups.clear()
            for grupo_nome in grupos:
                try:
                    grupo = Group.objects.get(name=grupo_nome)
                    instance.groups.add(grupo)
                except Group.DoesNotExist:
                    raise serializers.ValidationError(f"Grupo '{grupo_nome}' não existe")

        return instance

