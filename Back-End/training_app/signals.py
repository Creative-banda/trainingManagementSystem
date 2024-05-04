from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Training, TrainingSheetModel

# Whenever the training assigned to a school, update the current grade with the first grade
@receiver(m2m_changed, sender=Training.grades.through)
def update_current_grade(sender, instance, action, **kwargs):
    if action == "post_add" and instance.currentGrade is None:
        Training.objects.filter(id=instance.id).update(currentGrade = instance.grades.first())


# Adding sheet to each school once a training assigned
@receiver(m2m_changed, sender=Training.schools.through)
def add_sheet_for_each_schools(sender, instance, action, **kwargs):
    if action == "post_add":
        print("Training Created")
        for school in instance.schools.all():
            TrainingSheetModel.objects.create(school = school, subject = instance.trainingType)
            