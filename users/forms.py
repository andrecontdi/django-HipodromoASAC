from django.forms import (
    BooleanField, CharField, CheckboxInput, ModelForm,
    PasswordInput, ValidationError
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

    def clean_avatar(self):
        avatar = self.cleaned_data['avatar']

        if avatar:
            try:
                # validate file size
                if len(avatar) > (50 * 1024):
                    raise ValidationError(
                        'El avatar excede los 50k de tamaño.')

                # validate content type
                main, sub = avatar.content_type.split('/')
                if not (main == 'image' and sub in [
                    'jpeg', 'pjpeg', 'gif', 'png'
                ]):
                    raise ValidationError(
                        'Por favor usar JPEG, PNG o GIF image.')

            except AttributeError:
                raise ValidationError(
                    'Avatar se murió.')

        return avatar
