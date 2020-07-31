from django.utils.translation import ugettext_lazy as _
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from django.core.validators import validate_slug
from django.contrib.auth.forms import UserCreationForm as BaseUserCreationForm, UsernameField
from user.models import User


class LoginForm(forms.Form):
    error_css_class = 'is-invalid'
    email = forms.EmailField(
        label=_("Email"),
        required=True,
        widget=forms.EmailInput(attrs={
            'placeholder': _("Email *"),
            'class': 'form-control'
        })
    )

    password = forms.CharField(
        label=_("Password"),
        required=True,
        min_length=5,
        widget=forms.PasswordInput(attrs={
            'placeholder': _("Password *"),
            'class': 'form-control'
        })
    )
    next_url = forms.CharField(max_length=254, widget=forms.HiddenInput(), required=False)

    def __init__(self, *args, **kwargs):
        try:
            self.next_url_kw = kwargs.pop('next_url')
        except KeyError:
            self.next_url_kw = ''
        super().__init__(*args, **kwargs)
        self.fields['next_url'].initial = self.next_url_kw

    def clean(self):
        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")
        user = User.objects.filter(email=email).first()
        if not user:
            self.add_error("email", _("User with that email address is not registered!"))
        elif not check_password(password, user.password):
            self.add_error("password", _("Incorrect password"))


class RegistrationForm(forms.ModelForm, LoginForm):
    first_name = forms.CharField(
        label=_("First Name"),
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': _("First Name"),
            'class': 'form-control'
        })
    )

    last_name = forms.CharField(
        label=_("Last Name"),
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': _("Last Name"),
            'class': 'form-control'
        })
    )

    username = forms.CharField(
        label=_("Username"),
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': _("Username"),
            'class': 'form-control'
        }),
        validators=[validate_slug]
    )

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'username']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise ValidationError(_("A user with that email address already exists."))
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data.get('password'))
        if commit:
            user.save()
        return user


class UserCreationForm(BaseUserCreationForm):
    class Meta:
        model = User
        fields = ("username", "email")
        field_classes = {'username': UsernameField}
