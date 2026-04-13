from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import Count, Sum, Q
from django.db.models.functions import ExtractMonth
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.timezone import now
from datetime import timedelta
from audit.models import AuditLog
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro
from accounts.models import AlunoOficial, FuncionarioOficial, Perfil
from .models import Multa, ConfiguracaoSistema
from .serializers import (
    ReservaAdminSerializer, EmprestimoAdminSerializer, AutorAdminSerializer,
    CategoriaAdminSerializer, LivroAdminSerializer, AuditLogSerializer,
    AlunoOficialAdminSerializer, FuncionarioOficialAdminSerializer,
    PerfilAdminSerializer, MultaSerializer, ConfiguracaoSistemaSerializer,
    UserAdminSerializer
)
from .service import calcular_valor_multa, criar_emprestimo, devolver_emprestimo, aprovar_reserva, cancelar_reserva_admin, finalizar_reserva, remover_reserva
from .permissions import SistemaPermission, OnlySuperUser
from audit.services import AuditService
from django.http import HttpResponse
import csv


User = get_user_model()


# -----------------------------
# LIVROS
# -----------------------------
class LivroAdminViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.select_related("autor", "categoria").all()
    serializer_class = LivroAdminSerializer
    permission_classes = [SistemaPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['titulo', 'isbn', 'categoria__nome', 'autor__nome']
    ordering_fields = ['publicado_em', 'titulo', 'isbn', 'estado']
    ordering = ['publicado_em']

    def _audit(self, livro, action):
        AuditService.log(
            user=self.request.user,
            action=action,
            instance=livro,
            extra={"titulo": livro.titulo, "autor": livro.autor.nome}
        )

    def perform_create(self, serializer):
        livro = serializer.save()
        self._audit(livro, "Criou")

    def perform_update(self, serializer):
        livro = serializer.save()
        self._audit(livro, "Atualizou")

    def perform_destroy(self, instance):
        self._audit(instance, "Removeu")
        instance.delete()


# -----------------------------
# RESERVAS
# -----------------------------
class ReservaAdminViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related("usuario", "livro").all()
    serializer_class = ReservaAdminSerializer
    permission_classes = [SistemaPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['usuario__first_name', 'livro__titulo']
    ordering_fields = ['data_reserva', 'livro__titulo', 'estado']
    ordering = ['-data_reserva']

    def update(self, request, *args, **kwargs):
        raise ValidationError({"detail": "Use ações específicas: aprovar, finalizar ou cancelar."})

    def partial_update(self, request, *args, **kwargs):
        raise ValidationError({"detail": "Use ações específicas: aprovar, finalizar ou cancelar."})

    def _log_reserva(self, reserva, action):
        AuditService.log(
            user=self.request.user,
            action=action,
            instance=reserva,
            extra={"livro": reserva.livro.titulo, "usuario": reserva.usuario.first_name, "estado": reserva.estado}
        )

    @action(detail=True, methods=["post"])
    def aprovar(self, request, pk=None):
        reserva = self.get_object()

        aprovar_reserva(reserva, request.user)

        self._log_reserva(reserva, "Aprovou")

        return Response({"status": "Reserva aprovada com sucesso"})


    @action(detail=True, methods=["post"])
    def finalizar(self, request, pk=None):
        reserva = self.get_object()

        finalizar_reserva(reserva)

        self._log_reserva(reserva, "Finalizou")

        return Response({"status": "Reserva finalizada com sucesso"})


    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()

        cancelar_reserva_admin(reserva, request.user)

        self._log_reserva(reserva, "Cancelou")

        return Response({"status": "Reserva cancelada com sucesso"})


    def destroy(self, request, *args, **kwargs):
        reserva = self.get_object()

        remover_reserva(reserva, request.user)

        self._log_reserva(reserva, "Removeu")

        return Response(status=status.HTTP_204_NO_CONTENT)


# -----------------------------
# EMPRÉSTIMOS
# -----------------------------
class EmprestimoAdminViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.select_related("reserva", "reserva__usuario", "reserva__livro").prefetch_related("multas").all()
    serializer_class = EmprestimoAdminSerializer
    permission_classes = [SistemaPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['acoes']
    search_fields = ['reserva__usuario__first_name', 'reserva__livro__titulo']
    ordering_fields = ['data_emprestimo', 'acoes']
    ordering = ['-data_emprestimo']

    def perform_create(self, serializer):
        reserva = serializer.validated_data.get("reserva")
        if not reserva:
            raise ValidationError({"detail": "Reserva é obrigatória."})
        with transaction.atomic():
            emprestimo = criar_emprestimo(reserva=reserva, admin_user=self.request.user)
            AuditService.log(
                user=self.request.user,
                action="Criou",
                instance=emprestimo,
                extra={
                    "livro": emprestimo.reserva.livro.titulo,
                    "nome": emprestimo.reserva.usuario.first_name,
                    "data_devolucao": str(emprestimo.data_devolucao),
                    "estado": emprestimo.acoes
                }
            )

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.acoes == "devolvido":
            raise ValidationError({"detail": "Empréstimo já devolvido não pode ser alterado."})
        emprestimo = serializer.save()
        AuditService.log(
            user=self.request.user,
            action="Atualizou",
            instance=emprestimo,
            extra={
                "livro": emprestimo.reserva.livro.titulo,
                "nome": emprestimo.reserva.usuario.first_name,
                "data_devolucao": str(emprestimo.data_devolucao),
                "estado": emprestimo.acoes
            }
        )

    @action(detail=True, methods=["post"])
    def devolver(self, request, pk=None):
        emprestimo = self.get_object()
        if emprestimo.acoes == "devolvido":
            return Response({"detail": "Este empréstimo já foi devolvido."}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            devolver_emprestimo(emprestimo)
            AuditService.log(
                user=request.user,
                action="Devolveu",
                instance=emprestimo,
                extra={
                    "livro": emprestimo.reserva.livro.titulo,
                    "nome": emprestimo.reserva.usuario.first_name,
                    "estado": emprestimo.acoes,
                }
            )
        return Response({"success": True, "message": "Devolução realizada com sucesso.", "id": emprestimo.id})

    def perform_destroy(self, instance):
        AuditService.log(
            user=self.request.user,
            action="Cancelou",
            instance=instance,
            extra={
                "livro": instance.reserva.livro.titulo,
                "nome": instance.reserva.usuario.first_name
            }
        )
        instance.delete()


# ---------------------------------------------
# AUTOR & CATEGORIA (BaseAdmin para DRY)
# ---------------------------------------------
class BaseAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [SistemaPermission]

    def _log(self, instance, action, extra_fields):
        AuditService.log(user=self.request.user, action=action, instance=instance, extra=extra_fields)

    def perform_create(self, serializer):
        obj = serializer.save()
        self._log(obj, "Adicionou", {f"{self.model_name}": str(obj), **self.extra_fields(obj)})

    def perform_update(self, serializer):
        obj = serializer.save()
        self._log(obj, "Atualizou", {f"{self.model_name}": str(obj), **self.extra_fields(obj)})

    def perform_destroy(self, instance):
        self._log(instance, "Removeu", {f"{self.model_name}": str(instance), **self.extra_fields(instance)})
        instance.delete()


class AutorAdminViewSet(BaseAdminViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorAdminSerializer
    model_name = "autor"

    def extra_fields(self, obj):
        return {"nacionalidade": obj.nacionalidade}


class CategoriaAdminViewSet(BaseAdminViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaAdminSerializer
    model_name = "categoria"

    def extra_fields(self, obj):
        return {"descricao": obj.descricao}

# -----------------------------
# MULTAS
# -----------------------------
class MultaViewSet(viewsets.ModelViewSet):
    queryset = Multa.objects.select_related(
        "emprestimo", "emprestimo__reserva", "emprestimo__reserva__usuario"
    ).all()
    serializer_class = MultaSerializer
    permission_classes = [SistemaPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['usuario__first_name', 'emprestimo__reserva__livro__titulo']
    ordering_fields = ['data_criacao', 'emprestimo__reserva__livro__titulo', 'estado']
    ordering = ['-data_criacao']

    def perform_create(self, serializer):
        emprestimo = serializer.validated_data.get("emprestimo")
        motivo = serializer.validated_data.get("motivo")
        if not emprestimo:
            raise ValidationError({"detail": "Empréstimo é obrigatório."})
        if motivo in ["Dano", "Perda"] and Multa.objects.filter(emprestimo=emprestimo, motivo=motivo).exists():
            raise ValidationError({"detail": f"Já existe multa de {motivo} para este empréstimo."})
        total_multas = Multa.objects.filter(emprestimo=emprestimo).exclude(motivo="Atraso").count()
        if total_multas >= 2:
            raise ValidationError({"detail": "Este empréstimo já atingiu o limite de multas."})
        valor = calcular_valor_multa(emprestimo, motivo)
        multa = serializer.save(valor=valor, criado_por=self.request.user)
        AuditService.log(
            user=self.request.user,
            action="Criou multa",
            instance=multa,
            extra={"emprestimo": emprestimo.id, "motivo": motivo, "valor": valor}
        )

    @action(detail=False, methods=["get"])
    def emprestimos_disponiveis(self, request):
        emprestimos = Emprestimo.objects.filter(
            acoes__in=["ativo", "atrasado"]
        ).exclude(
            multas__motivo__in=["Dano", "Perda"]
        ).select_related("reserva", "reserva__usuario", "reserva__livro").distinct()
        data = [
            {
                "id": e.id,
                "usuario": e.reserva.usuario.first_name,
                "livro": str(e.reserva.livro),
                "estado": e.acoes,
                "data_devolucao": e.data_devolucao,
                "multas_total": e.multas.count(),
                "tem_multa_grave": e.multas.filter(motivo__in=["Dano", "Perda"]).exists(),
            }
            for e in emprestimos
        ]
        return Response(data)

    @action(detail=True, methods=["post"])
    def pagar(self, request, pk=None):
        multa = self.get_object()
        if multa.estado == "Pago":
            return Response({"status": "Já paga"}, status=400)
        multa.marcar_como_pago()
        AuditService.log(user=request.user, action="Pagou multa", instance=multa)
        return Response({"status": "Multa paga com sucesso"})

    @action(detail=True, methods=["post"])
    def dispensar(self, request, pk=None):
        multa = self.get_object()
        if multa.estado == "Pago":
            return Response({"error": "Não pode dispensar multa já paga"}, status=400)
        multa.dispensar()
        AuditService.log(user=request.user, action="Dispensou multa", instance=multa)
        return Response({"status": "Multa dispensada"})


# -----------------------------
# CONFIGURAÇÕES DO SISTEMA
# -----------------------------
class ConfiguracaoSistemaViewSet(viewsets.ViewSet):

    def get_object(self):
        obj, created = ConfiguracaoSistema.objects.get_or_create(id=1)
        return obj

    def list(self, request):
        config = self.get_object()
        serializer = ConfiguracaoSistemaSerializer(config)
        return Response(serializer.data)

    def create(self, request):
        config = self.get_object()
        serializer = ConfiguracaoSistemaSerializer(config, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        config = self.get_object()
        serializer = ConfiguracaoSistemaSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# ALUNO OFICIAL
# -----------------------------
class AlunoOficialAdminViewSet(viewsets.ModelViewSet):
    queryset = AlunoOficial.objects.all()
    serializer_class = AlunoOficialAdminSerializer
    permission_classes = [SistemaPermission]

    def perform_create(self, serializer):
        aluno = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=aluno)

    def perform_update(self, serializer):
        aluno = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=aluno)

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance)
        instance.delete()


# -----------------------------
# FUNCIONÁRIO OFICIAL
# -----------------------------
class FuncionarioOficialAdminViewSet(viewsets.ModelViewSet):
    queryset = FuncionarioOficial.objects.all()
    serializer_class = FuncionarioOficialAdminSerializer
    permission_classes = [SistemaPermission]

    def perform_create(self, serializer):
        funcionario = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=funcionario)

    def perform_update(self, serializer):
        funcionario = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=funcionario)

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance)
        instance.delete()


# --------------------------------------
# PERFIL UNIFICADO (ALUNO + FUNCIONÁRIO)
# --------------------------------------
class PerfilAdminViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.select_related('aluno_oficial', 'funcionario_oficial', 'user').all()
    serializer_class = PerfilAdminSerializer
    permission_classes = [SistemaPermission]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['user__first_name', 'user__username', 'funcionario_oficial__cargo']
    ordering_fields = ['user__first_name', 'n_reservas', 'n_emprestimos']
    ordering = ['user__first_name']


# ----------------------------------
# AUDIT LOG (READ ONLY) COM PESQUISA
# ----------------------------------
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-criado_em')
    serializer_class = AuditLogSerializer
    permission_classes = [OnlySuperUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['acao', 'modelo']
    search_fields = ['usuario__username', 'usuario__first_name']
    ordering_fields = ['criado_em', 'usuario__username', 'acao']
    ordering = ['-criado_em']

    def get_queryset(self):
        queryset = super().get_queryset()
        days = self.request.query_params.get('days')
        if days:
            try:
                days = int(days)
                data_limite = timezone.now() - timedelta(days=days)
                queryset = queryset.filter(criado_em__gte=data_limite)
            except ValueError:
                pass
        return queryset


# ----------------------------------
# ADMIN USER
# ----------------------------------
class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-id")
    serializer_class = UserAdminSerializer
    permission_classes = [SistemaPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 🔹 Inclui superuser ou qualquer admin/bibliotecário
        queryset = queryset.filter(
            Q(is_superuser=True) | Q(groups__name__in=["Admin", "Bibliotecario"])
        ).distinct()

        # 🔹 Filtro de pesquisa
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search)
            )

        # 🔹 Filtro por estado
        estado = self.request.query_params.get("estado")
        if estado == "ativo":
            queryset = queryset.filter(is_active=True)
        elif estado == "inativo":
            queryset = queryset.filter(is_active=False)
        

        return queryset

# ----------------------------------------------
# RELATÓRIOS + DASHBOARD + ESTATÍSTICAS-MENSAIS
# ---------------------------------------------

class DashboardStatsAdminView(APIView):
    def get(self, request):
        hoje = now()
        mes_passado = hoje - timedelta(days=30)

        # Totais
        total_livros = Livro.objects.count()
        emprestimos_ativos = Emprestimo.objects.filter(acoes="ativo").count()
        livros_atrasados = Emprestimo.objects.filter(acoes="atrasado").count()
        total_perfis = Perfil.objects.count()

        # Crescimento: comparação mês atual vs mês anterior
        def calcular_crescimento(model, filtro=None, campo_data=None):
            filtro = filtro or {}
            if campo_data:
                atual = model.objects.filter(**filtro, **{f"{campo_data}__gte": mes_passado}).count()
                anterior = model.objects.filter(**filtro, **{f"{campo_data}__lt": mes_passado}).count()
            else:
                atual = model.objects.filter(**filtro).count()
                anterior = model.objects.exclude(**filtro).count()
            if anterior > 0:
                return round(((atual - anterior) / anterior) * 100, 2)
            return 0

        crescimento_livros = calcular_crescimento(Livro, campo_data="created_at")
        crescimento_emprestimos = calcular_crescimento(Emprestimo, campo_data="data_emprestimo")
        crescimento_atrasos = calcular_crescimento(Emprestimo, filtro={"acoes": "atrasado"}, campo_data="data_emprestimo")
        crescimento_perfis = calcular_crescimento(Perfil, campo_data="created_at")

        # ALERTAS
        alertas = {
            "livros_atrasados": livros_atrasados,
            "reservas_pendentes": Reserva.objects.filter(estado="pendente").count(),
            "inventario_proximo": "Segunda-feira, 23 Jan."  # pode vir de tabela Inventario se existir
        }

        data = {
            "total_livros": total_livros,
            "emprestimos_ativos": emprestimos_ativos,
            "livros_atrasados": livros_atrasados,
            "total_perfis": total_perfis,
            "crescimento_livros": crescimento_livros,
            "crescimento_emprestimos": crescimento_emprestimos,
            "crescimento_atrasos": crescimento_atrasos,
            "crescimento_perfis": crescimento_perfis,
            "alertas": alertas,
        }

        return Response(data)


class DashboardResumoGeralView(APIView):
    def get(self, request):
        hoje = now().date()
        proximos_dias = hoje + timedelta(days=3)

        # =======================
        # 📚 PERFIS (ALUNOS)
        # =======================
        total_perfis = Perfil.objects.count()
        ativos = Perfil.objects.filter(estado__iexact="ativo").count()
        suspensos = Perfil.objects.filter(estado__iexact="suspenso").count()
        com_emprestimos = Perfil.objects.filter(n_emprestimos__gt=0).count()

        # =======================
        # 📦 EMPRÉSTIMOS
        # =======================
        emprestimos_ativos = Emprestimo.objects.filter(acoes__iexact="ativo").count()
        atrasados = Emprestimo.objects.filter(acoes__iexact="atrasado").count()

        devolucoes_hoje = Emprestimo.objects.filter(
            data_devolucao=hoje
        ).count()

        vencimento_proximo = Emprestimo.objects.filter(
            data_devolucao__range=[hoje, proximos_dias]
        ).count()

        # =======================
        # 📌 RESERVAS
        # =======================
        reservas_pendentes = Reserva.objects.filter(estado__iexact="Pendente").count()
        reservas_reservadas = Reserva.objects.filter(estado__iexact="Reservado").count()
        reservas_aprovadas = Reserva.objects.filter(estado__iexact="em_uso").count()
        reservas_finalizadas = Reserva.objects.filter(estado__iexact="Finalizada").count()

        # =======================
        # 💰 MULTAS
        # =======================
        total_multas = Multa.objects.count()
        multas_pendentes = Multa.objects.filter(estado="Pendente").count()
        multas_pagas = Multa.objects.filter(estado="Pago").count()
        valor_total_multas = Multa.objects.aggregate(total=Sum("valor"))["total"] or 0

        # =======================
        # 📊 RELATÓRIOS (EXEMPLO)
        # =======================
        relatorios = {
            "emprestimos_mes": Emprestimo.objects.filter(data_emprestimo__month=hoje.month).count(),
            "novos_perfis": Perfil.objects.filter(created_at__month=hoje.month).count(),
            "livros_adicionados": Livro.objects.filter(created_at__month=hoje.month).count(),
        }

        # =======================
        # 👨‍💼 ADMINISTRADORES
        # =======================
        total_admins = User.objects.filter(is_staff=True).count()

        admins_ativos = User.objects.filter(
            is_staff=True,
            is_active=True
        ).count()

        superusers = User.objects.filter(is_superuser=True).count()

        admins_ativos_hoje = User.objects.filter(
            is_staff=True,
            last_login__date=hoje
        ).count()

        return Response({
            "perfis": {
                "total": total_perfis,
                "ativos": ativos,
                "suspensos": suspensos,
                "com_emprestimos": com_emprestimos
            },
            "emprestimos": {
                "ativos": emprestimos_ativos,
                "atrasados": atrasados,
                "devolucoes_hoje": devolucoes_hoje,
                "vencimento_proximo": vencimento_proximo
            },
            "reservas": {
                "pendentes": reservas_pendentes,
                "reservadas": reservas_reservadas,
                "aprovadas": reservas_aprovadas,
                "finalizadas": reservas_finalizadas
            },
            "multas": {
                "total": total_multas,
                "pendentes": multas_pendentes,
                "pagas": multas_pagas,
                "valor_total": valor_total_multas
            },
            "admins": {
                "total": total_admins,
                "ativos": admins_ativos,
                "ativos_hoje": admins_ativos_hoje,
                "superusers": superusers
            },
            "relatorios": relatorios
        })


class EstatisticasMensaisAdminView(APIView):
    def get(self, request):
        meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ]

        # Inicializa estatísticas
        estatisticas = {
            i: {"emprestimos": 0, "devolucoes": 0, "perfil": 0, "multas": 0, "livros": 0, "reservas": 0}
            for i in range(1, 13)
        }

        # Empréstimos por mês
        emprestimos_por_mes = Emprestimo.objects.annotate(
            mes=ExtractMonth("data_emprestimo")
        ).values("mes").annotate(total=Count("id"))

        for item in emprestimos_por_mes:
            estatisticas[item["mes"]]["emprestimos"] = item["total"]

        # Reservas por mês
        reservas_por_mes = Reserva.objects.annotate(
            mes=ExtractMonth("data_reserva")
        ).values("mes").annotate(total=Count("id"))

        for item in reservas_por_mes:
            estatisticas[item["mes"]]["reservas"] = item["total"]

        # Devoluções por mês (AuditLog com estado 'devolvido')
        devolucoes_por_mes = AuditLog.objects.filter(alteracoes__estado="devolvido").annotate(
            mes=ExtractMonth("criado_em")
        ).values("mes").annotate(total=Count("id"))

        for item in devolucoes_por_mes:
            estatisticas[item["mes"]]["devolucoes"] = item["total"]

        # Perfis (qualquer tipo) por mês
        perfis_por_mes = Perfil.objects.annotate(
            mes=ExtractMonth("created_at")
        ).values("mes").annotate(total=Count("id"))

        for item in perfis_por_mes:
            estatisticas[item["mes"]]["perfil"] = item["total"]

        # Multas por mês (supondo campo 'valor_multa' no Emprestimo)
        multas_por_mes = Multa.objects.annotate(
            mes=ExtractMonth("data_criacao")
        ).values("mes").annotate(total=Sum("valor"))

        for item in multas_por_mes:
            estatisticas[item["mes"]]["multas"] =  item["total"]

        # Livros distintos emprestados por mês
        livros_por_mes = Emprestimo.objects.annotate(
            mes=ExtractMonth("data_emprestimo")
        ).values("mes").annotate(total=Count("reserva__livro", distinct=True))
        #  Livro.objects.filter(created_at__month=hoje.month).count(),

        for item in livros_por_mes:
            estatisticas[item["mes"]]["livros"] = item["total"]

        # Transformar para lista
        data = [
            {
                "id": i,
                "mes": meses[i-1],
                "reservas": estatisticas[i]["reservas"],
                "emprestimos": estatisticas[i]["emprestimos"],
                "devolucoes": estatisticas[i]["devolucoes"],
                "perfil": estatisticas[i]["perfil"],
                "multas": estatisticas[i]["multas"],
                "livros": estatisticas[i]["livros"],
                "cor": "#F86417"
            } for i in range(1, 13)
        ]

        return Response(data)


class EstatisticasAcervoAdminView(APIView): 
    def get(self, request): 
        
        categorias = (
            Livro.objects
            .values("categoria__nome")
            .annotate(total=Count("id"))
            .order_by("-total")
        )
        
        cores_padrao = [
            "#2563eb", "#16a34a", "#9333ea", "#f97316", "#dc2626",
            "#003366", "#facc15", "#4d7c0f", "#d946ef", "#059669",
            "#7c3aed", "#f43f5e"
        ]

        data = []

        for idx, cat in enumerate(categorias):
            cor = cores_padrao[idx % len(cores_padrao)]
            data.append({
                "categoria": cat["categoria__nome"] or "Sem Categoria",
                "total": cat["total"],  # 🔥 atenção aqui também
                "cor": cor
            })

        return Response(data)  # ✅ fora do loop





