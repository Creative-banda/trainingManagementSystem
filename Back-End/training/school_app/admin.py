from django.contrib import admin
from .models import School, Grades

# Register your models here.
admin.site.register([School, Grades])
