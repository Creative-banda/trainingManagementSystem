from django.db import models
from account_app.models import User
from teachers_app.models import Teacher
from .BaseModel import BaseModel
from .enums import CatagoryEnum, GradeEnum, TrainingStatusEnum
from account_app.models import UserType
from uuid import uuid4


################################ Grade Model ################################
class Grades(BaseModel):
    grades = models.CharField(max_length=50, choices=GradeEnum.choices(), unique=True, blank=True)

    def __str__(self):
        return self.grades


################################ School Model #############################
class School(BaseModel):
    id = models.UUIDField(unique=True, default = uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255, unique=True, blank=True, null=True)
    address = models.TextField(max_length=500)
    catagory = models.CharField(choices = CatagoryEnum.choices(), max_length=30)
    grades = models.ManyToManyField(Grades)
    am = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="academic_manager", blank = True, null = True)
    om = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="operation_manager", blank = True, null = True)
    contact = models.CharField(max_length=12, blank=True, null=True)
    erp_code = models.CharField(max_length=12, blank=True, null=True, unique=True)
    active = models.BooleanField(default=True, null=True, blank=True)
    teachers = models.ManyToManyField(Teacher, blank=True)
    # training_status = models.CharField(max_length=12, choices = TrainingStatusEnum.choices(), blank=True, null=True, default=TrainingStatusEnum.PENDING.value)

    def save(self, *args, **kwargs):
        # Check if AM or OM are having AM or OM role or not

        if not self.am.role.filter(role=UserType.AM.value).exists():
            raise ValueError("AM must be an Academic Manager")
        if not self.om.role.filter(role=UserType.OM.value).exists():
            raise ValueError("OM must be an Operation Manager")

        return super().save(*args, **kwargs)
        
    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=['id', 'catagory', 'am', 'om', 'active'])]

    def __str__(self):
        return self.name