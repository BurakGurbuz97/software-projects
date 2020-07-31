from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.db import models
from user.managers import UserManager


__all__ = ['User']


class User(AbstractUser):
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    def __str__(self):
        if self.full_name:
            return self.full_name
        return self.username

    @property
    def created_at(self):
        return self.date_joined

    @property
    def full_name(self) -> str:
        return self.get_full_name()

    @property
    def is_registered(self):
        return bool(self.email)

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ('date_joined',)
        db_table = 'auth_user'
