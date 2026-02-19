from rest_framework import serializers
from django.utils import timezone
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno


class LivroSerializer(serializers.ModelSerializer):
    estado_atual = serializers.SerializerMethodField()
    informacao_atual = serializers.SerializerMethodField()
    autor_nome = serializers.CharField(source="autor.nome", read_only=True)
    categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)

    class Meta:
        model = Livro
        fields = '__all__'

    def get_estado_atual(self, obj):
        request = self.context.get("request")

        # Estado global simples
        estado_global = obj.estado

        if not request or not request.user.is_authenticated:
            return estado_global

        try:
            aluno = Aluno.objects.get(user=request.user)
        except Aluno.DoesNotExist:
            aluno = None

        # Verifica empréstimo do próprio aluno
        if Emprestimo.objects.filter(
            reserva__livro=obj,
            reserva__aluno=aluno,
            acoes__in=["ativo", "atrasado"]
        ).exists():
            return "Emprestado"

        # Verifica reserva do próprio aluno
        if Reserva.objects.filter(
            livro=obj,
            aluno=aluno,
            estado__in=["reservado", "pendente"]
        ).exists():
            return "Reservado"

        return estado_global


    def get_informacao_atual(self, obj):
        estado = self.get_estado_atual(obj)

        info_map = {
            "Disponível": "Este livro está disponível para reserva",
            "Indisponível": "Livro indisponível no estoque",
            "Reservado": "Você possui uma reserva ativa",
            "Emprestado": "Livro emprestado a si",
        }

        return info_map.get(estado, "")


# class LivroSerializer(serializers.ModelSerializer):
#     estado_atual = serializers.ReadOnlyField()
#     informacao_atual = serializers.ReadOnlyField()
#     autor_nome = serializers.CharField(source="autor.nome", read_only=True)
#     categoria_nome = serializers.CharField(source="categoria.nome", read_only=True)

#     def validate_publicado_em(self, value):
#         hoje = timezone.now().date()

#         if value > hoje:
#             raise serializers.ValidationError(
#                 "A data de lançamento não pode ser superior à data atual."
#             )

#         return value
    
#     def validate_quantidade(self, value):
#         if value < 1:
#             raise serializers.ValidationError(
#                 "A quantidade deve ser no mínimo 1."
#             )
#         return value

#     class Meta:
#         model = Livro
#         fields = '__all__'


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
    aluno_nome = serializers.CharField(source="aluno.user.username", read_only=True)  # Melhor referência
    livro_id = serializers.IntegerField(source="livro.id", read_only=True)
    data_formatada = serializers.DateTimeField(format="%d/%m/%Y", source='data_reserva', read_only=True)
    hora_formatada = serializers.DateTimeField(format="%H:%M:%S", source='data_reserva', read_only=True)
    estado_label = serializers.CharField(source="get_estado_display", read_only=True)
    informacao = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(source='livro.autor.nome', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'


class EmprestimoSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="reserva.livro.titulo", read_only=True)
    aluno_nome = serializers.CharField(source="reserva.aluno.user.username", read_only=True)
    capa = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(source='reserva.livro.autor.nome', read_only=True)
    livro_id = serializers.IntegerField(source="reserva.livro.id", read_only=True)

    def validate_data_devolucao(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("A data de devolução não pode ser inferior à data atual.")
        return value

    class Meta:
        model = Emprestimo
        fields = '__all__'


class AlunoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    def validate_data_nascimento(self, value):
        hoje = timezone.now().date()

        if value > hoje:
            raise serializers.ValidationError(
                "A data de nascimento não pode ser superior à data atual."
            )

        return value

    class Meta:
        model = Aluno
        fields = '__all__'