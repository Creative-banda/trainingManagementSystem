from django.contrib.auth.models import BaseUserManager

class userManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, name, email, password = None, **kwargs):
        if not email:
            raise ValueError('Users must have an email address')    
        email = self.normalize_email(email)
        user = self.model(email=email, name = name, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, name, email, password, **kwargs):
        user = self.create_user(name, email, password, **kwargs)
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user
    
