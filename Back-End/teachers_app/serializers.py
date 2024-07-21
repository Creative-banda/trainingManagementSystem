from rest_framework import serializers
from .models import Teacher, Subject, Attendance, TeacherScore

class TeacherSerializer(serializers.ModelSerializer):
    subject = serializers.PrimaryKeyRelatedField(many=True, queryset=Subject.objects.all())
    class Meta:
        model = Teacher
        exclude = ['created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['subject'] = SubjectSerializer(instance.subject.all(), many=True).data
        return representation


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        exclude = ['created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        exclude = ['created_at', 'updated_at']


class TeacherScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherScore
        exclude = ['created_at', 'updated_at']

