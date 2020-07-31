from django.contrib.auth import login
from django.contrib.auth.middleware import MiddlewareMixin

from user.models import User


class SessionUserMiddleware(MiddlewareMixin):
    """Set an anonymous user for the session for cart."""

    def __call__(self, request):
        if request.user.is_anonymous:
            user = User.objects.create_user()
            login(request, user)
        response = self.get_response(request)
        return response


