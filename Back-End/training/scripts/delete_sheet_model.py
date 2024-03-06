from training_app.models import TrainingSheetModel, TrainingDataModel
from django.db import transaction

def run():
    with transaction.atomic():
        TrainingSheetModel.objects.all().delete()
        TrainingDataModel.objects.all().delete()