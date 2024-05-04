from rest_framework import serializers
from .models import Training, TrainingDataModel, TrainingSheetModel, TrainingRequestsModel
from account_app.models import User
from account_app.serializers import userSerializer
from school_app.models import Grades, School
from school_app.serializers import GradeSerializer, SchoolSerializer

class TrainingSerializer(serializers.ModelSerializer):
    trainers = serializers.PrimaryKeyRelatedField(queryset = User.objects.all(), many=True)
    grades = serializers.PrimaryKeyRelatedField(queryset = Grades.objects.all(), many=True)
    currentGrade = serializers.PrimaryKeyRelatedField(queryset = Grades.objects.all(), write_only=True)
    currentGradeDetails = GradeSerializer(read_only=True, source='currentGrade')
    class Meta:
        model = Training
        exclude = ['updated_at', 'created_at']

    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # print(self.context)
        if self.context['request'].method == 'GET':
            representation['trainers'] = userSerializer(instance.trainers.all(), many=True).data
            representation['grades'] = GradeSerializer(instance.grades.all(), many=True).data
            representation['schools'] = SchoolSerializer(instance.schools.all(), many=True, context=self.context).data
        return representation


class TrainingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingDataModel
        fields = ["id", "data", "active"]


class TrainingSheetSerializer(serializers.ModelSerializer):
    trainingData = TrainingDataSerializer(many=True, read_only=True)
    class Meta:
        model = TrainingSheetModel
        exclude = ['updated_at', 'created_at']


class TrainingRequestSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset = School.objects.all())
    requestor = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    grades = serializers.PrimaryKeyRelatedField(queryset = Grades.objects.all(), many=True)
    class Meta:
        model = TrainingRequestsModel
        exclude = ['updated_at', 'created_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if self.context['request'].method == 'GET':
            representation['school'] = SchoolSerializer(instance.school).data
            representation['requestor'] = userSerializer(instance.requestor).data
            representation['grades'] = GradeSerializer(instance.grades.all(), many=True).data
        return representation

