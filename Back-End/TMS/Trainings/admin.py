from django.contrib import admin
from .models import Training, TrainingSheet

admin.site.register([Training, TrainingSheet])
