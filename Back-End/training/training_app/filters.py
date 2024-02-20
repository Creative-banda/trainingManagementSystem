import django_filters
from .models import Training

class TrainingFilter(django_filters.FilterSet):
    class Meta:
        model = Training
        fields = ['trainers', 'active', 'startDate', 'schools','trainingStatus', 'trainingType', 'currentGrade']  # Add fields you want to filter