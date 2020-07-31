from django.test import TestCase
from user.apps import UserConfig
from user.models import User
from user.forms import RegistrationForm


class UserManagerTestCase(TestCase):
    email = "tester@debugwith.me"
    username = "tester"

    def test_apps(self):
        self.assertEqual(UserConfig.name, 'user')

    def test_create_user(self):
        user = User.objects.create_user(username=self.username, email=self.email, password="test")
        self.assertEqual(user.email, self.email)
        self.assertEqual(user.username, self.username)
        self.assertTrue(user.has_usable_password())
        self.assertEqual(user.__str__(), self.username)

    def test_empty_username(self):
        user = User.objects.create_user(email=self.email, username=None)
        self.assertTrue(bool(user.username))

    def test_empty_email(self):
        user = User.objects.create_user(username=self.username)
        self.assertEqual(user.email, '')

    def test_empty_password(self):
        user = User.objects.create_user(email=self.email, username=self.username)
        self.assertTrue(user.has_usable_password())

    def test_form_email(self):
        data = {'email': self.email, 'password': "test123"}
        form = RegistrationForm(data)
        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertNotEqual(user.password, "test123")
        form = RegistrationForm(data)
        self.assertFalse(form.is_valid())
        self.assertEqual(list(form.errors.keys()), ['email'])
