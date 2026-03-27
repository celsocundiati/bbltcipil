from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Apps
    path("api/accounts/", include("accounts.urls")),
    path("api/admin/", include('administracao.urls')),
    path("api/livros/", include("livros.urls")),
    path("api/ia/", include("ia.urls")),
]
