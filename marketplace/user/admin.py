from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as AbstractUserAdmin
from django.utils.translation import ugettext_lazy as _

from user.forms import UserCreationForm
from user.models import User


@admin.register(User)
class UserAdmin(AbstractUserAdmin):
    """Custom user in Django Admin."""
    add_form = UserCreationForm
    list_display = ('pk', '__str__', 'first_name', 'last_name', 'is_staff', 'is_active', 'updated_at',)
    list_filter = ('date_joined', 'is_active', 'is_staff', 'is_superuser', 'groups',)
    fieldsets = (
        (_('Account Info'), {
            'fields': (('first_name', 'last_name'), 'username', 'email', 'groups',
                       'is_active', ('is_staff', 'is_superuser'),)
        }),
        (_('Password'), {
            'fields': ('password',)
        }),
        (_('Stamps'), {
            'fields': (('date_joined', 'updated_at'), 'last_login',)
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    readonly_fields = ('date_joined', 'updated_at', 'last_login')
    search_fields = ('username', 'email', 'first_name', 'last_name',)
