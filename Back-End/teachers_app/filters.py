import django_filters
from .models import Teacher, Attendance


class TeacherFilter(django_filters.FilterSet):
    class Meta:
        model = Teacher
        fields = ['id', 'name', 'subject__name', 'active']


class AttendanceFilter(django_filters.FilterSet):
    class Meta:
        model = Attendance
        fields = {
            'teacher': ['exact'],
            'subject__name': ['exact'],
            'date': ['exact'],
            'is_present': ['exact'],
        }


