from django.db import models
from .BaseModel import BaseModel
from .userType import userRole
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import userManager


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    roles = models.ManyToManyField(userRole)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = userManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def has_perm(self, object = None):
        return self.is_staff
    
    def has_module_perms(self, app_label):
        return self.is_staff

    class Meta:
        """Meta definition for User."""

        verbose_name = 'User'
        verbose_name_plural = 'Users'


    def __str__(self) -> str:
        return self.username

