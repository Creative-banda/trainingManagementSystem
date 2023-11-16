from rest_framework import serializers
from .models.SchoolModel import School


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'