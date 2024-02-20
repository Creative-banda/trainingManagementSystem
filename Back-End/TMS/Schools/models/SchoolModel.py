from django.db import models
from .BaseModel import BaseModel
from .Grades import Grades
from Accounts.models import User
from .TrainingStatus import TrainingStatus
from .CatagoryEnum import CatagoryEnum

class School(BaseModel):
    name = models.CharField(max_length=255)
    address = models.TextField(max_length=500)
    catagory = models.CharField(choices = CatagoryEnum.choices(), max_length=30, blank = True, null = True);
    grades = models.ManyToManyField(Grades)
    am = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="academic_manager")
    om = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="operation_manager")
    contact = models.CharField(max_length=12, blank=True, null=True)
    erp_code = models.CharField(max_length=12, blank=True, null=True, unique=True)
    # I'm adding training status so that I can keep track and filter the schools based on their status
    training_status = models.CharField(max_length=20, choices=TrainingStatus.choices(), blank=True, null=True)
    active = models.BooleanField(default=True, null=True, blank=True)

    def __str__(self):
        return self.name