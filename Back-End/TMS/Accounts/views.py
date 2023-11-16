from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models.Profile import Profile
from .user_serializer import ProfileSerializer

def AccountHome(request):
    return HttpResponse("<h1> This is Accounts </h1>")

@api_view(['GET'])
def UserView(request):
    if request.method == 'GET':
        users = Profile.objects.all()
        serializer = ProfileSerializer(users, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)