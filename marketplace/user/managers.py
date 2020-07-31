from django.contrib.auth.models import UserManager as BaseUserManager
from uuid import uuid4


class UserManager(BaseUserManager):
    """Custom manager to allow creating a user without any information."""
    def _create_user(self, username=None, email='', password=None, first_name='', last_name='', **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        # if not email:
        #     raise ValueError('The email must be set')
        if not username:
            username = str(uuid4())
        if not password:
            password = self.make_random_password()
        if email is None:
            email = ''
        email = email.lower()
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        if first_name:
            first_name = first_name[:30]
        else:
            first_name = ''
        if last_name:
            last_name = last_name[:150]
        else:
            last_name = ''
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username=username, email=email, password=password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(username, email, password, **extra_fields)
