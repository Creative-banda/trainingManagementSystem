from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from training_app.models import Training
from .models import User, Profile, Role


class roleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role']


class userSerializer(serializers.ModelSerializer):
    total_training = serializers.SerializerMethodField()
    # my_schools = serializers.SerializerMethodField()
    role = roleSerializer(many=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'total_training', 'role', "profilePic"]

    # validate that profilePic is not greater than 2MB
    def validate(self, attrs):
        profilePic = attrs.get('profilePic')
        limit = 2 * 1024 * 1024
        if profilePic and len(profilePic) > limit:
            raise serializers.ValidationError("ProfilePic size should not be greater than 2MB")
        return attrs
    
    def get_total_training(self, user):
        try:
            return Training.objects.filter(trainer__id = user.id, active = True, trainingStatus="ONGOING").count()
        except:
            return 0

        
class ProfileSerializer(serializers.ModelSerializer):
    user = userSerializer()
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Profile
        exclude = ['created_at', 'updated_at']


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        if user.check_password(value):
            raise serializers.ValidationError("New password cannot be same as old password")
        return value
    
    def save(self):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()

        # Blacklist the token of the user
        try:
            referesh_token = self.context['request'].auth
            referesh_token.blacklist()
        except:
            pass

        # Generate the new tokens for the user
        refresh_token = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh_token),
            'access': str(refresh_token.access_token),
        }
    

        