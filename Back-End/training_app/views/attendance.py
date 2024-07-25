from teachers_app.models import Teacher
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from training_app.serializers import AttentanceSerializer
from training_app.models import Attendance

class AttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        attendances = Attendance.objects.all().select_related('teacher', 'training')
        serializer = AttentanceSerializer(attendances, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AttentanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AttendanceByTeacher(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, teacher_id):
        try:
            attendances = Attendance.objects.get(teacher=teacher_id)
            serializer = AttentanceSerializer(attendances)
            return Response(serializer.data)
        except Attendance.DoesNotExist:
            return Response({"error": "Teacher attendance does not exist"},status=status.HTTP_404_NOT_FOUND)

    def put(self, request, teacher_id):
        try:
            attendance = Attendance.objects.get(teacher=teacher_id)
        except Attendance.DoesNotExist:
            return Response({"error": "Teacher attendance does not exist"},status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttentanceSerializer(attendance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, teacher_id):
        attendance = Attendance.objects.get(teacher=teacher_id)
        attendance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

