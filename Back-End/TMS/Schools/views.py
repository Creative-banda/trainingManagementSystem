from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import School
from .school_serializer import SchoolSerializer
from django.shortcuts import get_object_or_404


@api_view(['GET','POST'])
def SchoolsView(request):
    if request.method == 'GET':
        schools = School.objects.filter(active=True)
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = SchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PATCH', 'DELETE', 'GET'])
def updateSchoolView(request, id):
    school = get_object_or_404(School.objects.all(), pk=id, active=True)

    if request.method == 'PATCH':
        serializer = SchoolSerializer(school, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'GET':
        serializer = SchoolSerializer(school)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        school.active = False
        school.save()
        return Response(status=status.HTTP_204_NO_CONTENT)