from rest_framework import serializers
from .models import Training
from Schools.models import Grades

class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = '__all__'
        