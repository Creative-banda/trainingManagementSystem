from django.db import models
from .BaseModel import BaseModel
from Accounts.models import User
from Schools.models import School, Grades
from .TrainingStatus import TrainingStatus
from .TrainingType import TrainingType


class Training(BaseModel):
    trainers = models.ManyToManyField(User,blank=True)
    schools = models.ManyToManyField(School,blank=True)
    startDate = models.DateField(blank=True)
    startTime = models.TimeField(blank=True)
    endTime = models.TimeField()
    grades = models.ManyToManyField(Grades, blank=True)
    trainingStatus = models.CharField(
        max_length=50, choices=TrainingStatus.choices(),blank=True)
    trainingType = models.CharField(
        max_length=50, choices=TrainingType.choices(),blank=True)

    def __str__(self):
        objs = self.trainers.all()
        trainers = ''
        for trainer in objs:
            trainers += trainer.username + ","
        return f"{trainers} t"
