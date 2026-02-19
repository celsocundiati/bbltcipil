from rest_framework import serializers
from livros.models import Reserva, Emprestimo, Aluno, Autor, Categoria, Livro

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
    username = serializers.CharField(source="user.username", read_only=True)
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
