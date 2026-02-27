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
        format="%d/%m/%Y", source='data_reserva', read_only=True
    )
    hora_formatada = serializers.DateTimeField(
        format="%H:%M:%S", source='data_reserva', read_only=True
    )
    estado_label = serializers.CharField(source="get_estado_display", read_only=True)
    informacao = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(source='livro.autor.nome', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'
        read_only_fields = ["aluno"]

    def validate(self, data):
        """Valida duplicidade de reservas antes de criar"""
        user = self.context['request'].user
        try:
            aluno = Aluno.objects.get(user=user)
        except Aluno.DoesNotExist:
            raise serializers.ValidationError("Usuário não possui perfil de Aluno.")

        livro = data.get('livro')
        if Reserva.objects.filter(
            aluno=aluno, livro=livro, estado__in=['pendente', 'reservado']
        ).exists():
            raise serializers.ValidationError({
                "livro": "Você já possui uma reserva ativa para este livro."
            })
        return data

    def create(self, validated_data):
        """Preenche automaticamente o aluno logado"""
        validated_data['aluno'] = Aluno.objects.get(user=self.context['request'].user)
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

    class Meta:
        model = Aluno
        fields = [
            "n_processo",
            "nome_completo",
            "curso",
            "classe",
            "data_nascimento",
            "telefone",
            "estado",
            "n_reservas",
            "n_emprestimos",
        ]
        read_only_fields = [
            "estado",
            "n_reservas",
            "n_emprestimos",
        ]

# ==============================
# NOTIFICAÇÃO
# ==============================

class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = "__all__"
        read_only_fields = ["usuario", "criada_em", "lida"]