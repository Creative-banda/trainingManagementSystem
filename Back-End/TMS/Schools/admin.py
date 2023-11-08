from django.contrib import admin
from .models import Grades, School

admin.site.register([Grades, School])
