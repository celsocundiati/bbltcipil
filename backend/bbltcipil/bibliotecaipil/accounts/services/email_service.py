# import requests
# from django.conf import settings
# from django.core.mail import send_mail



# def validate_email(email):
#     """
#     Validação externa (ZeroBounce) com fallback seguro.
#     """
#     try:
#         response = requests.get(
#             "https://api.zerobounce.net/v2/validate",
#             params={
#                 "api_key": settings.ZEROBOUNCE_API_KEY,
#                 "email": email
#             },
#             timeout=8
#         )

#         data = response.json()
#         status = data.get("status")

#         print("🔍 ZeroBounce response:", data)

#         # aceita estados realistas
#         return status in ["valid", "catch-all", "unknown"]

#     except Exception as e:
#         print("⚠️ ZeroBounce indisponível:", e)

#         # fallback seguro (não bloqueia sistema em dev)
#         return True


# def is_valid_email_basic(email: str) -> bool:
#     email = email.strip().lower()

#     if "@" not in email:
#         return False

#     domain = email.split("@")[-1]
#     if "." not in domain:
#         return False

#     blocked = ["tempmail.com", "mailinator.com"]
#     return domain not in blocked



# def send_verification_email(email, link):
#     try:
#         send_mail(
#             subject="Ativa a tua conta - Biblioteca IPIL",
#             message=f"""
#                 Olá,

#                 Clica no link abaixo para ativar a tua conta:

#                 {link}

#                 Se não foste tu, ignora este email.
#             """,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=[email],
#             fail_silently=True
#         )
#         return True

#     except Exception as e:
#         print("❌ Erro ao enviar email:", e)
#         return False



import requests

from django.conf import settings
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError



# ==========================================================
# 🔗 GERAR LINK DE ATIVAÇÃO
# ==========================================================

def generate_verification_link(token):

    return (
        f"{settings.FRONTEND_URL}"
        f"/verify-email/{token}"
    )



# ==========================================================
# 📤 ENVIO AUTOMÁTICO DE EMAIL
# ==========================================================

def send_verification_email(email, link):

    try:

        send_mail(

            subject=(
                "Ativação de conta - "
                "Biblioteca IPIL"
            ),


            message=f"""
Olá,

Recebemos um pedido de criação de conta
na Biblioteca IPIL.

Clique no link abaixo para confirmar o seu email:

{link}


Este link é válido por tempo limitado.


Se não realizou este pedido,
ignore este email.


Biblioteca IPIL
""",


            from_email=settings.DEFAULT_FROM_EMAIL,


            recipient_list=[
                email
            ],


            fail_silently=False
        )


        print(
            "✅ Email enviado:",
            email
        )


        return True



    except Exception as e:

        print(
            "❌ Falha envio email:",
            e
        )

        return False




# ==========================================================
# 🔍 VALIDAÇÃO LOCAL DE EMAIL
# ==========================================================

def is_valid_email_basic(email):

    try:

        validate_email(email)

        return True


    except ValidationError:

        return False




# ==========================================================
# 🌐 VALIDAÇÃO EXTERNA (OPCIONAL)
# ==========================================================

"""
Esta função fica preparada para produção.

Ativar quando configurar
ZEROBOUNCE_API_KEY.

"""

def validate_email_external(email):

    try:

        response = requests.get(

            "https://api.zerobounce.net/v2/validate",

            params={

                "api_key":
                settings.ZEROBOUNCE_API_KEY,

                "email":
                email

            },

            timeout=8
        )


        data = response.json()


        return data.get(
            "status"
        ) in [
            "valid",
            "catch-all",
            "unknown"
        ]



    except Exception as e:

        print(
            "ZeroBounce erro:",
            e
        )


        # fallback
        # não bloqueia desenvolvimento

        return settings.DEBUG
    





