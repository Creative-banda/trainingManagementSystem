from django.contrib import admin
from .models import User, Profile, Role

admin.site.register([User, Profile, Role])
