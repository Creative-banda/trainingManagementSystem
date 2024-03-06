from rest_framework import serializers
from training_app.models import Training
from .models import User
from .models import Profile


class userSerializer(serializers.ModelSerializer):
    total_training = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'total_training', 'role']
    
    def get_total_training(self, user):
        try:
            return Training.objects.filter(trainers__id = user.id, active = True, trainingStatus="ONGOING").count()
        except:
            return 0
    
        
class ProfileSerializer(serializers.ModelSerializer):
    user = userSerializer()
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Profile
        exclude = ['created_at', 'updated_at']
        