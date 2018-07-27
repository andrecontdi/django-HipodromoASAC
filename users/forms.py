from django.contrib.auth.forms import UserCreationForm
from django.forms import (
    BooleanField, CharField, CheckboxInput, ModelForm,
    PasswordInput
)
from .models import Persona


class RegisterForm(ModelForm):
    password_confirm = CharField(
        widget=PasswordInput(),
        label='Verificar contraseña'
    )
    confirm_terms = BooleanField(widget=CheckboxInput())

    class Meta:
        model = Persona
        fields = ['username', 'email', 'password', 'avatar']
        widgets = {
            'password': PasswordInput()
        }
        labels = {
            'username': 'Nombre de usuario',
            'email': 'Correo electrónico',
            'password': 'Contraseña',
        }
        error_messages = {
            'username': {
                'unique': 'El nombre de usuario ya se encuentra registrado'
            },
            'email': {
                'invalid': 'Introduce un correo válido. e.g example@hostexample.com',
                'unique': 'El correo electrónico ya se encuentra registrado'
            }
        }
