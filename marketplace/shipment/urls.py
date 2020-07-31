from django.urls import path

from shipment.views import save_shipment, confirm_shipment,add_shipment

urlpatterns = [
    path('confirm/', confirm_shipment, name="confirm_shipment"),
    path('save/', save_shipment, name="save_shipment"),
    path('', add_shipment, name="add_shipment"),
]
