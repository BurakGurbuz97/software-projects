from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include
from django.views.static import serve

from comment.views import BasicCommandCreateView
# from core.views import HomePageView
from listing.views import IndexView
from product.views import ProductDetailsView
from user.views import login_ajax_view, register_ajax_view, logout_user_view


urlpatterns = i18n_patterns(
    path('admin/', admin.site.urls),
    path('product/<slug:slug>/comments/add/', BasicCommandCreateView.as_view(), name="add_comment"),
    path('product/<slug:slug>/', ProductDetailsView.as_view(), name="product_details"),
    path('basket/', include('basket.urls')),
    path('shipment/', include('shipment.urls')),
    path('listing/', include('listing.urls')),
    path('payment/', include('payment.urls', namespace='payment')),
    path('register', register_ajax_view, name="register"),
    path('login/', login_ajax_view, name="login"),
    path('logout/', logout_user_view, name="logout"),
    path('', IndexView.as_view(), name="homepage"),
)

if settings.DEBUG:
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns += [
            path('__debug__/', include(debug_toolbar.urls)),
        ]
    urlpatterns += [path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT})]
