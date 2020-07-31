from django.urls import path
from django.conf.urls import url
from . import views

app_name = 'listing'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('<slug:slug>', views.product_list, name='product_list'),
    path('search', views.search, name='search'),
    url(r'^filter', views.filter, name='filter'),
]
