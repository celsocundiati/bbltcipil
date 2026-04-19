from django.contrib import admin
from .models import AlunoOficial, FuncionarioOficial, Perfil


admin.site.register(AlunoOficial)
admin.site.register(FuncionarioOficial)
admin.site.register(Perfil)

#Forma mais clássica e profissional
#@admin.register(AlunoOficial)
#@admin.register(FuncionarioOficial)
#@admin.register(Perfil)