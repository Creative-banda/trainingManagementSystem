from rest_framework import serializers
from .models import Training
from Schools.school_serializer import SchoolSerializer, GradeSerializer
from Accounts.user_serializer import ProfileSerializer, userSerializer

class TrainingSerializer(serializers.ModelSerializer):
    trainers = userSerializer(many=True)
    schools = SchoolSerializer(many=True)
    grades = GradeSerializer(many=True)
    class Meta:
        model = Training
        fields = ['id', 'grades', 'schools','trainers', 'trainingStatus', 'trainingType']
        