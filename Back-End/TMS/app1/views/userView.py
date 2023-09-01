from django.shortcuts import render
from ..models.User import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UserSerializer


@api_view(['POST'])
def RegisterView(request):
    user = UserSerializer(data=request.data)
    if user.is_valid():
        user.save()
        return Response(user.data, status=status.HTTP_200_OK)
    return Response(user.errors, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET'])
def GetUsersView(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    