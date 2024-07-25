from rest_framework import serializers
from training_app.models import TrainingSheetModel
from .trainingData import TrainingDataSerializer


class TrainingSheetSerializer(serializers.ModelSerializer):
    trainingData = TrainingDataSerializer(many=True, read_only=True)
    class Meta:
        model = TrainingSheetModel
        exclude = ['updated_at', 'created_at']
