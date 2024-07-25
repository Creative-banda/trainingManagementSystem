from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from training_app.models import Training
from training_app.serializers import TrainingSerializer
from training_app.filters import TrainingFilter

from uuid import uuid4

import logging

from account_app.models import User

logger = logging.getLogger("django")


class TrainingTransferView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            training_id = request.data.get("training_id")
            trainer_id = request.data.get("trainer_id")

            if not training_id or not trainer_id:
                return Response({"error": "Missing training_id or trainer_id" }, status=status.HTTP_400_BAD_REQUEST)

            training = Training.objects.select_related('trainer').prefetch_related('trainings').get(id=training_id)
            all_trainings = training.trainings.all()
            if trainer_id == str(training.trainer.id) or training.trainingStatus != "ONGOING":
                return Response({"error": f"Cannot transfer training to {training.trainer.username} trainer"}, status=status.HTTP_400_BAD_REQUEST)

            # Add new training record using training instance
            with transaction.atomic():
                new_training = Training.objects.get(id=training_id)
                new_training.id = None
                new_training.trainer = User.objects.get(id=trainer_id)
                training.trainingStatus = "TRANSFERRED"
                new_training.save()
                new_training.trainings.set(all_trainings)
                training.save()

            return Response(str(new_training), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(str(e))
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

