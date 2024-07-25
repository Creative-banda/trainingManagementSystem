from django.db import models
from django.core.exceptions import ValidationError
from uuid import uuid4
from .BaseModel import BaseModel
from account_app.models import User
from school_app.models import School, Grades
from .enums import TrainingStatusEnum, TrainingTypeEnum, TrainingRequestEnum, TeacherAttendanceEnum


class TrainingRequestsModel(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    school = models.ForeignKey(School, on_delete=models.PROTECT, blank=True, null=True, related_name="training_requests")
    subject = models.CharField(max_length=255, choices=TrainingTypeEnum.choices(), default=TrainingTypeEnum.ROBOTICS.value)
    requestor = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, related_name="training_requests")
    grades = models.ManyToManyField(Grades, blank=True)
    startDate = models.DateField( blank=True )
    endTime = models.TimeField( blank=True, null=True )
    startTime = models.TimeField( blank=True )
    status = models.CharField(max_length=50, choices=TrainingStatusEnum.choices(), default=TrainingStatusEnum.PENDING.value)
    active = models.BooleanField(default=True)

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
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="trainings")
    trainingStatus = models.CharField(max_length=50, choices=TrainingStatusEnum.choices(),blank=True, default=TrainingStatusEnum.ONGOING.value)
    currentGrade = models.ForeignKey(Grades, on_delete=models.SET_NULL, null=True, blank=True, related_name="trainings")
    trainings = models.ManyToManyField(TrainingRequestsModel, blank=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        indexes = [models.Index(fields=['trainingStatus', 'active'])]

    def __str__(self):
        return f"{str(self.trainer)} - {str(self.trainings.first())}"


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
    trainingData = models.ManyToManyField(TrainingDataModel, blank=True, related_name="training_sheet")

    
    class Meta:
        ordering = ["-created_at"]

    
    def __str__(self):
        return f"{str(self.school.name)} - {str(self.subject)}"
    
    
class Attendance(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name="attentance", db_index=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attentance", db_index=True)
    status = models.CharField(max_length=50, choices=TeacherAttendanceEnum.choices(), default=TeacherAttendanceEnum.PRESENT.value)
    
    class Meta:
        indexes = [models.Index(fields=['training', 'teacher', 'status'])]
    
    def __str__(self):
        return f"{str(self.teacher)} - {str(self.training)}"


class Score(BaseModel):
    id = models.UUIDField(primary_key=True, db_index=True, default=uuid4)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name="score", db_index=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="score", db_index=True)
    subject = models.CharField(max_length=255, choices=TrainingTypeEnum.choices(), default=TrainingTypeEnum.ROBOTICS.value, db_index=True)
    score = models.IntegerField(default=0)
    
    class Meta:
        indexes = [models.Index(fields=['training', 'teacher', 'score'])]
    
    def __str__(self):
        return f"{str(self.teacher)} - {str(self.training)}"


