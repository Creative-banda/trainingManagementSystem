import django_filters
from .models import Training, TrainingSheetModel, TrainingRequestsModel

class TrainingFilter(django_filters.FilterSet):
    class Meta:
        model = Training
        fields = ['trainers', 'active', 'schools','trainingStatus', 'trainingType', 'currentGrade']  # Add fields you want to filter


class TrainingSheetModelFilter(django_filters.FilterSet):
    class Meta:
        model = TrainingSheetModel
        fields = ['school', 'subject']


class TrainingRequestFilter(django_filters.FilterSet):
    class Meta:
        model = TrainingRequestsModel
        fields = ['school', 'subject', 'requestor', 'status']