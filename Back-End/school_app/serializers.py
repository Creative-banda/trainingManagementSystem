from rest_framework import serializers
from account_app.serializers import userSerializer
from account_app.models import User
from teachers_app.models import Teacher
from teachers_app.serializers import TeacherSerializer
from .models import Grades, School


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grades
        fields = ['id','grades']


"""
    * The am and om fields are defined as PrimaryKeyRelatedField to accept the user IDs during the POST request.
    
    * In the to_representation method, it checks the request method. If it's a GET request, it includes detailed information for am, om, and grades using the UserSerializer and GradeSerializer. For the POST request, it retains the primary key representation.
"""
class SchoolSerializer(serializers.ModelSerializer):
    am = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    om = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    grades = serializers.PrimaryKeyRelatedField(many=True, queryset=Grades.objects.all())
    teachers = TeacherSerializer(many=True, required=False)

    class Meta:
        model = School
        exclude = ['created_at', 'updated_at', 'active']

    
    def update(self, instance, validated_data):
        teachers_data = validated_data.pop("teachers", None)
        instance = super().update(instance, validated_data)
        # Adding Teachers to the School
        if teachers_data:
            for data in teachers_data:
                subject = data.pop('subject')
                name = data.pop("name")
                teacher = Teacher.objects.create(name=name)
                teacher.subject.set(subject)
                instance.teachers.add(teacher)
        return instance

    def to_representation(self, instance):
        # When get request hits, it will serialize the am, om and grades fields and return them
        representation = super().to_representation(instance)
        # print("From School :", self.context)
        if self.context.get("request") and self.context['request'].method == 'GET':
            representation['am'] = userSerializer(instance.am).data
            representation['om'] = userSerializer(instance.om).data
            representation['grades'] = GradeSerializer(instance.grades.all(), many=True).data
            # representation['teachers'] = TeacherSerializer(instance.teachers.all(), many=True).data
        return representation

