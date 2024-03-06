from django.contrib import admin
from .models import Training, TrainingSheetModel, TrainingDataModel

admin.site.register([Training, TrainingSheetModel, TrainingDataModel])
