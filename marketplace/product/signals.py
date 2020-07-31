from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
import os

from product.models import ProductImages


@receiver(post_delete, sender=ProductImages)
def remove_image_after_delete(sender, instance: ProductImages, **__):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


@receiver(pre_save, sender=ProductImages)
def remove_image_on_change(sender, instance: ProductImages, **__):
    if not instance.pk:
        return
    old_instance = ProductImages.objects.get(pk=instance.pk)
    if not old_instance.image == instance.image:
        if os.path.isfile(old_instance.image.path):
            os.remove(old_instance.image.path)
