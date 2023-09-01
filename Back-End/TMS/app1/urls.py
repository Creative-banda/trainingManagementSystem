from django.urls import path, include
from .views import *

urlpatterns = [
    path('register', RegisterView, name='register'),
    path('users/all', GetUsersView, name='get_users'),
    path('schools/all', getSchoolsView, name='get_schools'),
    path('school/register', addSchoolView, name='add_school'),
]