from django.urls import path
from .views import SignupView, LoginView, RefreshTokenView, LogoutView, MeView, AlterarSenhaView, password_reset_request, password_reset_confirm



urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup_aluno"),
    path("login/", LoginView.as_view(), name="login_aluno"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh-token"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("alterar-senha/", AlterarSenhaView.as_view(), name="alterar_senha"),
    path("password-reset/", password_reset_request, name="password_reset"),
    path("password-reset-confirm/", password_reset_confirm, name="password_reset_confirm"),
]