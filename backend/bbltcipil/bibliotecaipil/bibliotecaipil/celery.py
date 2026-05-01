# import os
# from celery import Celery

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bibliotecaipil.settings")

# app = Celery("bibliotecaipil")

# app.config_from_object("django.conf:settings", namespace="CELERY")

# app.autodiscover_tasks()



import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bibliotecaipil.settings")

app = Celery("bibliotecaipil")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


# 🔥 GARANTE IMPORT DOS EVENTOS
@app.on_after_finalize.connect
def load_event_system(sender, **kwargs):
    import bibliotecaipil.event_bootstrap


