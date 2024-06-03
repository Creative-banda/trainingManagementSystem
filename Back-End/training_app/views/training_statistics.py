from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from training_app.models import TrainingRequestsModel

from django.db.models import Count
from django.db.models.functions import ExtractMonth

from calendar import month_name


import logging

logger = logging.getLogger("django")


############################ Graph data, Total number of training in each month ############################
class TrainingStatisticsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            year = int(request.GET.get('year'))
            start_month = int(request.GET.get('start_month'))
            end_month = int(request.GET.get('end_month'))
        except (ValueError, TypeError):
            logger.error('Choose correct parameters')
            return Response({'error': 'Invalid parameters provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate month range
        if not (1 <= start_month <= 12) or not (1 <= end_month <= 12) or start_month > end_month:
            logger.error('Choose correct month range')
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
 