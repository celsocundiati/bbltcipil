import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bibliotecaipil.settings")

# 🔥 GARANTIR DJANGO READY
import django
django.setup()

app = Celery("bibliotecaipil")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()

""" 
@app.on_after_finalize.connect
def setup_ai(sender, **kwargs):
    from ai_assistant.rag_engine import preload
    preload() 
"""




