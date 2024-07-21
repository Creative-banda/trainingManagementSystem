from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherById, TeacherGetPost, SubjectsGenericView, TeacherAttendanceView

# router = DefaultRouter()
# router.register("", TeacherListCreateView)

urlpatterns = [
    path("", TeacherGetPost.as_view()),
    path("subjects/", SubjectsGenericView.as_view()),
    path("attendance/", TeacherAttendanceView.as_view()),
    path("<str:pk>", TeacherById.as_view()),
]