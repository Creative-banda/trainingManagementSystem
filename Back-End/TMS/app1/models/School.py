from django.db import models
from .BaseModel import BaseModel
from .Grades import Grades
from .User import User
from .enums.TrainingStatus import TrainingStatus
from .TrainingSheet import TrainingSheet

class School(BaseModel):
    name = models.CharField(max_length=255)
    address = models.TextField(max_length=500)
    grades = models.ManyToManyField(Grades)
    am = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="academic_manager")
    om = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="operation_manager")
    contact = models.CharField(max_length=12, blank=True, null=True)
    erp_code = models.CharField(max_length=12, blank=True, null=True)
    trainingStatus = models.CharField(max_length=50,choices= TrainingStatus.choices(), default=TrainingStatus.PENDING.value)
    sheet = models.ManyToManyField(TrainingSheet, blank=True)

    def __str__(self):
        return self.name