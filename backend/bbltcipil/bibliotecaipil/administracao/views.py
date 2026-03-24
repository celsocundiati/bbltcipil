from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import transaction
from rest_framework.exceptions import ValidationError
from .service import calcular_valor_multa, criar_emprestimo
from django.db.models import Count, Sum, Q
from django.db.models.functions import ExtractMonth
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework.decorators import action
from datetime import timedelta
from rest_framework.response import Response
from livros.models import Reserva, Emprestimo, Autor, Categoria, Livro
from accounts.models import AlunoOficial, FuncionarioOficial, Perfil
from .models import AuditLog, Multa, ConfiguracaoSistema
from .serializers import (
    ReservaAdminSerializer,
    EmprestimoAdminSerializer,
    AutorAdminSerializer,
    CategoriaAdminSerializer,
    LivroAdminSerializer,
    AuditLogSerializer,
    AlunoOficialAdminSerializer,
    FuncionarioOficialAdminSerializer,
    PerfilAdminSerializer,
    MultaSerializer,
    ConfiguracaoSistemaSerializer
)
from .audit_service import AuditService

User = get_user_model()

# -----------------------------
# LIVRO
# -----------------------------
class LivroAdminViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['titulo', 'isbn', 'categoria__nome']
    ordering_fields = ['publicado_em', 'titulo', 'isbn', 'estado']
    ordering = ['publicado_em']

    def perform_create(self, serializer):
        livro = serializer.save()
        AuditService.log(user=self.request.user, action="Adicionou", instance=livro, extra={"titulo": livro.titulo})

    def perform_update(self, serializer):
        livro = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=livro, extra={"titulo": livro.titulo})

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance, extra={"titulo": instance.titulo})
        instance.delete()


# -----------------------------
# RESERVA
# -----------------------------
class ReservaAdminViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['usuario__first_name', 'livro__titulo']
    ordering_fields = ['data_reserva', 'livro', 'estado']
    ordering = ['data_reserva']

    def perform_create(self, serializer):
        reserva = serializer.save()
        AuditService.log(user=self.request.user, action="Criou", instance=reserva,
            extra={"livro": reserva.livro.titulo,"nome": reserva.usuario.first_name, "estado": reserva.estado, "data_reserva": str(reserva.data_reserva)})

    def perform_update(self, serializer):
        reserva = serializer.save()
        acao = "Aprovou" if reserva.estado == "reservado" else "Cancelou"
        AuditService.log(user=self.request.user, action=acao, instance=reserva,
            extra={"livro": reserva.livro.titulo,"nome": reserva.usuario.first_name, "estado": reserva.estado, "data_reserva": str(reserva.data_reserva)})

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Cancelou", instance=instance,
            extra={"livro": instance.livro.titulo,"nome": instance.usuario.first_name, "estado": instance.estado})
        instance.delete()


# -----------------------------
# EMPRÉSTIMO
# -----------------------------

class EmprestimoAdminViewSet(viewsets.ModelViewSet):

    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        # 🔥 APENAS leitura
        return Emprestimo.objects.all()

    def perform_create(self, serializer):

        reserva = serializer.validated_data.get("reserva")

        with transaction.atomic():

            try:
                emprestimo = criar_emprestimo(
                    reserva=reserva,
                    admin_user=self.request.user
                )
            except Exception as e:
                raise ValidationError(str(e))

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

        nova_acao = serializer.validated_data.get("acoes")

        # 🔒 regras de negócio
        if instance.acoes == "devolvido":
            raise ValidationError("Empréstimo já devolvido não pode ser alterado.")

        if nova_acao == "devolvido":
            from administracao.service import devolver_emprestimo
            devolver_emprestimo(instance)
            return

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


# -----------------------------
# AUTOR
# -----------------------------
class AutorAdminViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        autor = serializer.save()
        AuditService.log(user=self.request.user, action="Adicionou", instance=autor,
            extra={"autor": autor.nome,
                   "nacionalidade": autor.nacionalidade,
                })

    def perform_update(self, serializer):
        autor = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=autor,
            extra={"autor": autor.nome,
                   "nacionalidade": autor.nacionalidade,
                })

    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance,
            extra={"autor": instance.nome,
                   "nacionalidade": instance.nacionalidade,
                })
        instance.delete()


# -----------------------------
# CATEGORIA
# -----------------------------
class CategoriaAdminViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        categoria = serializer.save()
        AuditService.log(user=self.request.user, action="Adicionou", instance=categoria,
            extra={"categoria": categoria.nome,
                   "descricao": categoria.descricao,
                })

    def perform_update(self, serializer):
        categoria = serializer.save()
        AuditService.log(user=self.request.user, action="Atualizou", instance=categoria,
            extra={"categoria": categoria.nome,
                   "descricao": categoria.descricao,
                })
    def perform_destroy(self, instance):
        AuditService.log(user=self.request.user, action="Removeu", instance=instance,
            extra={"categoria": instance.nome,
                   "descricao": instance.descricao,
                })
        instance.delete()


