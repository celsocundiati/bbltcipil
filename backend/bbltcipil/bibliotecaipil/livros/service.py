from bibliotecaipil.events import emit_event
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from .models import Exposicao, Evento, Participacao
from .events import emit_event
from policies.reservas import validar_criacao_reserva


def criar_reserva(usuario, livro):

    from livros.models import Reserva
    
    validar_criacao_reserva(usuario)

    reserva = Reserva(
        usuario=usuario,
        livro=livro,
    )

    reserva.save()

    perfil = getattr(usuario, "perfil", None)
    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()

    # 🔥 EVENTO
    emit_event("reserva_criada", {
        "reserva_id": reserva.id
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
    

def reservar_exposicao(usuario, exposicao_id):
    with transaction.atomic():
        exposicao = Exposicao.objects.select_for_update().get(id=exposicao_id)

        if exposicao.estado == 'encerrado':
            raise ValidationError("Exposição já encerrada.")
        
        if Participacao.objects.filter(usuario=usuario, exposicao=exposicao).exists():
            raise ValidationError("Já estás inscrito.")
        
        if exposicao.vagas_disponiveis() <= 0:
            exposicao.estado = 'esgotado'
            exposicao.save()
            raise ValidationError("Sem vagas disponíveis.")
        
        participacao = Participacao.objects.create(
            usuario=usuario,
            exposicao=exposicao
        )

        exposicao.atualizar_estado()
        exposicao.save()

        emit_event("participacao_criada", {
            "usuario_id": usuario.id,
            "exposicao_id": exposicao.id
        })

        return participacao
    

def reservar_evento(usuario, evento_id):
    with transaction.atomic():
        evento = Evento.objects.select_for_update().get(id=evento_id)

        if evento.estado == 'encerrado':
            raise ValidationError("Exposição já encerrada.")
        
        if Participacao.objects.filter(usuario=usuario, evento=evento).exists():
            raise ValidationError("Já estás inscrito.")
        
        if evento.vagas_disponiveis() <= 0:
            evento.estado = 'esgotado'
            evento.save()
            raise ValidationError("Sem vagas disponíveis.")
        
        participacao = Participacao.objects.create(
            usuario=usuario,
            evento=evento
        )

        evento.atualizar_estado()
        evento.save()

        emit_event("participacao_criada", {
            "usuario_id": usuario.id,
            "evento": evento.id
        })

        return participacao
    

def cancelar_participacao(participacao, usuario):
    if participacao.usuario_id != usuario.id:
        raise PermissionDenied("Sem permissão.")
    
    exposicao = participacao.exposicao
    evento = participacao.evento

    payload = {
        "participacao_id": participacao.id,
        "exposicao": exposicao.titulo,
        "usuario_id": usuario.id,
    }

    payload = {
        "participacao_id": participacao.id,
        "evento": evento.titulo,
        "usuario_id": usuario.id,
    }

    with transaction.atomic():
        participacao.delete()

        exposicao.atualizar_estado()
        exposicao.save()

        evento.atualizar_estado()
        evento.save()

    emit_event("participacao_cancelada", payload)



