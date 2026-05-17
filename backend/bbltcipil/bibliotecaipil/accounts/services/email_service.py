import requests
from django.conf import settings
from django.core.mail import send_mail



def validate_email(email):
    """
    Validação externa (ZeroBounce) com fallback seguro.
    """
    try:
        response = requests.get(
            "https://api.zerobounce.net/v2/validate",
            params={
                "api_key": settings.ZEROBOUNCE_API_KEY,
                "email": email
            },
            timeout=8
        )

        data = response.json()
        status = data.get("status")

        print("🔍 ZeroBounce response:", data)

        # aceita estados realistas
        return status in ["valid", "catch-all", "unknown"]

    except Exception as e:
        print("⚠️ ZeroBounce indisponível:", e)

        # fallback seguro (não bloqueia sistema em dev)
        return True


def is_valid_email_basic(email: str) -> bool:
    email = email.strip().lower()

    if "@" not in email:
        return False

    domain = email.split("@")[-1]
    if "." not in domain:
        return False

    blocked = ["tempmail.com", "mailinator.com"]
    return domain not in blocked



def send_verification_email(email, link):
    try:
        send_mail(
            subject="Ativa a tua conta - Biblioteca IPIL",
            message=f"""
                Olá,

                Clica no link abaixo para ativar a tua conta:

                {link}

                Se não foste tu, ignora este email.
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True
        )
        return True

    except Exception as e:
        print("❌ Erro ao enviar email:", e)
        return False


