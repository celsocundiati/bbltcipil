# """
# Django settings for bibliotecaipil project.
# """

# from pathlib import Path
# from datetime import timedelta
# import os

# from dotenv import load_dotenv

# load_dotenv()

# from celery.schedules import crontab
# import dj_database_url
# import cloudinary


# # ==========================================================
# # BASE
# # ==========================================================

# BASE_DIR = Path(__file__).resolve().parent.parent


# SECRET_KEY = os.getenv(
#     "DJANGO_SECRET_KEY",
#     "django-insecure-dev-key-change-in-production"
# )


# # ==========================================================
# # ENV MODE
# # ==========================================================

# DEBUG = os.getenv("DEBUG", "False").lower() == "true"


# ALLOWED_HOSTS = os.getenv(
#     "ALLOWED_HOSTS",
#     "127.0.0.1,localhost,bbltcipil.onrender.com,.onrender.com"
# ).split(",")


# # Render HTTPS proxy
# # SECURE_PROXY_SSL_HEADER = (
# #     "HTTP_X_FORWARDED_PROTO",
# #     "https",
# # )


# # ==========================================================
# # APPLICATIONS
# # ==========================================================

# INSTALLED_APPS = [

#     # Django
#     "django.contrib.admin",
#     "django.contrib.auth",
#     "django.contrib.contenttypes",
#     "django.contrib.sessions",
#     "django.contrib.messages",
#     "django.contrib.staticfiles",


#     # Third party
#     "corsheaders",
#     "rest_framework",
#     "django_filters",
#     "rest_framework_simplejwt",
#     "rest_framework_simplejwt.token_blacklist",


#     # Local
#     "livros.apps.LivrosConfig",
#     "accounts.apps.AccountsConfig",
#     "administracao.apps.AdministracaoConfig",
#     "ai_assistant.apps.AiAssistantConfig",
#     "audit.apps.AuditConfig",


#     # Media
#     "cloudinary",
#     "cloudinary_storage",
# ]


# # ==========================================================
# # MIDDLEWARE
# # ==========================================================

# MIDDLEWARE = [

#     "corsheaders.middleware.CorsMiddleware",

#     "django.middleware.security.SecurityMiddleware",

#     "whitenoise.middleware.WhiteNoiseMiddleware",

#     "django.contrib.sessions.middleware.SessionMiddleware",

#     "django.middleware.common.CommonMiddleware",

#     "django.middleware.csrf.CsrfViewMiddleware",

#     "django.contrib.auth.middleware.AuthenticationMiddleware",

#     "administracao.middleware.CurrentUserMiddleware",

#     "django.contrib.messages.middleware.MessageMiddleware",

#     "django.middleware.clickjacking.XFrameOptionsMiddleware",

#     "audit.middleware.AuditMiddleware",
# ]


# # ==========================================================
# # URLS
# # ==========================================================

# ROOT_URLCONF = "bibliotecaipil.urls"

# WSGI_APPLICATION = "bibliotecaipil.wsgi.application"



# # ==========================================================
# # DATABASE
# # ==========================================================

# DATABASE_URL = os.getenv("DATABASE_URL")


# if DATABASE_URL:

#     DATABASES = {
#         "default": dj_database_url.parse(
#             DATABASE_URL,
#             conn_max_age=600,
#             ssl_require=True
#         )
#     }

# else:

#     DATABASES = {

#         "default": {

#             "ENGINE":
#             "django.db.backends.postgresql",

#             "NAME":
#             "bibliotecaipil",

#             "USER":
#             "postgres",

#             "PASSWORD":
#             "1234",

#             "HOST":
#             "localhost",

#             "PORT":
#             "5432",
#         }
#     }



# # ==========================================================
# # TEMPLATES
# # ==========================================================

# TEMPLATES = [

#     {

#         "BACKEND":
#         "django.template.backends.django.DjangoTemplates",

#         "DIRS":
#         [BASE_DIR / "templates"],

#         "APP_DIRS":
#         True,


#         "OPTIONS":
#         {

#             "context_processors":

#             [

#                 "django.template.context_processors.debug",

#                 "django.template.context_processors.request",

#                 "django.contrib.auth.context_processors.auth",

#                 "django.contrib.messages.context_processors.messages",

#             ],
#         },
#     },
# ]



# # ==========================================================
# # DRF
# # ==========================================================

# REST_FRAMEWORK = {


#     "DEFAULT_AUTHENTICATION_CLASSES":

#     (

#         "rest_framework_simplejwt.authentication.JWTAuthentication",

#     ),


#     "DEFAULT_PERMISSION_CLASSES":

#     (

#         "rest_framework.permissions.IsAuthenticated",

#     ),


#     "DEFAULT_FILTER_BACKENDS":

#     (

#         "django_filters.rest_framework.DjangoFilterBackend",

#     ),
# }



# # ==========================================================
# # JWT
# # ==========================================================

# SIMPLE_JWT = {


#     "ACCESS_TOKEN_LIFETIME":
#     timedelta(minutes=5),


#     "REFRESH_TOKEN_LIFETIME":
#     timedelta(days=7),


