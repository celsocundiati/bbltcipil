from rest_framework import serializers
from django.apps import apps
from django.utils import timezone
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Notificacao
from accounts.models import Perfil


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
        fields = "__all__"

    def get_estado_atual(self, obj):
        request = self.context.get("request")
        estado_global = obj.estado

        if not request or not request.user.is_authenticated:
            return estado_global

        user = request.user
        EmprestimoModel = apps.get_model("livros", "Emprestimo")

        # Verifica empréstimo do próprio usuário
        if EmprestimoModel.objects.filter(
            reserva__livro=obj,
            reserva__usuario=user,
            acoes__in=["ativo", "atrasado"]
        ).exists():
            return "Emprestado"

        # Verifica reserva do próprio usuário
        if Reserva.objects.filter(
            livro=obj,
            usuario=user,
            estado="reservado"
        ).exists():
            return "Reservado"

        if Reserva.objects.filter(
            livro=obj,
            usuario=user,
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
    usuario_nome = serializers.SerializerMethodField()
    livro_id = serializers.IntegerField(source="livro.id", read_only=True)
    data_formatada = serializers.DateTimeField(format="%d/%m/%Y", source='data_reserva', read_only=True)
    hora_formatada = serializers.DateTimeField(format="%H:%M:%S", source='data_reserva', read_only=True)
    estado_label = serializers.CharField(source="get_estado_display", read_only=True)
    informacao = serializers.ReadOnlyField()
    autor_nome = serializers.CharField(source='livro.autor.nome', read_only=True)

    class Meta:
        model = Reserva
        fields = '__all__'
        read_only_fields = ["usuario"]


    def get_usuario_nome(self, obj):
        # Tenta pegar o perfil; se não existir, retorna username
        perfil = getattr(obj.usuario, "perfil", None)
        if not perfil:
            return obj.usuario.username

        # Aluno oficial
        if perfil.tipo == "aluno" and hasattr(perfil, "aluno_oficial") and perfil.aluno_oficial:
            return perfil.aluno_oficial.nome_completo

        # Funcionário oficial
        if perfil.tipo == "funcionario" and hasattr(perfil, "funcionario_oficial") and perfil.funcionario_oficial:
            return perfil.funcionario_oficial.nome

        # Se nenhum oficial existir, retorna username
        return obj.usuario.username
    

    def validate(self, data):
        user = self.context["request"].user
        livro = data.get("livro")
        if Reserva.objects.filter(usuario=user, livro=livro, estado__in=["pendente", "reservado"]).exists():
            raise serializers.ValidationError({"livro": "Você já possui uma reserva ativa para este livro."})
        return data

    def create(self, validated_data):
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)


# ==============================
# EMPRÉSTIMO
# ==============================
class EmprestimoSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="reserva.livro.titulo", read_only=True)
    usuario_nome = serializers.CharField(source="reserva.usuario.first_name", read_only=True)
    capa = serializers.ReadOnlyField(source="reserva.livro.capa")
    autor_nome = serializers.CharField(source="reserva.livro.autor.nome", read_only=True)
    livro_id = serializers.IntegerField(source="reserva.livro.id", read_only=True)
    estado_reserva = serializers.CharField(source="reserva.estado", read_only=True)

    class Meta:
        model = Emprestimo
        fields = "__all__"

    def validate_data_devolucao(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("A data de devolução não pode ser inferior à data atual.")
        return value



# ==============================
# NOTIFICAÇÃO
# ==============================
class NotificacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacao
        fields = "__all__"
        read_only_fields = ["usuario", "criada_em", "lida"]


        