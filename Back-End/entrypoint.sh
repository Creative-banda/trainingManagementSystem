#!/bin/sh
python manage.py migrate
python manage.py collectstatic --noinput

# python manage.py createsuperuser --noinput

gunicorn training.wsgi --bind 0.0.0.0:8000 --workers 4 --threads 4

# for debug
#python manage.py runserver 0.0.0.0:8000