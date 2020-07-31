from django.db import models
from django.utils.translation import ugettext_lazy as _

from product.models import Product
from user.models import User


class Comment(models.Model):
    author = models.ForeignKey(User, verbose_name=_("Author"), related_name="comments", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, verbose_name=_("Product"), related_name="comments", on_delete=models.CASCADE)
    rate = models.IntegerField(_("Rate"), default=100)
    subject = models.CharField(_("Subject"), max_length=200, blank=True, null=True)
    message = models.TextField(_("Comment"), blank=True, null=True)
    verified = models.BooleanField(_("Verified"), default=False)
    created_at = models.DateTimeField(_("Created"), auto_now_add=True, editable=False)
    modified_at = models.DateTimeField(_("Modified"), auto_now=True, editable=False)

    class Meta:
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")
        ordering = ("-modified_at",)

    def __str__(self):
        name = self.author.__str__()
        return f"{name} - {self.rate}"
