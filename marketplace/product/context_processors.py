from product.models import ProductCategory


def product_categories(request):
    """All product categories."""
    return {
        "categories": ProductCategory.objects.all().order_by("rank")
    }
