from django.db import models
from .BaseModel import BaseModel
from .GradeEnum import Grade

class Grades(BaseModel):
    grade = models.CharField(max_length=50, choices=Grade.choices(), unique=True)

    def __str__(self):
        return self.grade
    