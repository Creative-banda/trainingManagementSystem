from rest_framework import serializers
from ..models import School
class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        exclude = ['created_at', 'updated_at','sheet']