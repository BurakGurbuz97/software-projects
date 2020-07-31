import sys
from io import BytesIO
from typing import Union

from PIL import Image, ExifTags
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.db.models import Avg
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _

from tags.models import Tag


def get_product_image_path(instance, filename):
    extension = filename.split(".")[-1]
    file_name = instance.slug
    year = now().year
    return f"products/{year}/{file_name}.{extension}"


class StatusChoices(models.IntegerChoices):
    DRAFT = 1, _("Draft")
    PUBLIC = 2, _("Public")
    HIDDEN = 3, _("Hidden")


class ProductCategory(models.Model):
    """Categories for products."""
    name = models.CharField(_("Name"), max_length=100)
    slug = models.SlugField(_("Slug"), max_length=50, unique=True)
    description = models.TextField(_("Description"), blank=True)
    template_icon = models.CharField(_("Template icon"), max_length=50, blank=True, null=True)
    rank = models.IntegerField(_("Order rank"), default=1)
    created_at = models.DateTimeField(_("Created"), auto_now_add=True, editable=False)
    modified_at = models.DateTimeField(_("Modified"), auto_now=True, editable=False)

    class Meta:
        verbose_name = _("Product category")
        verbose_name_plural = _("Product categories")
        ordering = ("rank",)

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    """Product definition."""
    name = models.CharField(_("Name"), max_length=255, blank=False, null=False)
    slug = models.SlugField(_("Slug"), max_length=50, unique=True)
    category = models.ForeignKey(
        ProductCategory, verbose_name=_("Category"), related_name="products", on_delete=models.CASCADE,
        blank=False, null=False
    )
    description = models.TextField(_("Description"), blank=True)
    price = models.FloatField(_("Price"), default=0.0)
    available_quantity = models.IntegerField(_("Available quantity"), default=0, null=True, blank=True)
    barcode = models.CharField(_("Barcode"), max_length=20, null=True, blank=True)
    tags = models.ManyToManyField(Tag, verbose_name=_("Tags"), related_name="products", blank=True)
    status = models.IntegerField(_("Status"), choices=StatusChoices.choices, default=StatusChoices.DRAFT)
    created_at = models.DateTimeField(_("Created"), auto_now_add=True, editable=False)
    modified_at = models.DateTimeField(_("Modified"), auto_now=True, editable=False)

    @property
    def main_image(self):
        return self.images.order_by("rank", "modified_at").first()

    @property
    def average_rating(self) -> Union[int, None]:
        try:
            return int(self.comments.all().aggregate(avg_rating=Avg("rate"))["avg_rating"])
        except TypeError:
            return None

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        ordering = ("modified_at",)

    def __str__(self) -> str:
        return self.name


class ProductImages(models.Model):
    """Image library for the product."""
    title = models.CharField(_("Title"), max_length=255, blank=False, null=False)
    slug = models.SlugField(_("Slug"), max_length=50, unique=True)
    product = models.ForeignKey(
        Product, verbose_name=_("Product"), related_name="images", on_delete=models.CASCADE,
        blank=False, null=False
    )
    image = models.ImageField(_("Image"), upload_to=get_product_image_path)
    rank = models.IntegerField(_("Rank"), default=2)
    created_at = models.DateTimeField(_("Created"), auto_now_add=True, editable=False)
    modified_at = models.DateTimeField(_("Modified"), auto_now=True, editable=False)

    class Meta:
        verbose_name = _("Product image")
        verbose_name_plural = _("Product images")
        ordering = ("rank", "modified_at")

    def __str__(self) -> str:
        return "{title} for {product}".format(title=self.title, product=self.product.name)

    def save(self, *args, **kwargs):
        im = Image.open(self.image)
        output = BytesIO()
        min_size = 256
        orientation = 0
        # find rotation exif tag
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        try:
            exif = dict(im._getexif().items())
            if exif[orientation] == 3:
                im = im.rotate(180, expand=True)
            elif exif[orientation] == 6:
                im = im.rotate(270, expand=True)
            elif exif[orientation] == 8:
                im = im.rotate(90, expand=True)
        except (AttributeError, KeyError, IndexError):
            pass
        im = im.convert("RGB")
        x, y = im.size
        size = max(min_size, x, y)
        new_im = Image.new('RGB', (size, size), (255, 255, 255))
        new_im.paste(im, (int((size - x) / 2), int((size - y) / 2)))
        new_im.save(output, format='JPEG', quality=100)
        output.seek(0)
        self.image = InMemoryUploadedFile(
            output, 'ImageField', "%s.jpg" % self.image.name.split('.')[0],
            'image/jpeg', sys.getsizeof(output), None
        )
        im.close()
        new_im.close()
        super().save(*args, **kwargs)


class PropertyOption(models.Model):
    name = models.CharField(_("Property name"), max_length=100, unique=True)

    class Meta:
        verbose_name = _("Property option")
        verbose_name_plural = _("Property options")
        ordering = ("name",)

    def __str__(self):
        return self.name


class ProductProperty(models.Model):
    product = models.ForeignKey(
        Product, verbose_name=_("Product"), related_name="properties", on_delete=models.CASCADE
    )
    option = models.ForeignKey(
        PropertyOption, verbose_name=_("Option"), related_name="usages", on_delete=models.CASCADE
    )
    value = models.CharField(_("Value"), max_length=255)
    is_main_property = models.BooleanField(_("Main property"), default=False)

    class Meta:
        verbose_name = _("Product property")
        verbose_name_plural = _("Product properties")
        ordering = ("product", "option")
        unique_together = ["product", "option"]
