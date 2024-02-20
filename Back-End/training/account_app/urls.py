from django.urls import path
from .views import AccountHome, ListUsers, UserLoginLogout

urlpatterns = [
    path("", AccountHome, name="Account_Home"),
    path("users/", ListUsers.as_view()),
    path("auth/", UserLoginLogout.as_view()),
]


