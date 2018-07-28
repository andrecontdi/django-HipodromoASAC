from django.http import JsonResponse


def result_construct(
    status='error', messages=None, data=None, httpCode=500,
    safe=False
):
    return JsonResponse({
        'status': status,
        'messages': messages,
        'data': data
    }, status=httpCode, safe=safe)
