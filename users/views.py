# Django
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render

# local Django
from .forms import LoginForm, RegisterForm
from .models import Persona
from .utils import login, result_construct, validateEmail


# Create your views here.
def authentication(request):
    if request.method != 'GET':
        return Http404

    if (request.user.is_authenticated):
        return HttpResponseRedirect(reverse('home'))

    register_form = RegisterForm()
    login_form = LoginForm()
    next = request.GET.get('next')
    return render(
        request,
        'users/authentication.html',
        {
            'register_form': register_form,
            'login_form': login_form,
            'next': next
        }
    )


def persona_register(request):
    if request.method != 'POST':
        message = {'__all__': ['Método no autorizado, por favor verifique']}
        return result_construct(messages=message, httpCode=404)

    if (request.user.is_authenticated):
        message = {'__all__': ['Cierre sesión para poder registrarse']}
        return result_construct(messages=message)

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

    return login(request, persona)    


def persona_login(request):
    if request.method != 'POST':
        message = {'__all__': ['Método no autorizado, por favor verifique']}
        return result_construct(messages=message, httpCode=404)

    if (request.user.is_authenticated):
        message = {'__all__': ['Cierre sesión para poder iniciar sesión']}
        return result_construct(messages=message)

    username = request.POST.get('username')
    if validateEmail(username):
        try:
            username = Persona.objects.get(email=username).username
        except ObjectDoesNotExist:
            username = None
    request_data = request.POST.copy()
    request_data['username'] = (
        username if username is not None else request_data['username']
    )

    auth_form = LoginForm(data=request_data)
    if not auth_form.is_valid():
        return result_construct(messages=auth_form.errors)

    return login(request, auth_form.get_user())


@login_required
def home(request):
    return result_construct(status='success', httpCode=200)
