from bibliotecaipil.events import register_event


# ===============================
# EMPRÉSTIMO ATRASADO
# ===============================
@register_event("emprestimo_atrasado")
def notificar_emprestimo_atrasado(payload):
    from livros.models import Emprestimo, Notificacao

    e = Emprestimo.objects.select_related("reserva", "livro").get(id=payload["emprestimo_id"])
    perfil = e.reserva.perfil_oficial
    usuario = perfil.user if perfil else e.reserva.usuario

    Notificacao.objects.get_or_create(
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

    Notificacao.objects.get_or_create(
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

    Notificacao.objects.get_or_create(
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
        descricao=f"Sua reserva do livro '{r.livro.titulo}' foi finalizada.",
        tipo="Reserva",
        link=f"/reservas#reserva-{r.id}"
    )


@register_event("reserva_em_uso")
def notificar_reserva_em_uso(payload):
    from livros.models import Reserva, Notificacao

    r = Reserva.objects.get(id=payload["reserva_id"])
    perfil = r.perfil_oficial
    usuario = perfil.user if perfil else r.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Livro em uso",
        descricao=f"O livro '{r.livro.titulo}' já está em uso na biblioteca.",
        tipo="Uso",
        link=f"/reservas#reserva-{r.id}"
    )


@register_event("reserva_cancelada")
def notificar_reserva_cancelada(payload):
    from livros.models import Reserva, Notificacao

    r = Reserva.objects.get(id=payload["reserva_id"])
    perfil = r.perfil_oficial
    usuario = perfil.user if perfil else r.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Reserva cancelada",
        descricao=f"Sua reserva do livro '{r.livro.titulo}' foi cancelada.",
        tipo="Reserva",
        link=f"/reservas#reserva-{r.id}"
    )


# ===============================
# MULTA PAGA
# ===============================
@register_event("multa_paga")
def notificar_multa_paga(payload):
    from livros.models import Multa, Notificacao

    m = Multa.objects.select_related("emprestimo").get(id=payload["multa_id"])
    usuario = m.emprestimo.reserva.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Multa paga",
        descricao=f"A multa do livro '{m.emprestimo.livro.titulo}' foi paga com sucesso.",
        tipo="Multa",
        link=f"/multas#multa-{m.id}"
    )


# ===============================
# MULTA DISPENSADA
# ===============================
@register_event("multa_dispensada")
def notificar_multa_dispensada(payload):
    from livros.models import Multa, Notificacao

    m = Multa.objects.select_related("emprestimo").get(id=payload["multa_id"])
    usuario = m.emprestimo.reserva.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Multa dispensada",
        descricao=f"A multa do livro '{m.emprestimo.livro.titulo}' foi dispensada pela administração.",
        tipo="Multa",
        link=f"/multas#multa-{m.id}"
    )


# ===============================
# MULTA CRIADA (RECOMENDADO)
# ===============================
@register_event("multa_criada")
def notificar_multa_criada(payload):
    from livros.models import Multa, Notificacao

    m = Multa.objects.select_related("emprestimo").get(id=payload["multa_id"])
    usuario = m.emprestimo.reserva.usuario

    Notificacao.objects.create(
        usuario=usuario,
        titulo="Multa gerada",
        descricao=f"Foi gerada uma multa para o livro '{m.emprestimo.livro.titulo}', consulte a biblioteca.",
        tipo="Multa",
        link=f"/multas#multa-{m.id}"
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


@register_event("emprestimo_atrasado")
def notificar_emprestimo_atrasado(payload):
    from livros.models import Emprestimo, Notificacao

    e = Emprestimo.objects.select_related("reserva", "livro").get(
        id=payload["emprestimo_id"]
    )

    perfil = e.reserva.perfil_oficial
    usuario = perfil.user if perfil else e.reserva.usuario

    Notificacao.objects.get_or_create(
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

    Notificacao.objects.get_or_create(
        usuario=usuario,
        titulo="Livro devolvido",
        descricao=f"O livro '{e.livro.titulo}' foi devolvido com sucesso.",
        defaults={"tipo": "Emprestimo", "link": f"/reservas#reserva-{e.reserva.id}"}
    )





