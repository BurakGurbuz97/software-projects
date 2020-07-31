from django.views.generic import TemplateView

from product.models import Product, StatusChoices


class HomePageView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        products = Product.objects.filter(
            status=StatusChoices.PUBLIC
        ).select_related("category").prefetch_related("images", "tags")
        context["products"] = products
        return context
