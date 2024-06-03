from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from datetime import datetime

from django.contrib.auth import get_user_model

from account_app.models import Profile
from account_app.serializers import userSerializer, ProfileSerializer

import logging

User = get_user_model()
logger = logging.getLogger("django")

class ListUsers(APIView):
    """
    Get all active users
    """

    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format = None):
        try:
            users = Profile.objects.all().select_related('user')
            serializer = ProfileSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class UserLoginLogout(APIView):
    """
    User Login and Logout
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        """
            Get User Details
        """
        user = request.user
        logger.info("User logged in successfully")
        user.last_login = datetime.now()
        serializer = userSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def put(self, request, format=None):
        """
            Update User Details
        """
        user = request.user
        serializer = userSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def post(self, request, format=None):
        """
        User Logout
        """
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


