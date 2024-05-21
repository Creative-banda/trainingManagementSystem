import django_filters
from .models import Training, TrainingSheetModel, TrainingRequestsModel

class TrainingFilter(django_filters.FilterSet):
    class Meta:
        model = Training
        fields = {
            'trainer': ['exact'],
            'active': ['exact'],
            'trainingStatus': ['exact'],
            'currentGrade': ['exact'],
            'trainings__school': ['exact'],  # Assuming 'school' is a field in TrainingRequestsModel
            'trainings__subject':['exact'],
        }
    



class TrainingSheetModelFilter(django_filters.FilterSet):
    class Meta:
        model = TrainingSheetModel
        fields = ['school', 'subject']


class TrainingRequestFilter(django_filters.FilterSet):
    class Meta:
        model = TrainingRequestsModel
        fields = ['school', 'subject', 'requestor', 'status']