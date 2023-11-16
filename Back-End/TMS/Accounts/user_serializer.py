from rest_framework import serializers
from .models.userModel import User
from .models.Profile import Profile


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','roles']


class ProfileSerializer(serializers.ModelSerializer):
    user = userSerializer()
    class Meta:
        model = Profile
        fields = '__all__'