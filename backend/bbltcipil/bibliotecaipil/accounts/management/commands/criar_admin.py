from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os


class Command(BaseCommand):

    help = "Cria superuser inicial"

    def handle(self, *args, **kwargs):

        username = os.getenv(
            "ADMIN_USERNAME",
            "superuser"
        )

        email = os.getenv(
            "ADMIN_EMAIL",
            "celsocundiati@gmail.com"
        )

        password = os.getenv(
            "ADMIN_PASSWORD",
            "biblioteca2026"
        )


        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    "Superuser já existe"
                )
            )
            return


        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )


        self.stdout.write(
            self.style.SUCCESS(
                "Superuser criado com sucesso"
            )
        )