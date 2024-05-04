from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
from .models import Profile
from .serializers import userSerializer, ProfileSerializer
from .tasks import testing

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
        user = request.user
        serializer = userSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
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
    
