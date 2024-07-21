from django.db import models
from uuid import uuid4

from .enums import SubjectEnum
from .BaseModel import BaseModel

class Subject(BaseModel):
    id = models.UUIDField(unique=True, default = uuid4, primary_key=True, editable=False)
    name = models.CharField(choices=SubjectEnum.choices(), max_length=255)

    def __str__(self):
        return self.name


class Teacher(BaseModel):
    id = models.UUIDField(unique=True, default = uuid4, primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    subject = models.ManyToManyField(Subject)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Attendance(BaseModel):
    id = models.UUIDField(unique=True, default = uuid4, primary_key=True, editable=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    is_present = models.BooleanField(default=False)

    def __str__(self):
        return self.teacher.name + ' ' + str(self.date)


class TeacherScore(BaseModel):
    id = models.UUIDField(unique=True, default = uuid4, primary_key=True, editable=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)
    score = models.FloatField()

    def __str__(self):
        return self.teacher.name + ' ' + str(self.score)

