from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from ..serializers import SchoolSerializer
from ..models import School

@api_view(['GET'])
def getSchoolsView(request):
    schools = School.objects.all()
    serializer = SchoolSerializer(schools, many=True)
    return Response(serializer.data)



@api_view(['POST'])
def addSchoolView(request):
    serializer = SchoolSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)