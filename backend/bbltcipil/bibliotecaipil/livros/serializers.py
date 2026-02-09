from rest_framework import serializers
from django.utils import timezone
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno

class LivroSerializer(serializers.ModelSerializer):
    estado_atual = serializers.ReadOnlyField()
    informacao_atual = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(source="autor.nome", read_only=True)
    categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)

    def validate_publicado_em(self, value):
        hoje = timezone.now().date()

        if value > hoje:
            raise serializers.ValidationError(
                "A data de lançamento não pode ser superior à data atual."
            )

        return value
    
    def validate_quantidade(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "A quantidade deve ser no mínimo 1."
            )
        return value

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
    livro_nome = serializers.CharField(source="livro.titulo", read_only=True)
    aluno_nome = serializers.StringRelatedField(source="aluno.nome", read_only=True)
    estado_label = serializers.CharField(
        source="get_estado_display",
        read_only=True
    )
    informacao = serializers.ReadOnlyField()

    class Meta:
        model = Reserva
        fields = '__all__'

class EmprestimoSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="livro.titulo", read_only=True)
    aluno_nome = serializers.CharField(source="aluno.nome", read_only=True)
    capa = serializers.ReadOnlyField()

    
    def validate_data_devolucao(self, value):
        hoje = timezone.now().date()

        if value < hoje:
            raise serializers.ValidationError(
                "A data de devolução não pode ser inferior à data atual."
            )

        return value

    class Meta:
        model = Emprestimo
        fields = '__all__'

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'