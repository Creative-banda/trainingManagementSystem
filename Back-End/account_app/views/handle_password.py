from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from account_app.models import User
from account_app.serializers import PasswordChangeSerializer
import logging

User = get_user_model()
logger = logging.getLogger("django")


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
