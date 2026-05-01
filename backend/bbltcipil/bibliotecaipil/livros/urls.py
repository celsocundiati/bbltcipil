from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet, AutorViewSet, LivroViewSet, ReservaViewSet, EmprestimoViewSet, NotificacaoViewSet, 
    MinhasExposicoesViewSet, ExposicaoViewSet, ParticipacaoViewSet, EventoViewSet, MeusEventosViewSet
    )

router = DefaultRouter()
router.register(r'livros', LivroViewSet)
router.register(r'autores', AutorViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'emprestimos', EmprestimoViewSet, basename='emprestimo')
router.register(r'notificacoes', NotificacaoViewSet, basename="notificacao")
router.register(r'exposicoes', ExposicaoViewSet, basename="exposicoes")
router.register(r'eventos', EventoViewSet, basename="eventos")
router.register(r'participacoes', ParticipacaoViewSet, basename="participacoes")
router.register(r'minhas-exposicoes', MinhasExposicoesViewSet, basename="minhas-exposicoes")  
router.register(r'meus-eventos', MeusEventosViewSet, basename="meus-eventos")

urlpatterns = [
    path('', include(router.urls)),
]  