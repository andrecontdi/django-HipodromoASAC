# standard library
from decimal import Decimal
from io import BytesIO
from mimetypes import guess_type

# Django
from django.contrib.auth.models import AbstractUser
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from PIL import Image


def avatar_upload_handler(instance, filename):
    return f'avatars/{instance.username}/{filename}'


# Create your models here.
class Persona(AbstractUser):
    email = models.EmailField(unique=True)
    cedula = models.PositiveIntegerField(unique=True, null=True, default=None)
    primer_nombre = models.CharField(max_length=25, blank=True, default='')
    segundo_nombre = models.CharField(max_length=25, blank=True, default='')
    primer_apellido = models.CharField(max_length=25, blank=True, default='')
    segundo_apellido = models.CharField(max_length=25, blank=True, default='')
    fecha_nacimiento = models.DateField(null=True, default=None)
    avatar = models.ImageField(
        upload_to=avatar_upload_handler, blank=True, default=''
    )

    def save(self, *args, **kwargs):
        if self.avatar:
            print('Estoy pasando por guardando avatar')
            (width, height) = (250, 250)
            image = Image.open(BytesIO(self.avatar.read()))
            (imw, imh) = image.size
            if (imw > width) or (imh > height):
                image.thumbnail((width, height), Image.ANTIALIAS)

            print(image.size)
            # If RGBA, convert transparency
            if image.mode == "RGBA":
                image.load()
                background = Img.new("RGB", image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[3])  # 3 is the alpha channel
                image = background

            output = BytesIO()
            image.save(output, format=image.format, quality=70)
            output.seek(0)
            self.avatar = InMemoryUploadedFile(
                output, 'ImageField', self.avatar.name, guess_type(self.avatar.name)[0],
                output.getbuffer().nbytes, None
            )
        super(AbstractUser, self).save(*args, **kwargs)


class Caballerizo(Persona):
    pass


class Entrenador(Persona):
    pass


class Invitado(Persona):
    ARTISTA = 'A'
    DEPORTISTA = 'D'
    LIDER_OPINION = 'L'
    OPCIONES_TIPO_INVITADO = (
        (ARTISTA, 'Artista'),
        (DEPORTISTA, 'Deportista'),
        (LIDER_OPINION, 'Líder de opinión'),
    )
    tipo_invitado = models.CharField(
        max_length=1,
        choices=OPCIONES_TIPO_INVITADO,
        default=ARTISTA,
    )


class Jinete(Persona):
    APRENDIZ = 'A'
    PROFESIONAL = 'P'
    OPCIONES_EXPERIENCIA = (
        (APRENDIZ, 'Aprendiz'),
        (PROFESIONAL, 'Profesional'),
    )
    experiencia = models.CharField(
        max_length=1,
        choices=OPCIONES_EXPERIENCIA,
    )
    altura = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal('0.80')),
            MaxValueValidator(Decimal('2.50'))
        ]
    )


class Propietario(Persona):
    pass


class Taquillero(Persona):
    pass


class Veterinario(Persona):
    pass
