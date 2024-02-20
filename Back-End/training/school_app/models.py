from django.db import models
from account_app.models import User
from .BaseModel import BaseModel
from .enums import CatagoryEnum, GradeEnum
from uuid import uuid4


################################ Grade Model ################################
class Grades(BaseModel):
    grades = models.CharField(max_length=50, choices=GradeEnum.choices(), unique=True, blank=True)

    def __str__(self):
        return self.grades


################################ School Model #############################
class School(BaseModel):
    id = models.UUIDField(unique=True, default = uuid4, db_index=True, primary_key=True, editable=False)
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField(max_length=500)
    catagory = models.CharField(choices = CatagoryEnum.choices(), max_length=30);
    grades = models.ManyToManyField(Grades)
    am = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="academic_manager", blank = True, null = True)
    om = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="operation_manager", blank = True, null = True)
    contact = models.CharField(max_length=12, blank=True, null=True)
    erp_code = models.CharField(max_length=12, blank=True, null=True, unique=True)
    active = models.BooleanField(default=True, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name