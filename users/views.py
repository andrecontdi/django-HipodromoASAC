from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.urls import resolve, Resolver404
from django.http import Http404, JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .forms import RegisterForm
from .models import Persona
from hipodromo.utils import result_construct


# Create your views here.
def authentication(request):
    if request.method != 'GET':
        return Http404

    if (request.user.is_authenticated):
        return HttpResponseRedirect(reverse('home'))

    form = RegisterForm()
    next = request.GET.get('next')
    return render(
        request,
        'users/authentication.html',
        {'form': form, 'next': next}
    )


def register(request):
    if request.method != 'POST':
        message = {'__all__': ['Método no autorizado, por favor verifique']}
        return result_construct(messages=message, httpCode=404)

    form = RegisterForm(request.POST, request.FILES)
    if not form.is_valid():
        return result_construct(messages=form.errors)

    username = request.POST.get('username')
    password = request.POST.get('password')
    persona = form.save(commit=False)
    persona.set_password(password)
    persona.save()
    if persona is None:
        message = {'__all__': ['Usuario o clave inválida, por favor verifique']}
        return result_construct(messages=message)

    login(request, persona)
    if not request.user.is_authenticated:
        message = {'__all__': ['Usuario no autenticado, por favor inicie sesión']}
        return result_construct(messages=message)

    next = request.GET.get('next')
    try:
        resolve(next)
    except Resolver404:
        next = None
    url = reverse('home') if next is None else next
    data = {'url': url}
    return result_construct(status='success', data=data, httpCode=200)


@login_required
def home(request):
    return result_construct(status='success', httpCode=200)
