from django.urls import path
from .views import AccountHome, ListUsers, UserLoginLogout
from django.views.decorators.cache import cache_page


urlpatterns = [
    path("", AccountHome, name="Account_Home"),
    path("users/", ListUsers.as_view()),
    path("auth/", UserLoginLogout.as_view()),
]
