from rest_framework import serializers
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno

class LivroSerializer(serializers.ModelSerializer):
    estado_atual = serializers.ReadOnlyField()
    informacao_atual = serializers.ReadOnlyField()
    autor = serializers.StringRelatedField()
    categoria = serializers.StringRelatedField()

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
    class Meta:
        model = Reserva
        fields = '__all__'

class EmprestimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emprestimo
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'