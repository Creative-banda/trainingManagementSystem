from django.db.models.signals import post_save
from .models import Profile, User
from django.dispatch import receiver

@receiver(post_save, sender=User)
def pre_save_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user = instance)