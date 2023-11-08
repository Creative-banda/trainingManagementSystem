from django.db import models
from .BaseModel import BaseModel
from .Training import Training

class TrainingSheet(BaseModel):
    training = models.ForeignKey(Training, on_delete=models.SET_NULL, null=True)
    remarks = models.TextField(max_length=500)

    def __str__(self):
        if self.training:
            return str(self.training.startDate)
        else:
            return "Data Deleted"
