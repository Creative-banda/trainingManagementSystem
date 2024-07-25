from rest_framework import serializers
from training_app.models import Score

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        exclude = ['updated_at', 'created_at']

