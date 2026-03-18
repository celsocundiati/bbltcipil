from rest_framework import serializers
from .models import AuditLog, Multa
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro
from accounts.models import Perfil, AlunoOficial, FuncionarioOficial

# --------------------------
# Reserva e Empréstimo
# --------------------------
class ReservaAdminSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="livro.titulo", read_only=True)
    usuario_nome = serializers.CharField(source="usuario.first_name", read_only=True)
    data_formatada = serializers.DateTimeField(format="%d/%m/%Y", source='data_reserva', read_only=True)
    hora_formatada = serializers.DateTimeField(format="%H:%M:%S", source='data_reserva', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'


class EmprestimoAdminSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="reserva.livro.titulo", read_only=True)
    usuario_nome = serializers.CharField(source="reserva.usuario.first_name", read_only=True)

    class Meta:
        model = Emprestimo
        fields = '__all__'


# --------------------------
# Perfil unificado
# --------------------------
class PerfilAdminSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    nome = serializers.SerializerMethodField()
    dados_oficiais = serializers.SerializerMethodField()

    class Meta:
        model = Perfil
        fields = [
            "id",
            "user",
            "tipo",
            "telefone",
            "estado",
            "n_reservas",
            "n_emprestimos",
            "nome",
            "dados_oficiais",
        ]

    def get_nome(self, obj):
        if hasattr(obj, "aluno_oficial"):
            return obj.aluno_oficial.nome_completo
        if hasattr(obj, "funcionario_oficial"):
            return obj.funcionario_oficial.nome
        return obj.user.username

    def get_user(self, obj):
        user = obj.user

        return {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }

    def get_dados_oficiais(self, obj):
        if obj.tipo == "aluno" and hasattr(obj, "aluno_oficial"):
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
        elif obj.tipo == "funcionario" and hasattr(obj, "funcionario_oficial"):
            fo = obj.funcionario_oficial
            return {
                "n_agente": fo.n_agente,
                "nome": fo.nome,
                "cargo": fo.cargo,
                "n_bilhete": fo.n_bilhete
            }
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
            "id", "usuario", "usuario_nome", "emprestimo",
            "motivo", "descricao", "valor", "estado",
            "data_criacao", "data_pagamento", "criado_por", "atualizado_em"
        ]
        read_only_fields = ["usuario", "estado", "data_criacao", "data_pagamento", "atualizado_em"]

    def validate_valor(self, value):
        if value <= 0:
            raise serializers.ValidationError("O valor da multa deve ser maior que zero.")
        return value

