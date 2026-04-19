from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet, AutorViewSet, LivroViewSet, ReservaViewSet, EmprestimoViewSet, NotificacaoViewSet, 
    ExposicaoListViewSet, MinhasExposicoesViewSet, ExposicaoViewSet, ParticipacaoViewSet, EventoListViewSet,
    EventoViewSet, MeusEventosViewSet
    )

router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'emprestimos', EmprestimoViewSet, basename='emprestimo')
router.register(r'notificacoes', NotificacaoViewSet, basename="notificacao")
router.register(r'exposicoes', ExposicaoListViewSet, basename="exposicoes")
router.register(r'eventos', EventoListViewSet, basename="eventos")
router.register(r'minhas-exposicoes', MinhasExposicoesViewSet, basename="minhas-exposicoes")  
router.register(r'meus-eventos', MeusEventosViewSet, basename="meus-eventos")  
router.register(r'gestao-exposicoes', ExposicaoViewSet, basename="gestao-exposicoes")
router.register(r'gestao-eventos', EventoViewSet, basename="gestao-eventos")
router.register(r'participacoes', ParticipacaoViewSet, basename="participacoes")

urlpatterns = [
    path('', include(router.urls)),
]  