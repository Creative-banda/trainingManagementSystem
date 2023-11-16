from django.shortcuts import render
from .training_serializer import TrainingSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Training
from django.shortcuts import get_object_or_404


@api_view(['GET', "POST"])
def trainings(request):
    if request.method == 'GET':
        trainings = Training.objects.all()
        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = TrainingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['PATCH', 'DELETE','GET'])
def change_training_data(request, id):
    training = get_object_or_404(Training.objects.all(), pk=id)

    if request.method == 'GET':
        serializer = TrainingSerializer(training)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        serializer = TrainingSerializer(training, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE':
        obj = Training.objects.filter(id=id)
        if obj:
            obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)