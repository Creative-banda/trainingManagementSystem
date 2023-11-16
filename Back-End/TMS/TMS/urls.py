from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('drf_registration.urls')),
    path('training/', include('Trainings.urls'),),
    path('school/', include('Schools.urls')),
    path('accounts/', include('Accounts.urls')),
]
