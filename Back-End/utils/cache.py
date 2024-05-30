from django.core.cache import cache
from functools import wraps
from django.http import JsonResponse
import json
from uuid import UUID
import hashlib

def custom_serializer(obj):
    if isinstance(obj, UUID):
        return str(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

def generate_cache_key(request):
    url = request.build_absolute_uri()
    query_params = request.GET.urlencode()
    key = f"{url}?{query_params}"
    return hashlib.md5(key.encode('utf-8')).hexdigest()

def cache_view(timeout):
    def decorator(func):
        @wraps(func)
        def wrapped(self, request, *args, **kwargs):
            cache_key = generate_cache_key(request)
            if request.method == 'GET':
                cached_response = cache.get(cache_key)
                if cached_response:
                    return JsonResponse(json.loads(cached_response), safe=False)
                response = func(self, request, *args, **kwargs)
                if response.status_code == 200:
                    response_data = json.dumps(response.data, default=custom_serializer)
                    cache.set(cache_key, response_data, timeout)
                return response
            elif request.method in ['PUT', 'DELETE', 'POST', 'PATCH']:
                cache.delete(cache_key)
                return func(self, request, *args, **kwargs)
            else:
                return func(self, request, *args, **kwargs)
        return wrapped
    return decorator
