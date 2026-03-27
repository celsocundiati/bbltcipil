# ia/urls.py
from django.urls import path
from .views import ChatAIView

urlpatterns = [
    path("chat/", ChatAIView.as_view(), name="chat_ai"),
]