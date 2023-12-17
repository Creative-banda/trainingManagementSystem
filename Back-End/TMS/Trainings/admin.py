from django.contrib import admin
from .models import Training

class TrainingAdmin(admin.ModelAdmin):
    list_display = ('trainingStatus','startDate', 'startTime','trainingType')

admin.site.register(Training, TrainingAdmin)
