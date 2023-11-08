from django.db import models
from .BaseModel import BaseModel
from .userEnum import UserType

class userRole(BaseModel):
    roles = models.CharField(max_length=50, choices=UserType.choices(), default=UserType.TRAINER, unique=True)

    def __str__(self):
        return self.roles