from rest_framework import serializers
from training_app.models import TrainingDataModel


class TrainingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingDataModel
        fields = ["id", "data", "active"]
