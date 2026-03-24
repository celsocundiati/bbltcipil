
def criar_reserva(usuario, livro):

    from livros.models import Reserva

    reserva = Reserva(
        usuario=usuario,
        livro=livro,
    )

    reserva.save()  # 🔥 model decide tudo

    perfil = getattr(usuario, "perfil", None)
    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()

    return reserva

