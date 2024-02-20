from django.urls import path
from .views import UserView, AccountHome

urlpatterns = [
    path("", AccountHome, name="Account_Home"),
    path('users/', UserView, name="User_View"),
]
