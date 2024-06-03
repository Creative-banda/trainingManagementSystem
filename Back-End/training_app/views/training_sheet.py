import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from training_app.models import TrainingSheetModel, TrainingDataModel
from training_app.serializers import TrainingSheetSerializer, TrainingDataSerializer
from training_app.filters import TrainingSheetModelFilter

logger = logging.getLogger("django")


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
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, id):
        subject = request.query_params.get("subject")
        trainingSheet = TrainingSheetModel.objects.filter(school__id = id, subject = subject).prefetch_related('trainingData').first()
        if trainingSheet:
            trainingData = TrainingDataModel.objects.create(data = request.data)
            trainingSheet.trainingData.add(trainingData)
            return Response(trainingData.data, status=status.HTTP_200_OK)
        else:
            logger.error("Training sheet not found")
            return Response({"error": "Training sheet not found"}, status=status.HTTP_400_BAD_REQUEST)


##################################### Training Data View #####################################
class TrainingDataView(APIView):
    # @cache_view(timeout=60*10)
    def get(self, request, id):
        try:
            training_data = TrainingDataModel.objects.filter(id = id, active=True).first()
            serializer = TrainingDataSerializer(training_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, id):
        try:
            # print(request.data)
            training_data = TrainingDataModel.objects.get(id = id)
            training_data.data = request.data
            training_data.save()
            return Response(training_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            training_data = TrainingDataModel.objects.get(id = id)
            training_data.delete()
            logger.info("Training Data deleted successfully")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_204_NO_CONTENT)
   