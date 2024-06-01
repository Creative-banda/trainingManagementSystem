from rest_framework.views import APIView
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from .models import Profile
from .serializers import userSerializer, ProfileSerializer, PasswordChangeSerializer
from .tasks import testing
import logging

User = get_user_model()

logger = logging.getLogger("django")

# Create your views here.
def AccountHome(request):
    testing.delay()
    return HttpResponse("<h1> This is Accounts </h1>")



class ListUsers(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format = None):
        try:
            users = Profile.objects.all().select_related('user')
            serializer = ProfileSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class UserLoginLogout(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        """
            Get User Details
        """
        user = request.user
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
            # token.blacklisted_token.delete()
        except Exception as e:
            return Response(str(e), status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class PasswordChangeView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj
    
    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            tokens = serializer.save()
            # Logout the user after password change
            return Response({'message': 'Password changed successfully', 'refresh': str(tokens['refresh']), 'access': str(tokens['access'])}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)