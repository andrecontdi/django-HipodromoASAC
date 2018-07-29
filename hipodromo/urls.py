"""hipodromo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import TemplateView
from users import views as user_views

from . import settings

urlpatterns = [
    path('users/', include('users.urls')),
    path('admin/', admin.site.urls),
    path('', user_views.authentication),
    path('home', user_views.home, name='home'),
    path('auth', TemplateView.as_view(template_name='users/authentication2.html')),
    path('prueba', TemplateView.as_view(template_name='admlte2/index.html')),
]

if settings.DEBUG is True:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
