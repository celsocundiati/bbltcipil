from django.contrib import admin
from .models import AuditLog, Multa

admin.site.register(AuditLog)
admin.site.register(Multa)

# Register your models here.
