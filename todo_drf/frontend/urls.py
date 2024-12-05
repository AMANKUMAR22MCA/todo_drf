from django.urls import path
from . import views

from django.contrib.auth.models import User

urlpatterns = [
	path('', views.list, name="list-overview"),
    path('login/', views.register, name= 'register-overview'),
    
    path('register/', views.register_first, name= 'register-overview'),

]