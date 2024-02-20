from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Training

@receiver(m2m_changed, sender=Training.grades.through)
def update_current_grade(sender, instance, action, **kwargs):
    if action == "post_add" and instance.currentGrade is None:
        print(instance.grades.first())
        Training.objects.filter(id=instance.id).update(currentGrade = instance.grades.first())