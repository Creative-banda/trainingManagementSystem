from django.contrib import admin
from .models import Training, TrainingSheetModel, TrainingDataModel, TrainingRequestsModel

admin.site.register([Training, TrainingSheetModel, TrainingDataModel, TrainingRequestsModel])
