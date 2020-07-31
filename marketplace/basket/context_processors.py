from basket.models import Basket


def current_basket(request):
    """Basket for the current user."""
    basket = None
    if request.user.is_authenticated:
        basket = Basket.current_basket(user=request.user)
    return {
        "basket": basket
    }
