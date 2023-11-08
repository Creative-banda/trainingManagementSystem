from django.db import models
from .BaseModel import BaseModel
from Accounts.models import User
from Schools.models import School, Grades
from .TrainingStatus import TrainingStatus
from .TrainingType import TrainingType
from .TrainingStartTime import StartTime
from .TrainingEndTime import EndTime


class Training(BaseModel):
    trainers = models.ManyToManyField(User)
    schools = models.ManyToManyField(School)
    startDate = models.DateField()
    startTime = models.TimeField(choices=StartTime.choices())
    endTime = models.TimeField(choices=EndTime.choices())
    grades = models.ManyToManyField(Grades, blank=False)
    trainingStatus = models.CharField(
        max_length=50, choices=TrainingStatus.choices())
    trainingType = models.CharField(
        max_length=50, choices=TrainingType.choices())

    def __str__(self):
        objs = self.trainers.all()
        trainers = ''
        for trainer in objs:
            trainers += trainer.name + ","
        return f"{trainers} {self.schools.all()[0].name}"
