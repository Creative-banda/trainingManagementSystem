from django.db import models
from django.core.exceptions import ValidationError
from uuid import uuid4
from .BaseModel import BaseModel
from account_app.models import User
from school_app.models import School, Grades
from .enums import TrainingStatusEnum, TrainingTypeEnum, TrainingRequestEnum


class TrainingRequestsModel(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="training_request", blank=True, null=True)
    subject = models.CharField(max_length=255, choices=TrainingTypeEnum.choices(), default=TrainingTypeEnum.ROBOTICS.value)
    requestor = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="training_request", blank=True, null=True)
    grades = models.ManyToManyField(Grades, blank=True)
    startDate = models.DateField( blank=True )
    endTime = models.TimeField( blank=True, null=True )
    startTime = models.TimeField( blank=True )
    status = models.CharField(max_length=50, choices=TrainingStatusEnum.choices(), default=TrainingStatusEnum.PENDING.value)

    class Meta:
        ordering = ["-startDate", "startTime"]
        indexes = [models.Index(fields=['subject', 'status'])]
    
    def save(self, *args, **kwargs) -> User:
        if self.endTime < self.startTime:
            raise ValidationError("End time must be greater than start time")
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{str(self.school.name)} - {str(self.requestor)}"



class Training(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    trainingStatus = models.CharField(max_length=50, choices=TrainingStatusEnum.choices(),blank=True, default=TrainingStatusEnum.ONGOING.value)
    currentGrade = models.ForeignKey(Grades, on_delete=models.SET_NULL, null=True, blank=True, related_name="current_grade")
    trainings = models.ManyToManyField(TrainingRequestsModel, blank=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        indexes = [models.Index(fields=['trainingStatus', 'active'])]

    def __str__(self):
        return f"{str(self.trainer)} - {str(self.trainings.first())}"


# Not in use anymore
class MasterTraining(BaseModel):
    trainings = models.ManyToManyField(Training, blank=True)
    status = models.CharField(max_length=50, choices=TrainingRequestEnum.choices(), default="ONGING")



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


