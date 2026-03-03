from django.urls import path
from .views import SignupView, LoginAlunoView, LogoutView, MeView 


urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup_aluno"),
    path("login/", LoginAlunoView.as_view(), name="login_aluno"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]

