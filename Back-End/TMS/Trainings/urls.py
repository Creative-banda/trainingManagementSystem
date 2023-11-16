from django.urls import path
from .views import trainings, change_training_data

urlpatterns = [
    path('trainings', trainings, name="all_trainings"),
    path('trainings/<int:id>', change_training_data, name='updates_trainings')
]