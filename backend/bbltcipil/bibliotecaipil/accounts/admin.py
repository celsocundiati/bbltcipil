from django.contrib import admin
from .models import AlunoOficial, FuncionarioOficial, Funcionario


admin.site.register(AlunoOficial)
admin.site.register(FuncionarioOficial)
admin.site.register(Funcionario)