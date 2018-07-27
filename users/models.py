from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from decimal import Decimal


# Create your models here.
class Persona(AbstractUser):
    email = models.EmailField(unique=True)
    cedula = models.PositiveIntegerField(unique=True, null=True, default=None)
    primer_nombre = models.CharField(max_length=25, blank=True, default='')
    segundo_nombre = models.CharField(max_length=25, blank=True, default='')
    primer_apellido = models.CharField(max_length=25, blank=True, default='')
    segundo_apellido = models.CharField(max_length=25, blank=True, default='')
    fecha_nacimiento = models.DateField(null=True, default=None)
    avatar = models.ImageField(upload_to='avatars', blank=True, default='')


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
