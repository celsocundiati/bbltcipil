from bibliotecaipil.events import register_event, emit_event


# ===============================
# EMPRÉSTIMO ATRASADO
# ===============================
@register_event("emprestimo_atrasado")
def notificar_emprestimo_atrasado(payload):
    from livros.models import Emprestimo, Notificacao

    e = Emprestimo.objects.select_related("reserva", "livro").get(id=payload["emprestimo_id"])
    perfil = e.reserva.perfil_oficial
    usuario = perfil.user if perfil else e.reserva.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Livro em atraso",
        descricao=f"O livro '{e.livro.titulo}' está atrasado.",
        defaults={"tipo": "Emprestimo", "link": f"/reservas#reserva-{e.reserva.id}"}
    )


@register_event("emprestimo_devolvido")
def notificar_emprestimo_devolvido(payload):
    from livros.models import Emprestimo, Notificacao

    e = Emprestimo.objects.get(id=payload["emprestimo_id"])
    perfil = e.reserva.perfil_oficial
    usuario = perfil.user if perfil else e.reserva.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Livro devolvido",
        descricao=f"O livro '{e.livro.titulo}' foi devolvido com sucesso.",
        defaults={"tipo": "Emprestimo", "link": f"/reservas#reserva-{e.reserva.id}"}
    )


# ===============================
# RESERVA
# ===============================
@register_event("reserva_aprovada")
def notificar_reserva_aprovada(payload):
    from livros.models import Reserva, Notificacao

    r = Reserva.objects.get(id=payload["reserva_id"])
    perfil = r.perfil_oficial
    usuario = perfil.user if perfil else r.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Reserva aprovada",
        descricao=f"Sua reserva do livro '{r.livro.titulo}' foi aprovada.",
        defaults={"tipo": "Reserva", "link": f"/reservas#reserva-{r.id}"}
    )


@register_event("reserva_finalizada")
def notificar_reserva_finalizada(payload):
    from livros.models import Reserva, Notificacao

    r = Reserva.objects.get(id=payload["reserva_id"])
    perfil = r.perfil_oficial
    usuario = perfil.user if perfil else r.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Reserva finalizada",
        descricao=f"Sua reserva do livro '{r.livro.titulo}' foi finalizada e convertida em empréstimo.",
        tipo="Reserva",
        link=f"/reservas#reserva-{r.id}"
    )


@register_event("emprestimo_criado")
def notificar_emprestimo_criado(payload):
    from livros.models import Emprestimo, Notificacao

    e = Emprestimo.objects.get(id=payload["emprestimo_id"])
    perfil = e.reserva.perfil_oficial
    usuario = perfil.user if perfil else e.reserva.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Empréstimo iniciado",
        descricao=f"O livro '{e.reserva.livro.titulo}' já está em seu nome.",
        tipo="Emprestimo",
        link=f"/reservas#reserva-{e.reserva.id}"
    )

