from rest_framework import serializers
from django.utils import timezone
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno
from django.contrib.auth.models import User, Group

class RegistarAlunoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Aluno
        fields = ['username', 'email', 'password', 'n_processo', 'curso', 'classe', 'data_nascimento', 'telefone']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email')

        # Cria User usando create_user (senha já criptografada)
        user = User.objects.create_user(username=username, email=email, password=password)

        # Adiciona ao grupo "Aluno"
        grupo_aluno, created = Group.objects.get_or_create(name='Aluno')
        user.groups.add(grupo_aluno)

        # Cria Aluno vinculado
        aluno = Aluno.objects.create(user=user, **validated_data)

        return aluno


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
    aluno_nome = serializers.CharField(source="aluno.user.username", read_only=True)  # Melhor referência
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