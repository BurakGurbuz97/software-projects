from django.urls import path

from . import views

urlpatterns = [
    path("manage/", views.BasketManagementAjaxView.as_view(), name="basket_management_ajax"),
    path("items/<int:basket_item_id>/delete/", views.delete_basket_item, name="basket_item_delete"),
    path("", views.BasketDetailView.as_view(), name="basket"),
]
