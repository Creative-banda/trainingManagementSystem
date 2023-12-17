from rest_framework import serializers
from .models.userModel import User
from .models.Profile import Profile
from .models.userType import userRole


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = userRole
        fields = ['roles']


class userSerializer(serializers.ModelSerializer):
    roles = UserRoleSerializer(many=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','roles']


class ProfileSerializer(serializers.ModelSerializer):
    user = userSerializer()
    class Meta:
        model = Profile
        fields = '__all__'