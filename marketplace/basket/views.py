from django.http import (
    JsonResponse,
    QueryDict,
)
from django.utils.translation import ugettext_lazy as _
from django.views.generic import (
    TemplateView,
    View,
)

from product.models import Product
from .models import (
    Basket,
    BasketItem,
    Coupon,
)


class BasketDetailView(TemplateView):
    template_name = "basket/detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user

        basket = Basket.current_basket(user=self.request.user)
        context['basket'] = basket

        basket_items = BasketItem.objects.filter(basket=basket)
        context['basket_items'] = basket_items

        subtotal = sum(basket_item.product.price * basket_item.quantity for basket_item in basket_items)
        context['subtotal'] = subtotal
        context['discount'] = basket.total - subtotal
        context['total'] = basket.total

        return context


class BasketManagementAjaxView(View):
    def __init__(self, *args, **kwargs):
        self.basket = None
        super(BasketManagementAjaxView, self).__init__(*args, **kwargs)

    def serialize_basket(self) -> dict:
        """Serialize simple basket details without item details."""
        return {
            "total": self.basket.total
        }

    def get(self, request, **kwargs):
        """Get basket details."""
        raise NotImplementedError

    def post(self, request, **kwargs):
        """Add product to the basket."""
        self.basket = Basket.current_basket(user=request.user)

        product_slug = request.POST.get("product_slug")
        if not product_slug:
            return JsonResponse(
                data={
                    "code": "missing_product_slug",
                    "message": _("Product information was not found.")
                },
                safe=False,
                status=400,
            )
        product = Product.objects.filter(slug=product_slug).first()
        if not product:
            return JsonResponse(
                data={
                    "code": "product_not_found",
                    "message": _("Product information was not found.")
                },
                safe=False,
                status=404,
            )

        try:
            quantity = int(request.POST.get("quantity", 1))
        except ValueError:
            return JsonResponse(
                data={
                    "code": "incorrect_quantity",
                    "message": _("Please, specify a quantity for the item!")
                },
                safe=False,
                status=400,
            )
        if quantity < 1:
            return JsonResponse(
                data={
                    "code": "incorrect_quantity",
                    "message": _("Please, specify a quantity for the item!")
                },
                safe=False,
                status=400,
            )

        try:
            basket_item = BasketItem.objects.get(basket=self.basket, product=product)
            basket_item.quantity = quantity
            basket_item.save()
        except BasketItem.DoesNotExist:
            basket_item = BasketItem.objects.create(
                basket=self.basket, product=product, quantity=quantity
            )

        self.basket = self.basket.update_total_amount(commit=True)
        basket_data = self.serialize_basket()

        return JsonResponse(
            data={
                "code": "success",
                "message": _("Basket updated"),
                "item_id": basket_item.pk, **basket_data
            },
            safe=False,
            status=200,
        )

    def patch(self, request, **kwargs):
        """Update basket and basket item details like coupon, quantity etc."""
        self.basket = Basket.current_basket(user=request.user)
        data = QueryDict(request.body)

        coupon_code = data.get("coupon_code")
        if coupon_code is not None:
            try:
                self.basket.coupon_code = Coupon.objects.get(code=coupon_code)
            except Coupon.DoesNotExist:
                self.basket.coupon_code = None
            else:
                self.basket.save()

        basket_item_id = data.get("basket_item_id")
        if basket_item_id is not None:
            try:
                basket_item = BasketItem.objects.get(id=basket_item_id)
                quantity = int(data.get("quantity"))
            except (BasketItem.DoesNotExist, ValueError):
                pass
            else:
                if quantity == 0:
                    basket_item.delete()
                elif quantity > 0:
                    basket_item.quantity = quantity
                    basket_item.save()

        self.basket = self.basket.update_total_amount(commit=True)

        return JsonResponse(
            data={
                "code": "success",
                "message": _("Basket updated"),
            },
            safe=False,
            status=200,
        )

    def delete(self, request, **kwargs):
        """Delete basket and related basket items"""
        self.basket = Basket.current_basket(user=request.user)
        self.basket.delete()

        return JsonResponse(
            data={
                "code": "success",
                "message": _("Basket deleted"),
            },
            safe=False,
            status=200,
        )


def delete_basket_item(request, basket_item_id):
    if request.method != 'DELETE':
        return JsonResponse(
            data={
                "code": "method_not_implemented",
                "message": _("Method not implemented.")
            },
            safe=False,
            status=501,
        )

    try:
        basket_item = BasketItem.objects.get(id=basket_item_id)
    except BasketItem.DoesNotExist:
        return JsonResponse(
            data={
                "code": "basket_item_not_found",
                "message": _("Basket item was not found.")
            },
            safe=False,
            status=404,
        )

    basket_item.delete()
    basket_item.basket.update_total_amount(commit=True)

    return JsonResponse(
        data={
            "code": "success",
            "message": _("Basket item deleted"),
        },
        safe=False,
        status=200,
    )
