from datetime import datetime
from rest_framework.views import APIView
from django.db.models import Count
from calendar import month_name
from django.db.models.functions import ExtractMonth
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Training
from .serializers import TrainingSerializer
from .filters import TrainingFilter


################################### To get all the training and Post a new training ###################################

class TrainingGetPost(APIView, LimitOffsetPagination):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            trainings = Training.objects.filter(active=True).prefetch_related('trainers', 'schools', 'grades')
            result = self.paginate_queryset(trainings, request, view=self)
            print(result)
            serializer = TrainingSerializer(result, many = True, context = {"request": request})
            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        serializer = TrainingSerializer(data=request.data, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


################################ To Show Trainings on Dashboard ################################
class AllActiveTraining(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            trainings = Training.objects.filter(active=True).prefetch_related('trainers', 'schools', 'grades')
            serializer = TrainingSerializer(trainings, many = True, context = {"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


################################### CRUD Operation based on Training ID ###################################
class TrainingById(APIView):
    permission_classes = [IsAuthenticated]
        
    def get(self, request, pk: str):
        try:
            training = Training.objects.filter(id=pk, active=True).prefetch_related('trainers', 'schools', 'grades').first()
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        
        serializer = TrainingSerializer(training, context={'request': request}) 
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        # print(request.data) 
        try:
            training = Training.objects.filter(id=pk, active=True).prefetch_related('trainers', 'schools', 'grades').first()
            # training = get_object_or_404(Training, id=pk, active=True)
        except Exception as e:
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
        
        serializer = TrainingSerializer(training, data=request.data, context = {"request": request})
        try:
            serializer.is_valid(raise_exception=True)
            # print(serializer)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            training = Training.objects.filter(id=pk).first()
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


################################### Filter class to apply filter operation ###################################

class TrainingFilterView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        queryset = Training.objects.all()

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
        end_date = datetime(year, end_month % 12, 1)  # Increment end_month by 1 and wrap around if needed

        # Query the database to get training counts per month and trainingType
        training_counts_by_month_type = Training.objects.filter(
            startDate__month__gte=start_date.month, startDate__month__lte=end_date.month,
            startDate__year=year, active=True
        ).annotate(
            month=ExtractMonth('startDate')
        ).values('month', 'trainingType').annotate(total_trainings=Count('id')).order_by('month', 'trainingType')

        # Resulting QuerySet
        result_list = [
            {
                'month': month_name[entry['month']],
                'trainingType': entry['trainingType'],
                'total_trainings': entry['total_trainings']
            } for entry in training_counts_by_month_type
        ]
        return Response(result_list, status=status.HTTP_200_OK)
    
    