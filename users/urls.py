from django.urls import path

from . import views

urlpatterns = [
    path('register', views.persona_register, name='persona_register'),
    path('login', views.persona_login, name='persona_login'),
]