# -----------------------------
# MULTAS POR EMPRÉSTIMOS
# -----------------------------

class MultaViewSet(viewsets.ModelViewSet):
    queryset = Multa.objects.all().order_by("-data_criacao")
    serializer_class = MultaSerializer
    permission_classes = [permissions.IsAdminUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = ['usuario__first_name', 'emprestimo__reserva__livro__titulo']
    ordering_fields = ['data_criacao', 'emprestimo__reserva__livro__titulo', 'estado']
    ordering = ['-data_criacao']

    # 🔥 CRIAR MULTA
    def perform_create(self, serializer):
        emprestimo = serializer.validated_data.get("emprestimo")
        motivo = serializer.validated_data.get("motivo")

        if not emprestimo:
            raise ValidationError("Empréstimo é obrigatório")

        # 🔥 REGRA 1: evitar duplicação de Dano/Perda
        if motivo in ["Dano", "Perda"]:
            if Multa.objects.filter(
                emprestimo=emprestimo,
                motivo=motivo
            ).exists():
                raise ValidationError(
                    f"Já existe multa de {motivo} para este empréstimo."
                )

        # 🔥 REGRA 2: limite de multas (exceto atraso)
        total_multas = Multa.objects.filter(emprestimo=emprestimo).exclude(motivo="Atraso").count()

        if total_multas >= 2:
            raise ValidationError(
                "Este empréstimo já atingiu o limite de multas."
            )

        # 💰 VALOR DINÂMICO (CONFIG)
        valor = calcular_valor_multa(emprestimo, motivo)

        serializer.save(
            valor=valor,
            criado_por=self.request.user
        )

    # 🔹 EMPRESTIMOS DISPONÍVEIS
    @action(detail=False, methods=["get"])
    def emprestimos_disponiveis(self, request):

        emprestimos = Emprestimo.objects.filter(
            acoes__in=["ativo", "atrasado"]
        ).exclude(
            multas__motivo__in=["Dano", "Perda"]
        ).select_related(
            "reserva", "reserva__usuario", "reserva__livro"
        ).distinct()

        data = [
            {
                "id": e.id,
                "usuario": e.reserva.usuario.first_name,
                "livro": str(e.reserva.livro),
                "estado": e.acoes,
                "data_devolucao": e.data_devolucao,
                "multas_total": e.multas.count(),
                "tem_multa_grave": e.multas.filter(
                    motivo__in=["Dano", "Perda"]
                ).exists(),
            }
            for e in emprestimos
        ]

        return Response(data)

    # 🔹 PAGAR MULTA
    @action(detail=True, methods=["post"])
    def pagar(self, request, pk=None):
        multa = self.get_object()

        if multa.estado == "Pago":
            return Response({"status": "Já paga"}, status=400)

        multa.marcar_como_pago()
        return Response({"status": "Multa paga com sucesso"})

    # 🔹 DISPENSAR MULTA
    @action(detail=True, methods=["post"])
    def dispensar(self, request, pk=None):
        multa = self.get_object()

        if multa.estado == "Pago":
            return Response({"error": "Não pode dispensar paga"}, status=400)

        multa.dispensar()
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
    permission_classes = [permissions.IsAdminUser]

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
    permission_classes = [permissions.IsAdminUser]

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
    """
    ViewSet unificado para perfis de Aluno e Funcionário.
    Permite filtros, pesquisa e ordenação por dados oficiais.
    """
    queryset = Perfil.objects.select_related('aluno_oficial', 'funcionario_oficial', 'user').all()
    serializer_class = PerfilAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado']
    search_fields = [
        'user__first_name',
        'user__username',
        'funcionario_oficial__cargo'
    ]
    ordering_fields = ['user__first_name', 'n_reservas', 'n_emprestimos']
    ordering = ['user__first_name']


# ----------------------------------
# AUDIT LOG (READ ONLY) COM PESQUISA
# ----------------------------------
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Permite pesquisa por usuário, ação e modelo.
    """
    queryset = AuditLog.objects.all().order_by('-criado_em')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['acao', 'modelo']
    search_fields = ['usuario__username']
    ordering_fields = ['criado_em', 'usuario__username', 'acao']
    ordering = ['-criado_em']



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
        reservas_aprovadas = Reserva.objects.filter(estado__iexact="Aprovada").count()
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
        # Consulta livros agrupados por categoria
        categorias = (
            Livro.objects
            .values("categoria__nome")  # assume que Livro tem ForeignKey para Categoria
            .annotate(total=Count("id"))
            .order_by("-total")
        )

        # Mapeia cores fixas para categorias (pode ajustar ou gerar dinamicamente)
        cores = [
            "#2563eb", "#16a34a", "#9333ea", "#f97316", "#dc2626", "#003366",
            "#FF9900", "#00CC99", "#9900CC"
        ]

        # Monta resposta
        data = [
            {
                "id": idx + 1,
                "categoria": cat["categoria__nome"],
                "total": cat["total"],
                "cor": cores[idx % len(cores)]  # recicla cores se houver mais categorias
            }
            for idx, cat in enumerate(categorias)
        ]

        return Response(data)


