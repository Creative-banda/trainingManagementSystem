from django.test import TestCase
from account_app.models import User, Profile

class UserModel_ProfileModel_Test(TestCase):
    def setUp(self):
        pass

    def test_create_user(self):
        email = "rohan@gmail.com"
        password = "rohan123"
        first_name = "Rohan"
        last_name = "Singh"

        user = User.objects.create_user(email = email, password = password, first_name = first_name, last_name = last_name)

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertEqual(user.username, f"{first_name} {last_name}")

        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    

    def test_create_superuser(self):
        email = "rohan@gmail.com"
        password = "rohan123"
        first_name = "Rohan"
        last_name = "Singh"

        user = User.objects.create_superuser(email = email, password = password, first_name = first_name, last_name = last_name)

        profile = Profile.objects.get(user = user)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertEqual(user.username, f"{first_name} {last_name}")
        self.assertIsInstance(profile, Profile)
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)


    def test_profile(self):
        email = "rohan@gmail.com"
        password = "rohan123"
        first_name = "Rohan"
        last_name = "Singh"

        user = User.objects.create_user(email = email, password = password, first_name = first_name, last_name = last_name)

        profile = Profile.objects.create(user = user)
        self.assertEqual(profile.user, user)