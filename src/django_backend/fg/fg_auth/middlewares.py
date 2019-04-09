from django.contrib.auth.middleware import RemoteUserMiddleware
from django.contrib.sessions.middleware import SessionMiddleware
from django.conf import settings


class ProxyRemoteUserMiddleware(RemoteUserMiddleware):
    header = 'HTTP_REMOTE_USER'


class DisableCSRF(SessionMiddleware):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)
