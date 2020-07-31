from django.shortcuts import render
from django.template import loader
from django.views.generic import TemplateView, View
from basket.models import Basket, BasketItem
from shipment.models import Shipment
from django.shortcuts import render
from marketplace.settings import EMAIL_HOST_USER
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from shipment.models import Shipment

# Create your views here.


class PaymentView(TemplateView):
    template_name = "payment/detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user
        basket = Basket.current_basket(user=self.request.user)

        basket_items = BasketItem.objects.filter(
            basket=basket,
        )
        context['basket_items'] = basket_items

        subtotal = sum(basket_item.product.price for basket_item in basket_items)
        context['subtotal'] = subtotal

        total = 0
        if basket:
            total = basket.coupon_code.get_discounted_value(subtotal) if basket.coupon_code else subtotal
        context['total'] = total

        context['discount'] = total - subtotal
        shipments = Shipment.objects.filter(user=self.request.user)
        for shipment in shipments:
            if shipment.selection == 2 or shipment.selection == 3:
                context['name'] = shipment.name
                context['surname'] = shipment.surname
                context['email'] = shipment.email
                context['neighborhood'] = shipment.neighborhood
                context['others'] = shipment.others
                context['district'] = shipment.district
                context['city'] = shipment.get_city_display()

        return context


def mail_view(request):
    if request.method == 'POST':
        recipient = request.POST.get('email')
        domain = request.get_host()
        print(domain)
        basket = Basket.current_basket(user=request.user)

        basket_items = BasketItem.objects.filter(
            basket=basket,
        )
        subtotal = sum(basket_item.product.price for basket_item in basket_items)
        total = 0
        if basket:
            total = basket.coupon_code.get_discounted_value(subtotal) if basket.coupon_code else subtotal
        discount = total - subtotal
        subject = 'Your order has been received'
        shipment = Shipment.objects.filter(user=request.user).values()
        for element in shipment:
            Address_name = element['name']
            Address_surname = element['surname']
            Address_email = element['email']
            Address_neighborhood = element['neighborhood']
            Address_district = element['district']
            Address_city = element['city']
        html_message = render_to_string('payment/mail_template.html', {'user': request.user, 'basket_items':basket_items, 'subtotal':subtotal, 'total':total, 'discount':discount,'neighborhood':Address_neighborhood, 'district':Address_district, 'city':Address_city, 'name':Address_name, 'surname':Address_surname})
        plain_message = strip_tags(html_message)
        send_mail(subject,
            plain_message, EMAIL_HOST_USER, [recipient], html_message=html_message)
    return render(request, 'payment/modal.html', {'total': total})
