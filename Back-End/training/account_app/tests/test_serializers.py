from rest_framework.test import APITestCase
from account_app.models import User, Profile
from account_app.serializers import userSerializer, ProfileSerializer

class UserSerializerTest(APITestCase):
    
    def test_user_serializer_valid_data(self):
    
        data = {
            "email": "test@gmail.com",
            "password": "1234",
            "first_name": "test First",
            "last_name": "test last"
        }
        user = User.objects.create(email = data.get("email"), password = data.get("password"), first_name = data.get("first_name"), last_name = data.get("last_name"))
        serialized_user = userSerializer(user, data = data)
        self.assertTrue(serialized_user.is_valid())
        self.assertEqual(isinstance(serialized_user.errors, dict))
        self.assertTrue(isinstance(serialized_user.data, dict))
        self.assertEqual(type(serialized_user.get_total_training(user)), int)



    def test_profile_serializer_valid_data(self):
        user = User.objects.create(email = "test@gmail.com", password = "1234", first_name = "test First", last_name = "test last")
        profile = Profile.objects.create(user = user)
        serialized_profile = ProfileSerializer(profile)
        self.assertTrue(isinstance(serialized_profile.data, dict))
        self.assertEqual(profile.user, user)