#     "ROTATE_REFRESH_TOKENS":
#     True,


#     "BLACKLIST_AFTER_ROTATION":
#     True,

# }



# # ==========================================================
# # CORS / CSRF
# # ==========================================================


# CORS_ALLOWED_ORIGINS = os.getenv(

#     "CORS_ALLOWED_ORIGINS",

#     "http://localhost:5173,https://bibliotecaipil2026.vercel.app"

# ).split(",")



# CSRF_TRUSTED_ORIGINS = os.getenv(

#     "CSRF_TRUSTED_ORIGINS",

#     "http://localhost:5173,https://bibliotecaipil2026.vercel.app,https://bbltcipil.onrender.com"

# ).split(",")



# CORS_ALLOW_CREDENTIALS = True



# FRONTEND_URL = os.getenv(

#     "FRONTEND_URL",

#     "https://bibliotecaipil2026.vercel.app"

# )



# # ==========================================================
# # LANGUAGE
# # ==========================================================

# LANGUAGE_CODE = "pt-pt"

# TIME_ZONE = "Africa/Luanda"

# USE_I18N = True

# USE_TZ = True



# # ==========================================================
# # STATIC
# # ==========================================================

# STATIC_URL = "static/"

# STATIC_ROOT = BASE_DIR / "staticfiles"



# # ==========================================================
# # SECURITY
# # ==========================================================


# if not DEBUG:

#     SECURE_BROWSER_XSS_FILTER = True
#     SECURE_CONTENT_TYPE_NOSNIFF = True
#     X_FRAME_OPTIONS = "DENY"

#     SECURE_SSL_REDIRECT = True

#     SESSION_COOKIE_SECURE = True
#     CSRF_COOKIE_SECURE = True

#     SESSION_COOKIE_HTTPONLY = True
#     SESSION_COOKIE_SAMESITE = "None"

#     CSRF_COOKIE_SAMESITE = "None"
#     CSRF_COOKIE_HTTPONLY = False

# else:

#     SECURE_SSL_REDIRECT = False

#     SESSION_COOKIE_SECURE = False
#     CSRF_COOKIE_SECURE = False

#     SESSION_COOKIE_SAMESITE = "Lax"
#     CSRF_COOKIE_SAMESITE = "Lax"



# # ==========================================================
# # CELERY
# # ==========================================================


# CELERY_BROKER_URL = os.getenv(

#     "REDIS_URL",

#     "redis://localhost:6379/0"

# )



# CELERY_RESULT_BACKEND = os.getenv(

#     "REDIS_URL",

#     "redis://localhost:6379/0"

# )



# CELERY_ACCEPT_CONTENT = ["json"]

# CELERY_TASK_SERIALIZER = "json"

# CELERY_RESULT_SERIALIZER = "json"

# CELERY_TIMEZONE = "Africa/Luanda"


# CELERY_TASK_ACKS_LATE = True

# CELERY_WORKER_PREFETCH_MULTIPLIER = 1

# CELERY_WORKER_MAX_TASKS_PER_CHILD = 50



# CELERY_BEAT_SCHEDULE = {


#     "rotina-geral":

#     {

#         "task":
#         "administracao.tasks.rotina_automatica_sistema",

#         "schedule":
#         crontab(minute="*/5"),

#     },


#     "atualizar-estados":

#     {

#         "task":
#         "livros.tasks.atualizar_estados",

#         "schedule":
#         crontab(minute="*/5"),

#     },


# }


# # ==========================================================
# # EMAIL CONFIGURATION (DEV + PROD)
# # ==========================================================
# EMAIL_ENABLED = os.getenv(
#     "EMAIL_ENABLED",
#     "True"
# ).lower() == "true"


# if EMAIL_ENABLED:

#     EMAIL_BACKEND = (
#         "django.core.mail.backends.smtp.EmailBackend"
#     )

#     EMAIL_HOST = os.getenv(
#         "EMAIL_HOST",
#         "smtp.gmail.com"
#     )

#     EMAIL_PORT = int(
#         os.getenv(
#             "EMAIL_PORT",
#             587
#         )
#     )

#     EMAIL_USE_TLS = True


#     EMAIL_HOST_USER = os.getenv(
#         "EMAIL_HOST_USER"
#     )


#     EMAIL_HOST_PASSWORD = os.getenv(
#         "GMAIL_API_KEY"
#     )


# else:

#     # Desenvolvimento sem envio real
#     EMAIL_BACKEND = (
#         "django.core.mail.backends.console.EmailBackend"
#     )



# DEFAULT_FROM_EMAIL = os.getenv(
#     "DEFAULT_FROM_EMAIL",
#     "Biblioteca IPIL <no-reply@bibliotecaipil.com>"
# )



# # EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"


# # EMAIL_HOST = "smtp.gmail.com"

# # EMAIL_PORT = 587

# # EMAIL_USE_TLS = True


# # EMAIL_HOST_USER = os.getenv(
# #     "EMAIL_HOST_USER"
# # )


# # EMAIL_HOST_PASSWORD = os.getenv(
# #     "GMAIL_API_KEY"
# # )


