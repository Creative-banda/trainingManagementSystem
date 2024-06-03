import logging
from rest_framework.views import APIView
from django.db import transaction
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from account_app.models import User
from training_app.models import Training, TrainingSheetModel, TrainingDataModel, TrainingRequestsModel
from training_app.serializers import TrainingSerializer, TrainingSheetSerializer, TrainingDataSerializer, TrainingRequestSerializer, MasterTrainingSerializer
from training_app.filters import TrainingFilter, TrainingSheetModelFilter, TrainingRequestFilter
from training_app.enums import TrainingRequestEnum
from training_app.tasks import send_training_mail
# from utils.cache import cache_view


logger = logging.getLogger("django")


################################### To get all the training and Post a new training ###################################

class TrainingGetPost(APIView, LimitOffsetPagination):
    permission_classes = [IsAuthenticated]
    
    # @cache_view(timeout=60*15)
    def get(self, request):
        try:
            trainings = Training.objects.filter(active=True).prefetch_related('trainings')
            filter = TrainingFilter(request.query_params, queryset=trainings)
            result = self.paginate_queryset(filter.qs, request, view=self)
            # print(result)
            serializer = TrainingSerializer(result, many=True, context = {"request": request})
            # print(serializer.data)
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


    def post(self, request):
        serializer = TrainingSerializer(data=request.data, context={"request": request})
        try:
            if serializer.is_valid():
                serializer.save()
                send_training_mail.delay(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


################################ To Show Trainings on Dashboard ################################
class AllActiveTraining(APIView):
    
    def get(self, request):
        try:
            trainings = Training.objects.filter(active=True).prefetch_related('trainings')
            serializer = TrainingSerializer(trainings, many = True, context = {"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


################################### CRUD Operation based on Training ID ###################################
class TrainingById(APIView):
    permission_classes = [IsAuthenticated]
        
    def get(self, request, pk: str) -> Response:
        try:
            training = Training.objects.filter(id=pk, active=True).prefetch_related('trainings').first()
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        
        serializer = TrainingSerializer(training, context={'request': request}) 
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        # print(request.data) 
        try:
            training = Training.objects.filter(id=pk, active=True).prefetch_related('trainings').first()
            # training = get_object_or_404(Training, id=pk, active=True)
        except Exception as e:
            print(pk)
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        
        try:
            serializer = TrainingSerializer(training, data=request.data, context = {"request": request}, partial=True)
            serializer.is_valid(raise_exception=True)
            print(serializer)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            training = Training.objects.filter(id=pk).first()
            trainingRequests = training.trainings.all()
            with transaction.atomic():
                for trainingRequest in trainingRequests:
                    trainingRequest.status = "PENDING"
                    trainingRequest.save()
            training.active = False
            training.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)


################################### To get all the active training by Trainer ID ###################################

class TrainingsByTrainer(APIView, LimitOffsetPagination):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            training = Training.objects.filter(trainers__id = id, active=True).prefetch_related('trainers', 'schools', 'grades')
            # training = Training.objects.filter(trainers__id = id, active=True)
            result = self.paginate_queryset(training, request, view=self)
            serializer = TrainingSerializer(result, context = {"request": request}, many=True)
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


################################## To get all the training by Trainer ID without pagination ###################################

class TrainingByTrainerId(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        try:
            training = Training.objects.filter(trainers__id = id, active=True).prefetch_related('trainings')
            serializer = TrainingSerializer(training, many = True, context = {"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

################################### Filter class to apply filter operation ###################################

class TrainingFilterView(APIView):
    permission_classes = [IsAuthenticated]
    
    # @cache_view(timeout=60*15)
    def get(self, request, *args, **kwargs):
        queryset = Training.objects.all().prefetch_related('trainings')

        # Apply filters using the filterset class
        try:
            filterset = TrainingFilter(request.query_params, queryset=queryset)
            queryset = filterset.qs

            serializer = TrainingSerializer(queryset, many=True, context={"request": request})
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
   
 

