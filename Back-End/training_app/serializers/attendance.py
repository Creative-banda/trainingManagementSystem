from rest_framework import serializers
from training_app.models import Attendance


class AttentanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        exclude = ['updated_at', 'created_at']

