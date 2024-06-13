from rest_framework import serializers
from .models import Training, TrainingDataModel, TrainingSheetModel, TrainingRequestsModel
from account_app.models import User
from account_app.serializers import userSerializer
from school_app.models import Grades, School
from school_app.serializers import GradeSerializer, SchoolSerializer


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




class TrainingSerializer(serializers.ModelSerializer):
    trainer = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    # currentGrade = serializers.PrimaryKeyRelatedField(queryset = Grades.objects.all(), write_only=True)
    currentGradeDetails = GradeSerializer(read_only=True, source='currentGrade')
    trainings = serializers.PrimaryKeyRelatedField(queryset = TrainingRequestsModel.objects.all(), many=True, write_only=True)
    trainingDetail = TrainingRequestSerializer(read_only=True, source='trainings', many=True)

    # Validate that in the trainings all trainings are having same subject and their start time is same
    def validate(self, data):
        if 'trainings' in data and len(data['trainings']) > 1:
            subject = data['trainings'][0].subject
            start_time = data['trainings'][0].startTime
            startDate = data['trainings'][0].startDate

            for training in data['trainings']:
                if training.subject != subject and training.startTime != start_time and training.startDate != startDate:
                    raise serializers.ValidationError("All trainings must be same subject and same start time")
            return data
        return data

    class Meta:
        model = Training
        exclude = ['updated_at', 'created_at']

    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if self.context['request'].method == 'GET':
            representation['trainer'] = userSerializer(instance.trainer).data
            representation['currentGradeDetails'] = GradeSerializer(instance.currentGrade).data
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


