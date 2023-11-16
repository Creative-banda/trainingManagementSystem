from django.urls import path
from .views import SchoolsView, updateSchoolView

urlpatterns = [
    path('schools', SchoolsView, name='schools'),
    path('schools/<int:id>', updateSchoolView, name='Update School'),
]