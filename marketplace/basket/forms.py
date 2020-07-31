from django import forms
from django.contrib.admin.helpers import ActionForm


class CouponActionForm(ActionForm):
    count = forms.IntegerField()
