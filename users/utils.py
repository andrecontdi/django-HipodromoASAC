

def result_construct(
    status='error', messages=None, data=None, httpCode=500,
    safe=False
):
    from django.http import JsonResponse
    return JsonResponse({
        'status': status,
        'messages': messages,
        'data': data
    }, status=httpCode, safe=safe)


def validateEmail(email):
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False


def login(request, user):
    from django.contrib.auth import login
    from django.urls import reverse, resolve, Resolver404
    login(request, user)
    if not request.user.is_authenticated:
        message = {
            '__all__': [
                'Error en la autenticación, intente iniciar sesión nuevamente'
            ]
        }
        return result_construct(messages=message)

    next = request.GET.get('next')
    try:
        resolve(next)
    except Resolver404:
        next = None
    url = reverse('home') if next is None else next
    data = {'url': url}
    return result_construct(status='success', data=data, httpCode=200)
