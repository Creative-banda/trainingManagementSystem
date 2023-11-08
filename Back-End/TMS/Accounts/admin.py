from django.contrib import admin
from .models import Profile, User, userRole

admin.site.register([Profile, User, userRole])
