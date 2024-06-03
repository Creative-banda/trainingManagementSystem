from django.core.cache import cache
from django.db import transaction
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


from training_app.models import Training
from school_app.models import School, Grades
from school_app.serializers import SchoolSerializer, GradeSerializer
from school_app.filter import SchoolFilter



################################ Get all grades #################################
class GradeGetView(APIView):
    def get(self, request):
        try:
            grades = Grades.objects.all()
            serializer = GradeSerializer(grades, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status = status.HTTP_400_BAD_REQUEST)
        

class SchoolFilterView(APIView):
    query_set = School.objects.filter(active=True)
    def get(self, request):
        filter_set = SchoolFilter(request.query_params, queryset=self.query_set)
        serializer = SchoolSerializer(filter_set.qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


    