from django.shortcuts import render
from django.views import generic
from product.models import Product
import re

class IndexView(generic.ListView):
    template_name = 'listing/index.html'
    context_object_name = 'products'

    def get_queryset(self):
        sample_entities = Product.objects.order_by('?')[:5]
        return sample_entities

#List products
def product_list(request, slug):
    if slug[:6] == 'search':
        return search(request)
        
    products = Product.objects.filter(category__slug = slug)
    context = {'products': products, "category": slug, "show_filter": True}
    return render(request, 'listing/product_list.html', context)


def is_valid_queryparam(param):
    return param != '' and param is not None

def filter(request):
    slug = request.GET["category"]
    products = Product.objects.filter(
        category__slug=slug)
    
    min_price = request.GET.get('min-price')
    if is_valid_queryparam(min_price):
        products = products.filter(price__gte  =  min_price)
        
    max_price = request.GET.get('max-price')
    if is_valid_queryparam(max_price):
        products = products.filter(price__lte  =  max_price)
    
    
    price_and_category_filtered = products
    
    brand_vodafone = request.GET.get('Vodafone')
    brand_samsung = request.GET.get('Samsung')
    brand_iphone = request.GET.get('Iphone')
    brand_huawei = request.GET.get('Huawei')
    brand_xiaomi = request.GET.get('Xiaomi')
    
    
    all_products = []
    flag = True
    if brand_vodafone == 'on':
        products = price_and_category_filtered.filter(description__icontains="Vodafone") | price_and_category_filtered.filter(description__icontains="Vodafone")
        all_products += products
        flag = False
    if brand_iphone == 'on':
        products = price_and_category_filtered.filter(description__icontains="Iphone") | price_and_category_filtered.filter(name__icontains="Iphone")
        all_products += products
        flag = False
    if brand_samsung == 'on':
        products = price_and_category_filtered.filter(description__icontains="Samsung") | price_and_category_filtered.filter(name__icontains="Samsung")
        all_products += products
        flag = False
    if brand_xiaomi == 'on':
        products = price_and_category_filtered.filter(description__icontains="Xiaomi") | price_and_category_filtered.filter(name__icontains="Xiaomi")
        all_products += products
        flag = False
    if brand_huawei == 'on':
        products = price_and_category_filtered.filter(description__icontains="Huawei") | price_and_category_filtered.filter(name__icontains="Huawei")
        all_products += products
        flag = False
    
    
    context = {'products': price_and_category_filtered if flag else all_products, "category": slug, "show_filter": False}
    return render(request, 'listing/product_list.html', context)

def search(request):
    searchText = request.GET['searchText']
    allProducts = Product.objects.all()
    foundProducts = []
    for product in allProducts:
         if(regexSearch(searchText.lower(), product.name.lower())):
            foundProducts.append(product)
         elif(regexSearch(searchText.lower(), product.description.lower())):
            foundProducts.append(product)
    
    context = {'products': foundProducts}
    return render(request, 'listing/product_list.html', context)


#Search utility function
def regexSearch(searchText, sentence):
    for x in range(0, len(searchText)):
        sText = searchText[:x] + '.' + searchText[x+1:]
        result = re.search(sText, sentence)
        if result is not None:
            return True
        
        
    return False
