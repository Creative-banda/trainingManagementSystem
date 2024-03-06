from django.test import TestCase
from training_app.models import Training, TrainingDataModel, TrainingSheetModel
from account_app.models import User
from school_app.models import School, Grades
from ..enums import TrainingStatusEnum, TrainingTypeEnum


class TrainingModelTest(TestCase):
    def test_create_training(self):
        trainer = User.objects.create_user(email="a@a.com", password="12345", first_name="Rohan", last_name="Singh")

        school = School.objects.create(name="School 1", address="Address 1")
        grade = Grades.objects.create(grades = "Grade 1")

        training = Training.objects.create(
            startDate = "2022-01-01",
            startTime = "10:00:00",
            endTime = "11:00:00",
            trainingStatus = TrainingStatusEnum.ONGOING.value,
            trainingType = TrainingTypeEnum.ROBOTICS.value,
            currentGrade = grade
        )

        training.trainers.add(trainer)
        training.schools.add(school)
        training.grades.add(grade)

        self.assertEqual(training.trainers.first(), trainer)
        self.assertEqual(training.schools.first(), school)
        self.assertEqual(training.grades.first(), grade)
        self.assertEqual(training.startDate, "2022-01-01")
        self.assertEqual(training.startTime, "10:00:00")
        self.assertEqual(training.endTime, "11:00:00")

        self.assertTrue(training.startTime < training.endTime)

        self.assertIn(training.trainingStatus, [value[1] for value in TrainingStatusEnum.choices()])

        self.assertIn(training.trainingType, [value[1] for value in TrainingTypeEnum.choices()])

        self.assertEqual(training.currentGrade, grade)
        self.assertTrue(training.active)


class TrainingDataModelTest(TestCase):
    
    def test_DataModel(self):
        data = {
            "Remark": "All Good",
            "Topic" : "Topic 1"
        }

        dataModel = TrainingDataModel.objects.create(data = data)

        self.assertEqual(dataModel.data, data)
    
    def test_SheetModel(self):
        data = {
            "Remark": "All Good",
            "Topic" : "Topic 1"
        }

        sheet_data = TrainingDataModel.objects.create(data = data)
        school = School.objects.create(name="School 1", address="Address 1")

        sheetModel = TrainingSheetModel.objects.create(
            school = school
        )
        sheetModel.trainingData.add(sheet_data)


        self.assertEqual(sheetModel.trainingData.first(), sheet_data)