from django.urls import path
from .views import *

urlpatterns = [
    path("", AccountHome, name="Account_Home")
]
