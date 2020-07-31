from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import reverse
from django.utils.translation import ugettext_lazy as _

from user.forms import LoginForm, RegistrationForm
from user.models import User


def login_ajax_view(request):
    if request.method == "POST":
        login_form = LoginForm(request.POST)
        result = {}
        if login_form.is_valid():
            email = login_form.cleaned_data.get("email")
            user = User.objects.filter(email=email).first()
            # @TODO move basket data
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            result["code"] = "success"
            result["message"] = _("Logged in")
            return JsonResponse(result, safe=False)
        result["code"] = "error"
        result["message"] = _("Incorrect credentials")
        return JsonResponse(result, safe=False, status=400)
    # @TODO render template with login form
    return JsonResponse({"code": "not-allowed"}, safe=False, status=405)


@login_required
def register_ajax_view(request):
    if request.method == "POST":
        registration_form = RegistrationForm(request.POST)
        result = {}
        if registration_form.is_valid():
            email = registration_form.cleaned_data.get("email")
            password = registration_form.cleaned_data.get("password")
            first_name = registration_form.cleaned_data.get("first_name")
            last_name = registration_form.cleaned_data.get("last_name")
            username = registration_form.cleaned_data.get("username")
            user = request.user
            user.set_password(password)
            user.email = email
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            result["code"] = "success"
            result["message"] = _("Registered")
            return JsonResponse(result, safe=False)
        result["code"] = "error"
        result["errors"] = dict(registration_form.errors.items()),
        result["message"] = registration_form.errors.as_ul()
        return JsonResponse(result, safe=False, status=400)
    return JsonResponse({"code": "not-allowed"}, safe=False, status=405)


def logout_user_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('homepage'))

