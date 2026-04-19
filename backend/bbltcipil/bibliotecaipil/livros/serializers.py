from rest_framework import serializers
from django.apps import apps
from django.utils import timezone
from .models import Livro, Autor, Categoria, Reserva, Emprestimo, Notificacao, Exposicao, Evento, Participacao


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
        
        if Reserva.objects.filter(
            livro=obj,
            usuario=user,
            estado="em_uso"
        ).exists():
            return "Em uso"

        return estado_global

    def get_informacao_atual(self, obj):
        estado = self.get_estado_atual(obj)
        info_map = {
            "Disponível": "Este livro está disponível para reserva",
            "Indisponível": "Livro indisponível no estoque",
            "Reservado": "Você possui uma reserva ativa",
            "Em uso": "Livro sendo utilizado",
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
        user = obj.usuario
        grupos = getattr(user, "grupos", [])

        # Admin ou Bibliotecario
        if "Admin" in grupos or "Bibliotecario" in grupos:
            return f"{user.first_name} {user.last_name}".strip() or user.username

        # Outros usuários (aluno)
        return getattr(user, "username", "Desconhecido")

    def validate(self, data):
        user = self.context["request"].user
        livro = data.get("livro")

        # 🔥 BLOQUEIO: usuário sem grupos
        grupos = getattr(user, "grupos", [])
        if not grupos:
            raise serializers.ValidationError(
                {"usuario": "Usuário sem grupos associados. Não é permitido realizar reservas."}
            )

        # 🔥 REGRA EXISTENTE (reserva duplicada)
        if Reserva.objects.filter(
            usuario=user,
            livro=livro,
            estado__in=["pendente", "reservado", "em_uso"]
        ).exists():
            raise serializers.ValidationError(
                {"livro": "Você já possui uma reserva ativa para este livro."}
            )

        return data

    def create(self, validated_data):
        validated_data["usuario"] = self.context["request"].user
        return super().create(validated_data)


# ==============================
# EMPRÉSTIMO
# ==============================
class EmprestimoSerializer(serializers.ModelSerializer):
    livro_nome = serializers.CharField(source="reserva.livro.titulo", read_only=True)
    usuario_nome = serializers.SerializerMethodField()
    capa = serializers.ReadOnlyField(source="reserva.livro.capa")
    autor_nome = serializers.CharField(source="reserva.livro.autor.nome", read_only=True)
    livro_id = serializers.IntegerField(source="reserva.livro.id", read_only=True)
    estado_reserva = serializers.CharField(source="reserva.estado", read_only=True)

    class Meta:
        model = Emprestimo
        fields = "__all__"

    def get_usuario_nome(self, obj):
        user = obj.reserva.usuario
        grupos = getattr(user, "grupos", [])

        # Admin ou Bibliotecario
        if "Admin" in grupos or "Bibliotecario" in grupos:
            return f"{user.first_name} {user.last_name}".strip() or user.username

        # Outros usuários (aluno)
        return getattr(user, "username", "Desconhecido")

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


class ExposicaoSerializer(serializers.ModelSerializer):
    vagas_disponiveis = serializers.SerializerMethodField()
    descricao_estado = serializers.SerializerMethodField()

    class Meta:
        model = Exposicao
        fields = '__all__'

    def get_vagas_disponiveis(self, obj):
        return obj.vagas_disponiveis()

    def get_descricao_estado(self, obj):
        return obj.dscricao_estado()


class EventoSerializer(serializers.ModelSerializer):
    vagas_disponiveis = serializers.SerializerMethodField()
    descricao_estado = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = '__all__'

    def get_vagas_disponiveis(self, obj):
        return obj.vagas_disponiveis()

    def get_descricao_estado(self, obj):
        return obj.dscricao_estado()
    


class ParticipacaoSerializer(serializers.ModelSerializer):
    exposicao = ExposicaoSerializer(read_only=True)
    evento = EventoSerializer(read_only=True)

    class Meta:
        model = Participacao
        fields = '__all__'
        read_only_fields = ['usuario', 'data_registro']

    def create(self, validated_data):
        usuario = self.context['request'].user
        exposicao = validated_data['exposicao']

        from .service import reservar_exposicao, reservar_evento
        return reservar_exposicao(usuario, exposicao.id)  
        return reservar_evento(usuario, evento.id)
    

    