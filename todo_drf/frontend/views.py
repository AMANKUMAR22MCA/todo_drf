from django.shortcuts import render

# Create your views here.


def list(request):
    return render (request, 'list.html')


def register(request):
    return render (request,'login.html')

def register_first(request):
    return render (request,'register.html')


