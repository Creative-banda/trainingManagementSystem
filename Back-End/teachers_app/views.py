from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .filters import TeacherFilter, AttendanceFilter
from .serializers import TeacherSerializer, SubjectSerializer, AttendanceSerializer
from .models import Teacher, Subject, Attendance, TeacherScore
import logging
from ast import literal_eval

logger = logging.getLogger("django")

class TeacherGetPost(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Teacher.objects.prefetch_related('subject').all()
    serializer_class = TeacherSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TeacherFilter


class TeacherById(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TeacherSerializer
    queryset = Teacher.objects.prefetch_related('subject').all()


class SubjectsGenericView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all();


class TeacherAttendanceView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    queryset = Attendance.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = AttendanceFilter

    # def get(self, request, *args, **kwargs):
    #     logger.info(request.query_params)
    #     teachers_id = literal_eval(request.query_params.get('teachers')) if type(request.query_params.get('teachers')) == str else request.query_params.get('teachers')
    #     # logger.info(teachers_id)
    #     subject = request.query_params.get('subject')
    #     if not teachers_id or not subject:
    #         return Response({'error': 'Please provide teachers and subject'}, status=status.HTTP_400_BAD_REQUEST)
    #     try:
    #         queryset = Attendance.objects.filter(teacher_id__in=teachers_id, subject__name=subject)
    #         serializer = self.get_serializer(queryset, many=True)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



