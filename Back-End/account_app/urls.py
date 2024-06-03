from django.urls import path
from .views import ListUsers, UserLoginLogout, PasswordChangeView
from django.views.decorators.cache import cache_page


urlpatterns = [
    path("users/", ListUsers.as_view()),
    path("auth/", UserLoginLogout.as_view()),
    path("change-password/", PasswordChangeView.as_view()),
]
