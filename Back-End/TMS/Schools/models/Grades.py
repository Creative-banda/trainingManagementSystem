from django.db import models
from .BaseModel import BaseModel
from .GradeEnum import Grade

class Grades(BaseModel):
    grades = models.CharField(max_length=50, choices=Grade.choices(), unique=True, blank=True)

    def __str__(self):
        return self.grades