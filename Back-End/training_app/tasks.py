from celery import shared_task
# Importing models
from school_app.models import School
from training_app.models import Training
from account_app.models import User

from django.core.mail import send_mail
from training import settings


@shared_task
def sending_mail(to, subject, text):
    send_mail(
        subject = subject,
        message = text,
        from_email = settings.EMAIL_HOST_USER,
        recipient_list = [to],
        fail_silently = False
    )

    return "Mail sent successfully"

@shared_task(name = "send_training_mail")
def send_training_mail(serialized_training_data):
    try:
        trainer_id = serialized_training_data["trainer"]
        schools_id = [training['school'] for training in serialized_training_data["trainingDetail"]]

        trainer_email = User.objects.get(id = trainer_id).email
        schools_name_objects = School.objects.filter(id__in = schools_id).values_list("name", flat = True)
        schools_name = [school_name for school_name in schools_name_objects]

        training_subject = serialized_training_data['trainingDetail'][0]["subject"]
        start_date = serialized_training_data['trainingDetail'][0]["startDate"]
        start_time = serialized_training_data['trainingDetail'][0]["startTime"]
        grades = serialized_training_data['trainingDetail'][0]["grades"]

        send_mail(
            subject = "Training Details",
            message = f"Training Details: \nTraining Subject: {training_subject}\nStart Date: {start_date}\nStart Time: {start_time}\nGrades: {grades}\nSchools Name: {schools_name}",
            from_email = settings.EMAIL_HOST_USER,
            recipient_list = [trainer_email],
            fail_silently = False
        )
        return "Mail sent successfully to"
    except Exception as e:
        raise e