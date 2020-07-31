from payment.views import PaymentView

from django.shortcuts import render, redirect
from shipment.models import Shipment
from shipment.forms import ShipmentForm
from random import random


def split_dict(main_dict):
    final_dict1 = {}
    final_dict2 = {}

    final_dict1['address_name'] = main_dict['address_name'][0]
    final_dict2['address_name'] = main_dict['address_name'][1]
    final_dict1['name'] = main_dict['name'][0]
    final_dict2['name'] = main_dict['name'][1]
    final_dict1['surname'] = main_dict['surname'][0]
    final_dict2['surname'] = main_dict['surname'][1]
    final_dict1['email'] = main_dict['email'][0]
    final_dict2['email'] = main_dict['email'][1]
    final_dict1['phone'] = main_dict['phone'][0]
    final_dict2['phone'] = main_dict['phone'][1]
    final_dict1['city'] = main_dict['city'][0]
    final_dict2['city'] = main_dict['city'][1]
    final_dict1['neighborhood'] = main_dict['neighborhood'][0]
    final_dict2['neighborhood'] = main_dict['neighborhood'][1]
    final_dict1['district'] = main_dict['district'][0]
    final_dict2['district'] = main_dict['district'][1]
    final_dict1['others'] = main_dict['others'][0]
    final_dict2['others'] = main_dict['others'][1]
    final_dict1['extra'] = main_dict['extra'][0]
    final_dict2['extra'] = main_dict['extra'][1]
    return [final_dict1,final_dict2]


def add_shipment(request):
    shipment_list = []

    for element in Shipment.objects.filter(user=request.user):
        element.selection = 0
        element.save()
    for element in Shipment.objects.filter(user=request.user).values():
        form_element = ShipmentForm(element)
        shipment_list += [form_element]

    if request.method == "POST":
        main_dict = dict(request.POST)
        dict_array = split_dict(main_dict)
        address_form = ShipmentForm(dict_array[1])
        bill_form = ShipmentForm(dict_array[0])

    if request.method == "GET":
        address_form = ShipmentForm()
        bill_form = ShipmentForm()

    return render(request, 'add_delivery.html', {"shipment_list": shipment_list,
                                                 "address_form": address_form,
                                                 "bill_form": bill_form})


def confirm_shipment(request):
    main_dict = dict(request.POST)
    dict_array = split_dict(main_dict)
    form1 = ShipmentForm(dict_array[0])
    form2 = ShipmentForm(dict_array[1])
    return render(request, 'confirm_delivery.html', {'form': form1, 'bill_form': form2})


def save_shipment(request):
    if request.method == "POST":
        main_dict = dict(request.POST)
        dict_array = split_dict(main_dict)
        dict_array[0]['address_id'] = int(1000000000*random())
        dict_array[1]['address_id'] = int(1000000000*random())
        form1 = ShipmentForm(dict_array[1])
        form2 = ShipmentForm(dict_array[0])
        if form1.is_valid():
            shipment_form = form1.save(commit=False)
            for element in Shipment.objects.filter(user=request.user):
                if element.address_name == dict_array[1]['address_name']:
                    element.delete()

            shipment_form.user = request.user
            shipment_form.selection = 1
            shipment_form.save()

        if form2.is_valid():
            shipment_form = form2.save(commit=False)
            for element in Shipment.objects.filter(user=request.user):
                if element.address_name == dict_array[0]['address_name']:
                    shipment_form.selection = element.selection
                    element.delete()
            shipment_form.user = request.user
            shipment_form.selection += 2
            shipment_form.save()

    else:
        main_dict = {}
        ctr = 1
        for element in Shipment.objects.filter(user=request.user).values():
            form_element = ShipmentForm(element)
            main_dict["shipment_form" + str(ctr)] = form_element
            ctr += 1
        form = ShipmentForm()

    response = redirect('/payment')

    return response
