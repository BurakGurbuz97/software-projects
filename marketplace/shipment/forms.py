from django import forms
from django.utils.translation import ugettext_lazy as _

from shipment.models import Shipment


class ShipmentForm(forms.ModelForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": _("Email")}))

    class Meta:
        model = Shipment
        fields = ["address_id", "address_name", "name", "surname", "email", "phone",
                  "city", "district", "neighborhood", "others", "extra"]
