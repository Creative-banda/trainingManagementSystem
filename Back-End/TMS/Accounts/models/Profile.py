from django.db import models
from .userModel import User
from .BaseModel import BaseModel

class Profile(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)