from django.db import models
from .BaseModel import BaseModel
from .enums.TrainingType import TrainingType
from .enums.TrainingStatus import TrainingStatus

class TrainingSheet(BaseModel):
    trainingType = models.CharField(max_length=20, choices=TrainingType.choices())
    trainingStatus = models.CharField(max_length=20, choices=TrainingStatus.choices(), default=TrainingStatus.ONGOING)
    startTime = models.TimeField()
    endTime = models.TimeField()
    date = models.DateField(auto_now=True)
    remarks = models.TextField(max_length=500)

    def __str__(self):
        return str(self.date)
