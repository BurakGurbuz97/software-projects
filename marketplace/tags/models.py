from django.utils.translation import ugettext_lazy as _
from django.db import models


class Tag(models.Model):
    name = models.CharField(_("Name"), max_length=100, blank=False, null=False)
    slug = models.SlugField(_("Slug"), max_length=50, unique=True)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ('name',)

    def __str__(self) -> str:
        return self.name

    @property
    def product_count(self) -> int:
        return self.products.count()
