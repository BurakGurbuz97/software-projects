def current_shipment(request):
    if request.user.is_authenticated:
        return {"authenticated": "correct"}
