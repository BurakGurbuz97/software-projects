from django.contrib import admin

from comment.models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("pk", "author", "product", "rate", "subject", "verified", "created_at", "modified_at")
    list_filter = ("verified", "created_at", "modified_at")
    search_fields = ("subject", "author__first_name", "author__last_name", "author__email")
    autocomplete_fields = ("author", "product")
