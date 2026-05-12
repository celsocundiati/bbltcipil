def atualizar_perfil(usuario):

    perfil = getattr(usuario, "perfil", None)

    if perfil:
        perfil.atualizar_contadores()
        perfil.atualizar_estado()