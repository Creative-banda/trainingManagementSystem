from django.core.cache import cache
from django.db import transaction
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from school_app.models import School
from school_app.serializers import SchoolSerializer
from school_app.filter import SchoolFilter

from training_app.models import Training, TrainingRequestsModel

import logging

logger = logging.getLogger("django")

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
            logger.info("Schools fetched successfully")
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):    
        serializer = SchoolSerializer(data = request.data, context = {"request": request})
        if serializer.is_valid():
            serializer.save()
            logger.info("School created successfully")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



##################### GET, UPDATE or DELETE School by School ID ###########################
class SchoolById(APIView):
    """
     GET, UPDATE or DELETE School by School ID
    """
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
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        try:
            school = self.get_school(pk)
        except Exception as e:

            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        with transaction.atomic():
            training = TrainingRequestsModel.objects.filter(school=school)
            training.active = False
            school.active = False
            training.save()
            school.save()
        logger.info("School deleted successfully")
        return Response(status=status.HTTP_204_NO_CONTENT)

