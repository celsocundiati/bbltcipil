from django.urls import path
from .views import RegistarAlunoView, LogoutView, MeView, LoginView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("registar-aluno/", RegistarAlunoView.as_view(), name="registar-aluno"),
]
