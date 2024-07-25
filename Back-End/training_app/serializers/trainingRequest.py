from rest_framework import serializers
from training_app.models import TrainingRequestsModel
from account_app.models import User
from school_app.models import Grades, School
from account_app.serializers import userSerializer
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
