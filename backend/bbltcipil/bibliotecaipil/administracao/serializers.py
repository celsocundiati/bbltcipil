from rest_framework import serializers
from livros.models import Reserva, Emprestimo, Aluno, Autor, Categoria, Livro
from .models import AuditLog, AlunoOficial
from django.contrib.auth.models import User


class ReservaAdminSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="livro.titulo", read_only=True)
    aluno_nome = serializers.CharField(source="aluno.user.username", read_only=True)  # Melhor referência
    data_formatada = serializers.DateTimeField(format="%d/%m/%Y", source='data_reserva', read_only=True)
    hora_formatada = serializers.DateTimeField(format="%H:%M:%S", source='data_reserva', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'


class EmprestimoAdminSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="reserva.livro.titulo", read_only=True)
    aluno_nome = serializers.CharField(source="reserva.aluno.user.username", read_only=True)

    class Meta:
        model = Emprestimo
        fields = '__all__'


class AlunoAdminSerializer(serializers.ModelSerializer):
    # Campos herdados do AlunoOficial
    n_processo = serializers.CharField(
        source="aluno_oficial.n_processo",
        read_only=True
    )
    nome_completo = serializers.CharField(
        source="aluno_oficial.nome_completo",
        read_only=True
    )
    curso = serializers.CharField(
        source="aluno_oficial.curso",
        read_only=True
    )
    classe = serializers.CharField(
        source="aluno_oficial.classe",
        read_only=True
    )
    data_nascimento = serializers.DateField(
        source="aluno_oficial.data_nascimento",
        read_only=True
    )
    email = serializers.CharField(source="user.email", read_only=True)
    
    class Meta:
        model = Aluno
        fields = '__all__'


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


class AuditLogSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = AuditLog
        fields = ["id", "usuario", "usuario_nome", "acao", "modelo", "objeto_id", "alteracoes", "criado_em"]
        read_only_fields = fields


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
            "user",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

        