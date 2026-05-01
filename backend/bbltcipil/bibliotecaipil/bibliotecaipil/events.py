# from celery import shared_task
# EVENT_HANDLERS = {}

# def register_event(event_name):
#     def decorator(func):
#         if event_name not in EVENT_HANDLERS:
#             EVENT_HANDLERS[event_name] = []
#         EVENT_HANDLERS[event_name].append(func)
#         return func
#     return decorator

# def emit_event(event_name, payload: dict):
#     process_event.delay(event_name, payload)

# @shared_task
# def process_event(event_name, payload):
#     handlers = EVENT_HANDLERS.get(event_name, [])
#     for handler in handlers:
#         try:
#             handler(payload)
#         except Exception as e:
#             print(f"❌ Erro no handler {handler.__name__}: {e}")



# from celery import shared_task

# EVENT_HANDLERS = {}


# def register_event(event_name):
#     def decorator(func):
#         EVENT_HANDLERS.setdefault(event_name, [])
#         EVENT_HANDLERS[event_name].append(func)
#         return func
#     return decorator


# def emit_event(event_name, payload: dict):
#     process_event.delay(event_name, payload)


# @shared_task
# def process_event(event_name, payload):
#     handlers = EVENT_HANDLERS.get(event_name, [])

#     if not handlers:
#         print(f"⚠️ Nenhum handler registado para: {event_name}")
#         return

#     for handler in handlers:
#         try:
#             handler(payload)
#         except Exception as e:
#             print(f"❌ Erro no handler {handler.__name__}: {e}")



from celery import shared_task

# 🔥 Registry global em memória (processo-local)
EVENT_HANDLERS = {}


# ==============================
# REGISTRO DE EVENTOS
# ==============================
def register_event(event_name):
    def decorator(func):
        EVENT_HANDLERS.setdefault(event_name, [])
        EVENT_HANDLERS[event_name].append(func)
        return func
    return decorator


# ==============================
# EMISSÃO DE EVENTOS
# ==============================
def emit_event(event_name, payload: dict):
    """
    Sempre envia para Celery worker processar.
    """
    process_event.delay(event_name, payload)


# ==============================
# PROCESSADOR CELERY
# ==============================
@shared_task
def process_event(event_name, payload):
    handlers = EVENT_HANDLERS.get(event_name)

    if not handlers:
        print(f"⚠️ Nenhum handler registado para: {event_name}")
        return

    print(f"🔥 EVENTO RECEBIDO: {event_name}")
    print(f"📦 PAYLOAD: {payload}")

    for handler in handlers:
        try:
            print(f"⚙️ EXECUTANDO HANDLER: {handler.__name__}")
            handler(payload)
        except Exception as e:
            print(f"❌ ERRO NO HANDLER {handler.__name__}: {e}")



            