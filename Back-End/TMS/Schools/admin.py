from django.contrib import admin
from .models import Grades, School


class SchoolAdmin(admin.ModelAdmin):
    list_display = ['name', 'training_status', 'am', 'om']

admin.site.register(School, SchoolAdmin)
admin.site.register(Grades)
