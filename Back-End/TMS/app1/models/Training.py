from django.db import models
from .BaseModel import BaseModel
from .User import User
from .School import School
from .Grades import Grades
from .enums.TrainingStatus import TrainingStatus
from .enums.TrainingType import TrainingType


class Training(BaseModel):
    trainers = models.ManyToManyField(User)
    schools = models.ManyToManyField(School)
    startDate = models.DateField()
    startTime = models.TimeField()
    endTime = models.TimeField()
    grades = models.ManyToManyField(Grades, blank=False)
    trainingStatus = models.CharField(
        max_length=50, choices=TrainingStatus.choices(), default=TrainingStatus.PENDING)
    trainingType = models.CharField(
        max_length=50, choices=TrainingType.choices())

    def __str__(self):
        objs = self.trainers.all()
        trainers = ''
        for trainer in objs:
            trainers += trainer.name + ","
        return f"{trainers} {self.schools.all()[0].name}"
