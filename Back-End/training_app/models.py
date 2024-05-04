from django.db import models
from django.core.exceptions import ValidationError
from uuid import uuid4
from .BaseModel import BaseModel
from account_app.models import User
from school_app.models import School, Grades
from .enums import TrainingStatusEnum, TrainingTypeEnum, TrainingRequestEnum


class Training(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    trainers = models.ManyToManyField(User,blank=True)
    schools = models.ManyToManyField(School,blank=True)
    startDate = models.DateField(blank=True)
    startTime = models.TimeField(blank=True)
    endTime = models.TimeField(blank=True)
    grades = models.ManyToManyField(Grades, blank=True)
    trainingStatus = models.CharField(max_length=50, choices=TrainingStatusEnum.choices(),blank=True, default="ONGOING")
    trainingType = models.CharField(max_length=50, choices=TrainingTypeEnum.choices())
    currentGrade = models.ForeignKey(Grades, on_delete=models.SET_NULL, null=True, blank=True, related_name="current_grade", db_index=True)
    active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs) -> User:
        if self.endTime < self.startTime:
            raise ValidationError("End time must be greater than start time")
        return super().save(*args, **kwargs)
    
    class Meta:
        ordering = ["-startDate", "startTime"]
        indexes = [models.Index(fields=['trainingStatus', 'trainingType', 'active'])]

    def __str__(self):
        return f"{str(self.trainers.first())} - {str(self.trainingType)}"


class TrainingDataModel(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    data = models.JSONField(blank=True)
    active = models.BooleanField(default=True, null = True, blank=True)
    class Meta:
        ordering = ["-created_at"]


class TrainingSheetModel(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="training_sheet", db_index=True)
    subject = models.CharField(max_length=255, choices=TrainingTypeEnum.choices(), default=TrainingTypeEnum.ROBOTICS.value, db_index=True)
    trainingData = models.ManyToManyField(TrainingDataModel, blank=True)

    def __str__(self):
        return f"{str(self.school.name)} - {str(self.subject)}"


class TrainingRequestsModel(BaseModel):

    id = models.UUIDField(primary_key=True, default=uuid4)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="training_request")
    subject = models.CharField(max_length=255, choices=TrainingTypeEnum.choices(), default=TrainingTypeEnum.ROBOTICS.value)
    requestor = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="training_request")
    grades = models.ManyToManyField(Grades, blank=True)
    startDate = models.DateField( blank=True)
    startTime = models.TimeField( blank=True)
    status = models.CharField(max_length=50, choices=TrainingRequestEnum.choices(), default=TrainingRequestEnum.PENDING.value)

    class Meta:
        ordering = ["-startDate", "startTime"]
        indexes = [models.Index(fields=['school', 'subject', 'requestor', 'status'])]

    def __str__(self):
        return f"{str(self.school.name)} - {str(self.requestor)}"