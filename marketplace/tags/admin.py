from django.contrib import admin
from tags.models import Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_count')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}
