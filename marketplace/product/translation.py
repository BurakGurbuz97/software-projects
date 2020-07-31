from modeltranslation.translator import register, TranslationOptions
from product.models import Product, ProductCategory, ProductImages, PropertyOption, ProductProperty


@register(ProductCategory)
class ProductCategoryTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductImages)
class ProductImagesTranslationOptions(TranslationOptions):
    fields = ("title",)


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(PropertyOption)
class PropertyOptionTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(ProductProperty)
class ProductPropertyTranslationOptions(TranslationOptions):
    fields = ("value",)
