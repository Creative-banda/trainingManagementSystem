from django.contrib import admin
from .models import User, Profile

admin.site.register([User, Profile])
