import django_filters
from .models import Grades, School


class SchoolFilter(django_filters.FilterSet):
    class Meta:
        model = School
        fields = ['id', 'catagory', 'am', 'om', 'active']