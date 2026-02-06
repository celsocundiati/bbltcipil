from rest_framework import serializers
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno

class LivroSerializer(serializers.ModelSerializer):
    estado_atual = serializers.ReadOnlyField()
    informacao_atual = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(source="autor.nome", read_only=True)
    categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)


    class Meta:
        model = Livro
        fields = '__all__'

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    capa = serializers.ReadOnlyField()
    livro = serializers.StringRelatedField()
    autor = serializers.StringRelatedField()
    aluno = serializers.StringRelatedField()
    estado_label = serializers.CharField(
        source="get_estado_display",
        read_only=True
    )
    informacao = serializers.ReadOnlyField()


    class Meta:
        model = Reserva
        fields = '__all__'

class EmprestimoSerializer(serializers.ModelSerializer):
    capa = serializers.ReadOnlyField()
    livro = serializers.StringRelatedField()
    autor = serializers.StringRelatedField()
    aluno = serializers.StringRelatedField()

    class Meta:
        model = Emprestimo
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'