# # DEFAULT_FROM_EMAIL = (
# #     "Biblioteca IPIL <no-reply@bibliotecaipil.com>"
# # )



# # ==========================================================
# # CLOUDINARY
# # ==========================================================


# cloudinary.config(

#     cloud_name=os.getenv("CLOUD_NAME"),

#     api_key=os.getenv("CLOUD_API_KEY"),

#     api_secret=os.getenv("CLOUD_API_SECRET"),

#     secure=True

# )


# DEFAULT_FILE_STORAGE = (
#     "cloudinary_storage.storage.MediaCloudinaryStorage"
# )














"""
Django settings for bibliotecaipil project.
"""

from pathlib import Path
from datetime import timedelta
import os
from celery.schedules import crontab
import dj_database_url
import cloudinary
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


print("=" * 60)
print("ESTOU A USAR O SETTINGS NOVO")
print(__file__)
print("=" * 60)

# ==========================================================
# BASE
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-key-change-in-production"
)

# =========================
# ENV MODE (LOCAL / PROD)
# =========================
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
print("ENV DEBUG =", os.getenv("DEBUG"))

ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "127.0.0.1,localhost,bbltcipil.onrender.com"
).split(",")




# ==========================================================
# APPLICATIONS
# ==========================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",
    "django_filters",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",

    "livros.apps.LivrosConfig",
    "accounts.apps.AccountsConfig",
    "administracao.apps.AdministracaoConfig",
    "ai_assistant.apps.AiAssistantConfig",
    "audit.apps.AuditConfig",

    "cloudinary",
    "cloudinary_storage",
]


# ==========================================================
# MIDDLEWARE
# ==========================================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "administracao.middleware.CurrentUserMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "audit.middleware.AuditMiddleware",
]


# ==========================================================
# URLS & WSGI
# ==========================================================

ROOT_URLCONF = "bibliotecaipil.urls"
WSGI_APPLICATION = "bibliotecaipil.wsgi.application"


# ==========================================================
# DATABASE (PRODUCTION READY)
# ==========================================================
print("Todas as variáveis:", list(os.environ.keys()))

print("=" * 50)
print("DATABASE_URL =", os.getenv("DATABASE_URL"))
print("=" * 50)

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'bibliotecaipil',
            'USER': 'postgres',
            'PASSWORD': '1234',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }

# ==========================================================
# PASSWORD VALIDATION
# ==========================================================

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ==========================================================
# TEMPLATES
# ==========================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ==========================================================
# DRF
# ==========================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
    ),
}


# ==========================================================
# JWT
# ==========================================================

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}


# ==========================================================
# CORS / CSRF (FRONTEND VERCEL + LOCAL)
# ==========================================================

CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,https://bibliotecaipil2026.vercel.app"
).split(",")


CSRF_TRUSTED_ORIGINS = os.getenv(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,https://bibliotecaipil2026.vercel.app,https://bbltcipil.onrender.com"
).split(",")


CORS_ALLOW_CREDENTIALS = True


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


print(FRONTEND_URL)

# FRONTEND_URL = "http://localhost:5173"
# "https://bibliotecaipil2026.vercel.app"

# ==========================================================
# INTERNATIONALIZATION
# ==========================================================

LANGUAGE_CODE = "pt-pt"
TIME_ZONE = "Africa/Luanda"

USE_I18N = True
USE_TZ = True


# ==========================================================
# STATIC FILES
# ==========================================================

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"



# ==========================================================
# SECURITY (PROD ONLY)
# ==========================================================

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)

if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"

    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"

    CSRF_COOKIE_SAMESITE = "None"
    SESSION_ENGINE = "django.contrib.sessions.backends.db"


# ==========================================================
# CELERY (LOCAL + RENDER + UPSTASH REDIS)
# ==========================================================

CELERY_BROKER_URL = os.getenv(
    "REDIS_URL",
    "redis://localhost:6379/0"
)

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_TIMEZONE = "Africa/Luanda"

CELERY_RESULT_BACKEND = os.getenv(
    "REDIS_URL",
    "redis://localhost:6379/0"
)

CELERY_RESULT_SERIALIZER = "json"

CELERY_TASK_ACKS_LATE = True

CELERY_WORKER_PREFETCH_MULTIPLIER = 1

CELERY_WORKER_MAX_TASKS_PER_CHILD = 50


CELERY_BEAT_SCHEDULE = {
    "rotina-geral": {
        "task": "administracao.tasks.rotina_automatica_sistema",
        "schedule": crontab(minute="*/5"),
    },
    "atualizar-estados": {
        "task": "livros.tasks.atualizar_estados",
        "schedule": crontab(minute="*/5"),
    },
}




# ==========================================================
# EMAIL (GMAIL SMTP - DEV)
# ==========================================================
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("GMAIL_API_KEY")

DEFAULT_FROM_EMAIL = "Biblioteca IPIL <no-reply@bibliotecaipil.com>"


cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET"),
    secure=True
)
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"


print("=" * 50)
print("DEBUG =", DEBUG)
print("SECURE_SSL_REDIRECT =", globals().get("SECURE_SSL_REDIRECT"))
print("=" * 50)

