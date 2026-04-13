from bibliotecaipil.events import emit_event
from django.core.exceptions import PermissionDenied
from django.db import transaction


# def criar_reserva(usuario, livro):

#     from livros.models import Reserva

#     reserva = Reserva(
#         usuario=usuario,
#         livro=livro,
#     )

#     reserva.save()

#     perfil = getattr(usuario, "perfil", None)
#     if perfil:
#         perfil.atualizar_contadores()
#         perfil.atualizar_estado()

#     # 🔥 EVENTO
#     emit_event("reserva_criada", {
#         "reserva_id": reserva.id
#     })

#     return reserva

def criar_reserva(usuario, livro):

    from livros.models import Reserva

    reserva = Reserva(
        usuario=usuario,
        livro=livro,
    )

    reserva.save()

    perfil = getattr(usuario, "perfil", None)
    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()

    # 🔥 PAYLOAD COMPLETO (PADRÃO CORRETO)
    emit_event("reserva_criada", {
        "reserva_id": reserva.id,
        "titulo": livro.titulo,
        "usuario_id": usuario.id,
    })

    return reserva


def marcar_emprestimo_atrasado(e):
    e.acoes = "atrasado"
    e.save(update_fields=["acoes"])

    emit_event("emprestimo_atrasado", {
        "emprestimo_id": e.id
    })


def cancelar_reserva(reserva, usuario):

    if reserva.usuario_id != usuario.id:
        raise PermissionDenied("Sem permissão para cancelar esta reserva.")

    if reserva.estado not in ["pendente", "reservado"]:
        raise PermissionDenied("Só pode cancelar reservas ativas.")

    # 🔥 CAPTURA TUDO ANTES DE APAGAR
    payload = {
        "reserva_id": reserva.id,
        "titulo": reserva.livro.titulo,
        "usuario_id": reserva.usuario.id,
    }

    with transaction.atomic():
        reserva.delete()

    emit_event("reserva_cancelada", payload)
    

