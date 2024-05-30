import logging
from datetime import datetime
from rest_framework.views import APIView
from django.db.models import Count
from django.db import transaction
from calendar import month_name
from django.db.models.functions import ExtractMonth
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from account_app.models import User
from .models import Training, TrainingSheetModel, TrainingDataModel, TrainingRequestsModel
from .serializers import TrainingSerializer, TrainingSheetSerializer, TrainingDataSerializer, TrainingRequestSerializer, MasterTrainingSerializer
from .filters import TrainingFilter, TrainingSheetModelFilter, TrainingRequestFilter
from .enums import TrainingRequestEnum
from .tasks import sending_mail, send_training_mail
from utils.cache import cache_view


logger = logging.getLogger("django")

################################# Training Request API #########################################

class TrainingRequestView(APIView):
    queryset = TrainingRequestsModel.objects.all()
    
    @cache_view(timeout=60*10)
    def get(self, request):
        # apply filter using filterset class
        try:
            filterset = TrainingRequestFilter(request.query_params, queryset=self.queryset)
            queryset = filterset.qs
            serializer = TrainingRequestSerializer(queryset, many=True, context={"request": request})
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
    @cache_view(timeout=60*10)
    def post(self, request):
        serializer = TrainingRequestSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrainingRequestByIdView(APIView):
    def patch(self, request, id):
        try:
            training_request = TrainingRequestsModel.objects.get(id = id, active = True)
            serializer = TrainingRequestSerializer(training_request, partial=True, context={"request": request}, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


################################### To get all the training and Post a new training ###################################

class TrainingGetPost(APIView, LimitOffsetPagination):
    permission_classes = [IsAuthenticated]
    
    @cache_view(timeout=60*15)
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
    
    @cache_view(timeout=60*1)
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
    
    @cache_view(timeout=60*15)
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


############################ Graph data, Total number of training in each month ############################
class TrainingStatisticsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            year = int(request.GET.get('year'))
            start_month = int(request.GET.get('start_month'))
            end_month = int(request.GET.get('end_month'))
        except (ValueError, TypeError):
            return Response({'error': 'Invalid parameters provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate month range
        if not (1 <= start_month <= 12) or not (1 <= end_month <= 12) or start_month > end_month:
            return Response({'error': 'Invalid start or end month'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create datetime objects for start and end dates
        start_date = datetime(year, start_month, 1)
        end_date = datetime(year, end_month, 1)  # Increment end_month by 1 and wrap around if needed

        # Query the database to get training counts per month and subject
        training_counts_by_month_type = TrainingRequestsModel.objects.filter(
            startDate__month__gte=start_date.month, startDate__month__lte=end_date.month,
            startDate__year=year
        ).annotate(
            month=ExtractMonth('startDate')
        ).values('month', 'subject').annotate(total_trainings=Count('id')).order_by('month', 'subject')

        # Resulting QuerySet
        result_list = [
            {
                'month': month_name[entry['month']],
                'subject': entry['subject'],
                'total_trainings': entry['total_trainings']
            } for entry in training_counts_by_month_type
        ]
        return Response(result_list, status=status.HTTP_200_OK)
    

##################################### Training Sheet Data View #####################################

class TrainingSheetView(APIView):
    def getQueryset(self, id):
        return TrainingSheetModel.objects.filter(school__id = id).prefetch_related('trainingData')

    def get(self, request, id):
        try:
            # print("Fetching Data...")
            training_filter = TrainingSheetModelFilter(request.query_params, queryset=self.getQueryset(id))
            training_sheet = training_filter.qs.first()
            # print(training_sheet)
            serializer = TrainingSheetSerializer(training_sheet)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, id):
        subject = request.query_params.get("subject")
        trainingSheet = TrainingSheetModel.objects.filter(school__id = id, subject = subject).prefetch_related('trainingData').first()
        if trainingSheet:
            # print(trainingSheet)
            trainingData = TrainingDataModel.objects.create(data = request.data)
            trainingSheet.trainingData.add(trainingData)
            return Response(trainingData.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Training sheet not found"}, status=status.HTTP_400_BAD_REQUEST)


##################################### Training Data View #####################################
class TrainingDataView(APIView):
    @cache_view(timeout=60*10)
    def get(self, request, id):
        try:
            training_data = TrainingDataModel.objects.filter(id = id, active=True).first()
            serializer = TrainingDataSerializer(training_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, id):
        try:
            # print(request.data)
            training_data = TrainingDataModel.objects.get(id = id)
            training_data.data = request.data
            training_data.save()
            return Response(training_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            training_data = TrainingDataModel.objects.get(id = id)
            training_data.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
    

