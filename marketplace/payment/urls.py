from django.urls import path
from payment.views import PaymentView, mail_view

app_name = 'payment'

urlpatterns = [
    path('',PaymentView.as_view(), name="cart"),
    path('confirm/',mail_view, name="confirm_payment")
]