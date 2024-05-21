from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password
from django.db import models
from .BaseModel import BaseModel
from .userEnums import UserType
from uuid import uuid4


############################### Role Model ###################################
class Role(BaseModel):
    id = models.UUIDField(db_index = True, default=uuid4, primary_key = True)
    role = models.CharField(choices = UserType.choices(), max_length = 30, default = UserType.TRAINER.value, unique = True)

    def __str__(self):
        return self.role

################################ User Manager #################################

class userManager(BaseUserManager):
    use_in_migrations = True
    def create_user(self, email, password, **kwargs):
        if not email:
            raise ValueError('Users must have an email address')    
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        kwargs.setdefault('is_active', True)
        
        if kwargs.get('is_staff') != True:
            raise ValueError(_('is_staff must be True'))
        if kwargs.get('is_superuser') != True:
            raise ValueError(_('is_superuser must be True'))
        
        return self.create_user(email, password, **kwargs)
    

################################ User Model #################################

class User(BaseModel, AbstractUser):
    id = models.UUIDField(db_index = True, default=uuid4, primary_key = True)
    username = models.CharField(unique=False, default="Username", max_length=255, null=True, blank=True)
    email = models.CharField(max_length=255, unique=True)
    # schools = models.ManyToManyField("school_app.School" , blank=True, related_name = "user_schools")
    role = models.ManyToManyField(Role, blank=True, related_name = "user_roles")

    objects = userManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    
    ## I'm adding this save method because default password is not hashing from django admin due to some reason
    def save(self, *args, **kwargs):
        self.username = f"{self.first_name} {self.last_name}"
   
        if self.password and not self.password.startswith(('pbkdf2_sha256$', 'bcrypt$', 'argon2')):
        
            self.password = make_password(self.password)
        
        super().save(*args, **kwargs)


    def __str__(self) -> str:
        return self.username


class Profile(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)