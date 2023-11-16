from django.contrib import admin
from .models import Profile, User, userRole

class UserAdmin(admin.ModelAdmin):
    list_display = ['id','username', 'email']

admin.site.register(User, UserAdmin)

admin.site.register([Profile, userRole])
