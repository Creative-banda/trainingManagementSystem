from training_app.models import TrainingSheetModel, TrainingDataModel
from school_app.models import School
from django.db import transaction

def run():
    data = {
        "grade": "Grade 1",
        "topic": "Topic 1",
        "duration": "1.5 Hrs",
        "conducted": "Yes",
        "trainerRemark": "Good",
        "date": "2022-01-01"
    }

    with transaction.atomic():
        t_data = TrainingDataModel.objects.create(data = data)
        all_schools = School.objects.all()
        for school in all_schools:
            sheet = TrainingSheetModel.objects.get_or_create(school = school)[0]
            print(sheet)
            sheet.trainingData.add(t_data)
    


    
