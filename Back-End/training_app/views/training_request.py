from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from training_app.models import TrainingRequestsModel
from training_app.serializers import TrainingRequestSerializer
from training_app.filters import TrainingRequestFilter

import logging

logger = logging.getLogger("django")

################################# Training Request API #########################################

class TrainingRequestView(APIView):
    """
    All Training Request get, post operations API
    """

    queryset = TrainingRequestsModel.objects.all()

    def get(self, request):
        # apply filter using filterset class
        try:
            filterset = TrainingRequestFilter(request.query_params, queryset=self.queryset)
            queryset = filterset.qs
            serializer = TrainingRequestSerializer(queryset, many=True, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        serializer = TrainingRequestSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            logger.info("Training request created successfully")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TrainingRequestByIdView(APIView):
    """
    Training Request Operations By Id API
    """
    def patch(self, request, id):
        try:
            print(id)
            training_request = TrainingRequestsModel.objects.get(id = id, active = True)
            serializer = TrainingRequestSerializer(training_request, partial=True, context={"request": request}, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            logger.error(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

