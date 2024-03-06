from django.test import TestCase
from school_app.models import School, Grades
from account_app.models import User

class SchoolModelTest(TestCase):

    def test_school_model(self):
        name = "Test School"
        address = "Test Address"
        catagory = "CATAGORY A"
        erp_code = "1234567890"

        grades = Grades.objects.create(grades="Grade 1")
        am = User.objects.create_user(email="am@gmail.com", password="test_password_am")
        om = User.objects.create_user(email="om@gmail.com", password="test_password_om")

        school = School.objects.create(name=name, address=address, catagory=catagory, erp_code=erp_code, am=am, om=om)
        school.grades.add(grades)

        self.assertEqual(school.name, name)
        self.assertEqual(school.address, address)
        self.assertEqual(school.catagory, catagory)
        self.assertIn(grades, school.grades.all())
        self.assertEqual(school.erp_code, erp_code)
        self.assertTrue(school.active)

        