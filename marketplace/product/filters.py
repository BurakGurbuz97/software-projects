from django_filters.rest_framework import FilterSet, BooleanFilter, ChoiceFilter
from product.models import Product, StatusChoices


class ProductFilter(FilterSet):
    has_images = BooleanFilter(method='filter_has_images', label="Has images")
    in_stock = BooleanFilter(method='filter_in_stock', label="In stock")
    status = ChoiceFilter(field_name='status', choices=StatusChoices.choices)

    @staticmethod
    def filter_has_images(queryset, name, value):  # NOQA
        if not isinstance(value, bool):
            return queryset
        if value:
            return queryset.filter(images__isnull=False).distinct()
        return queryset.filter(images__isnull=True)

    @staticmethod
    def filter_in_stock(queryset, name, value):  # NOQA
        if not isinstance(value, bool):
            return queryset
        if value:
            return queryset.filter(available_quantity__gt=0).distinct()
        return queryset.filter(available_quantity=0)

    class Meta:
        model = Product
        fields = [
            'category__slug', 'status', 'barcode', 'has_images', 'in_stock'
        ]
