from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReservaAdminViewSet,
    EmprestimoAdminViewSet,
    AutorAdminViewSet,
    CategoriaAdminViewSet,
    LivroAdminViewSet,
    AuditLogViewSet,
    AlunoOficialAdminViewSet,
    FuncionarioOficialAdminViewSet,
    PerfilAdminViewSet,
    DashboardStatsAdminView,
    EstatisticasMensaisAdminView,
    EstatisticasAcervoAdminView,
    MultaViewSet,
    DashboardResumoGeralView,
    ConfiguracaoSistemaViewSet,
    UserAdminViewSet
)

router = DefaultRouter()
router.register(r'reservas', ReservaAdminViewSet, basename='reserva-admin')
router.register(r'emprestimos', EmprestimoAdminViewSet, basename='emprestimo-admin')
router.register(r'autores', AutorAdminViewSet, basename='autor-admin')
router.register(r'categorias', CategoriaAdminViewSet, basename='categoria-admin')
router.register(r'livros', LivroAdminViewSet, basename='livro-admin')
router.register(r'auditlog', AuditLogViewSet, basename='audit-admin')
router.register(r'alunosoficiais', AlunoOficialAdminViewSet, basename='alunosoficiais-admin')
router.register(r'funcionarios', FuncionarioOficialAdminViewSet, basename='funcionario')
router.register(r'perfil', PerfilAdminViewSet, basename='perfil-admin')
router.register(r"multas", MultaViewSet, basename="multas-admin")
router.register(r'configuracoes', ConfiguracaoSistemaViewSet, basename='configuracoes')
router.register(r'users', UserAdminViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', DashboardStatsAdminView.as_view(), name='dashboard-admin-stats'),
    path('dashboard/estatisticas-mensais/', EstatisticasMensaisAdminView.as_view(), name='dashboard-admin-estatisticas'),
    path("dashboard/estatisticas-acervo/", EstatisticasAcervoAdminView.as_view(), name="dashboard-admin-acervo"),
    path("dashboard/resumo-geral/", DashboardResumoGeralView.as_view(), name="dashboard-admin-acervo"),
]
