from django.urls import path
from .views import GoogleSheetView

urlpatterns = [
    path("", GoogleSheetView.as_view()),
]
