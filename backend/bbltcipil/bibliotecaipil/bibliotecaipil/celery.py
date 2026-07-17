# import os
# from celery import Celery

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bibliotecaipil.settings")

# app = Celery("bibliotecaipil")
# app.config_from_object("django.conf:settings", namespace="CELERY")
# app.autodiscover_tasks()


# # 🔥 GARANTE IMPORT DOS EVENTOS
# @app.on_after_finalize.connect
# def load_event_system(sender, **kwargs):
#     import bibliotecaipil.event_bootstrap


import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bibliotecaipil.settings")

app = Celery("bibliotecaipil")

app.config_from_object(
    "django.conf:settings",
    namespace="CELERY"
)

app.autodiscover_tasks()

# Configurações do worker
app.conf.update(
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=100,
)

# Regista os handlers de eventos
@app.on_after_finalize.connect
def load_event_system(sender, **kwargs):
    import bibliotecaipil.event_bootstrap

    