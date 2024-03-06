from django.db import models
from django.core.exceptions import ValidationError
from uuid import uuid4
from .BaseModel import BaseModel
from account_app.models import User
from school_app.models import School, Grades
from .enums import TrainingStatusEnum, TrainingTypeEnum


class Training(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    trainers = models.ManyToManyField(User,blank=True)
    schools = models.ManyToManyField(School,blank=True)
    startDate = models.DateField(blank=True)
    startTime = models.TimeField(blank=True)
    endTime = models.TimeField(blank=True)
    grades = models.ManyToManyField(Grades, blank=True)
    trainingStatus = models.CharField(max_length=50, choices=TrainingStatusEnum.choices(),blank=True, default="ONGOING")
    trainingType = models.CharField(max_length=50, choices=TrainingTypeEnum.choices(),blank=True)
    currentGrade = models.ForeignKey(Grades, on_delete=models.SET_NULL, null=True, blank=True, related_name="current_grade")
    active = models.BooleanField(default=True, null = True, blank=True)
    
    def save(self, *args, **kwargs) -> User:
        if self.endTime < self.startTime:
            raise ValidationError("End time must be greater than start time")
        return super().save(*args, **kwargs)
    
    class Meta:
        ordering = ["-startDate", "startTime"]

    def __str__(self):
        return str(self.trainers.first())


class TrainingDataModel(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    data = models.JSONField(blank=True)
    active = models.BooleanField(default=True, null = True, blank=True)
    class Meta:
        ordering = ["-created_at"]

class TrainingSheetModel(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="training_sheet", db_index=True)
    trainingData = models.ManyToManyField(TrainingDataModel, blank=True)

    def __str__(self):
        return str(self.school.name)

