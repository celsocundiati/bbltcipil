from rest_framework import serializers
from django.apps import apps
from django.utils import timezone
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Aluno, Notificacao


# ==============================
# LIVRO
# ==============================

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
        estado_global = obj.estado

        if not request or not request.user.is_authenticated:
            return estado_global

        try:
            aluno = Aluno.objects.get(user=request.user)
        except Aluno.DoesNotExist:
            return estado_global

        EmprestimoModel = apps.get_model('livros', 'Emprestimo')

        # Verifica empréstimo do próprio aluno
        if EmprestimoModel.objects.filter(
            reserva__livro=obj,
            reserva__aluno=aluno,
            acoes__in=["ativo", "atrasado"]
        ).exists():
            return "Emprestado"

        # Verifica reserva do próprio aluno
        if Reserva.objects.filter(
            livro=obj,
            aluno=aluno,
            estado="reservado"
        ).exists():
            return "Reservado"

        if Reserva.objects.filter(
            livro=obj,
            aluno=aluno,
            estado="pendente"
        ).exists():
            return "Pendente"

        return estado_global

    def get_informacao_atual(self, obj):
        estado = self.get_estado_atual(obj)

        info_map = {
            "Disponível": "Este livro está disponível para reserva",
            "Indisponível": "Livro indisponível no estoque",
            "Reservado": "Você possui uma reserva ativa",
            "Pendente": "Aguardando aprovação",
            "Emprestado": "Livro emprestado a si",
        }

        return info_map.get(estado, "")


# ==============================
# AUTOR
# ==============================

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = '__all__'


# ==============================
# CATEGORIA
# ==============================

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


# ==============================
# RESERVA
# ==============================

class ReservaSerializer(serializers.ModelSerializer):
    capa = serializers.ReadOnlyField()
    livro_nome = serializers.CharField(source="livro.titulo", read_only=True)
    aluno_nome = serializers.CharField(source="aluno.user.username", read_only=True)
    livro_id = serializers.IntegerField(source="livro.id", read_only=True)
    data_formatada = serializers.DateTimeField(
        format="%d/%m/%Y",
        source='data_reserva',
        read_only=True
    )
    hora_formatada = serializers.DateTimeField(
        format="%H:%M:%S",
        source='data_reserva',
        read_only=True
    )
    estado_label = serializers.CharField(
        source="get_estado_display",
        read_only=True
    )
    informacao = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(
        source='livro.autor.nome',
        read_only=True
    )

    class Meta:
        model = Reserva
        fields = '__all__'
        read_only_fields = ["aluno"]

    
    def create(self, validated_data):
        # Garante que a reserva recebe o aluno do usuário logado
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['aluno'] = Aluno.objects.get(user=request.user)
        return super().create(validated_data)


# ==============================
# EMPRÉSTIMO
# ==============================

class EmprestimoSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(
        source="reserva.livro.titulo",
        read_only=True
    )
    aluno_nome = serializers.CharField(
        source="reserva.aluno.user.username",
        read_only=True
    )
    capa = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(
        source='reserva.livro.autor.nome',
        read_only=True
    )
    livro_id = serializers.IntegerField(
        source="reserva.livro.id",
        read_only=True
    )

    class Meta:
        model = Emprestimo
        fields = '__all__'

    def validate_data_devolucao(self, value):
        hoje = timezone.now().date()

        if value < hoje:
            raise serializers.ValidationError(
                "A data de devolução não pode ser inferior à data atual."
            )

        return value


# ==============================
# ALUNO
# ==============================

class AlunoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )
    email = serializers.CharField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = Aluno
        fields = '__all__'
        read_only_fields = ["user"]

    def validate_data_nascimento(self, value):
        hoje = timezone.now().date()

        if value > hoje:
            raise serializers.ValidationError(
                "A data de nascimento não pode ser superior à data atual."
            )

        return value


# ==============================
# NOTIFICAÇÃO
# ==============================

class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = "__all__"
        read_only_fields = ["usuario", "criada_em", "lida"]