from django.core.cache import cache
from django.db import transaction
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


from training_app.models import Training
from .models import School, Grades
from .serializers import SchoolSerializer, GradeSerializer
from .filter import SchoolFilter


################################ Get all schools or post a new school #################################
class SchoolsGetPost(APIView, LimitOffsetPagination):
    
    def get(self, request):
        try:
            schools = School.objects.filter(active=True)
            # Fetch all the school if there is not query_params in the request
            if not request.query_params:
                serializer = SchoolSerializer(schools, many = True, context = {"request":request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            # Fetch the schools with the query parameters
            result = self.paginate_queryset(schools, request, view=self)
            serializer = SchoolSerializer(result, many = True, context = {"request":request})
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):    
        serializer = SchoolSerializer(data = request.data, context = {"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

################################ GET, UPDATE or DELETE School by School ID #################################
class SchoolById(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    # A Function to fetch the school by its id
    def get_school(self, pk):
        try:
            return School.objects.filter(pk=pk, active=True).first()
        except:
            raise Exception("School does not exist")
    
    # CRUD Methods on School Object
    def get(self, request, pk, format=None):
        try:
            school = self.get_school(pk)
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        serializer = SchoolSerializer(school, context= {"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def put(self, request, pk, format=None):
        try:
            school = self.get_school(pk)
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        serializer = SchoolSerializer(school, data=request.data, context= {"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        try:
            school = self.get_school(pk)
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        with transaction.atomic():
            training = Training.objects.filter(schools=school)
            training.active = False
            school.active = False
            training.save()
            school.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


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