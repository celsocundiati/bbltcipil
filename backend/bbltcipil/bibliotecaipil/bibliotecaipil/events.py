from celery import shared_task

EVENT_HANDLERS = {}

def register_event(event_name):
    def decorator(func):
        if event_name not in EVENT_HANDLERS:
            EVENT_HANDLERS[event_name] = []
        EVENT_HANDLERS[event_name].append(func)
        return func
    return decorator

def emit_event(event_name, payload: dict):
    process_event.delay(event_name, payload)

@shared_task
def process_event(event_name, payload):
    handlers = EVENT_HANDLERS.get(event_name, [])
    for handler in handlers:
        try:
            handler(payload)
        except Exception as e:
            print(f"❌ Erro no handler {handler.__name__}: {e}")



