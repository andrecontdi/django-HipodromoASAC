from django.http import Http404, JsonResponse
from django.shortcuts import render
from .forms import RegisterForm
from .models import Persona
from hipodromo.utils import result_construct


# Create your views here.
def authenticate(request):
    if request.method == 'GET':
        form = RegisterForm()
    return render(
        request,
        'users/authentication.html',
        {'form': form}
    )


def register(request):
    response = result_construct()
    if request.method == 'POST':
        print(request.POST)
        form = RegisterForm(request.POST)

        print(form)

        if form.is_valid():
            form.save()
            response = result_construct(status='success', httpCode=200)
        else:
            response = result_construct(messages=form.errors, httpCode=500)

    return response
