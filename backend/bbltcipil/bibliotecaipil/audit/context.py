import threading

_local = threading.local()

def set_current_user(user):
    _local.user = user

def get_current_user():
    return getattr(_local, "user", None)


def set_request_meta(ip=None):
    _local.ip = ip

def get_request_meta():
    return getattr(_local, "ip", None)


def set_trace_id(trace_id):
    _local.trace_id = trace_id

def get_trace_id():
    return getattr(_local, "trace_id", None)