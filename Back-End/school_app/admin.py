from django.contrib import admin
from .models import School, Grades

# Register your models here.
# Add filter and search on school model

class SchoolFilter(admin.ModelAdmin):
    list_filter = ['catagory', 'active']
    search_fields = ['name']


admin.site.register(School, SchoolFilter)   
