import os

DEBUG = True

ALLOWED_HOSTS = ["*"]

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ.get("CACHE_LOC"),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get("POSTGRES_USER"),
        'PASSWORD': os.environ.get("POSTGRES_PASSWORD"),
        'HOST': os.environ.get("DB_HOST"),
        'PORT': os.environ.get("DB_PORT"),
    }
}


CELERY_BROKER_URL = os.environ.get("CACHE_LOC")
CELERY_RESULT_BACKEND = os.environ.get('CELERY_BACKEND', 'django-db')
CELERY_CACHE_BACKEND = 'default'