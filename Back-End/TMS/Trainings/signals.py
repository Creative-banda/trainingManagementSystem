from .models import Training
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Training)
def post_save_training(sender, instance, created, **kwargs):
    if created:
        schools = instance.schools.all()
        print(schools)