from bibliotecaipil.events import register_event, emit_event

# ===============================
# EMPRÉSTIMO ATRASADO → MULTA
# ===============================
@register_event("emprestimo_atrasado")
def gerar_multa(payload):
    try:
        # Import dentro da função para evitar import circular
        from administracao.models import Multa
        from livros.models import Emprestimo
        from audit.services import AuditService

        e = Emprestimo.objects.get(id=payload["emprestimo_id"])
        multa, created = Multa.objects.get_or_create(
            emprestimo=e,
            motivo="Atraso"
        )
        if created:
            emit_event("multa_aplicada", {"multa_id": multa.id})

        # Log de auditoria
        AuditService.log(
            user=None,
            action="Empréstimo atrasado",
            instance_id=payload["emprestimo_id"],
            origem="system"
        )
    except Emprestimo.DoesNotExist:
        print(f"❌ Empréstimo não encontrado: {payload['emprestimo_id']}")
    except Exception as e:
        print("❌ Erro ao processar empréstimo atrasado:", e)


# ===============================
# MULTA APLICADA → NOTIFICAÇÃO
# ===============================
@register_event("multa_aplicada")
def notificar_usuario_multa(payload):
    try:
        from administracao.models import Multa
        from livros.models import Notificacao

        multa = Multa.objects.select_related("emprestimo__reserva").get(id=payload["multa_id"])
        reserva = multa.emprestimo.reserva
        perfil = reserva.perfil_oficial
        usuario = perfil.user if perfil else reserva.usuario

        Notificacao.objects.get_or_create(
            usuario=usuario,
            titulo="Multa aplicada",
            descricao=f"Foi aplicada uma multa de {multa.valor} AKZ por atraso no livro '{multa.emprestimo.livro.titulo}'.",
            defaults={"tipo": "Multa", "link": f"/multas#{multa.id}"}
        )
    except Multa.DoesNotExist:
        print(f"❌ Multa não encontrada: {payload['multa_id']}")
    except Exception as e:
        print("❌ Erro ao notificar usuário sobre multa:", e)




        
