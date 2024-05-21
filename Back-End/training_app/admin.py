from django.contrib import admin
from .models import Training, TrainingSheetModel, TrainingDataModel, TrainingRequestsModel, MasterTraining

# Create filters for Training
class TrainingFilter(admin.ModelAdmin):
    def schools(self, obj):
        trainings = obj.trainings.all()
        return '/n'.join([str(training.school) for training in trainings])

    list_display = ['trainer', 'schools', 'active', ]
    list_filter = ('trainer', 'active', 'trainingStatus')
    search_fields = ('trainer', 'active','trainingStatus', 'currentGrade')
    # add table view of Training model in admin side



class TrainingRequestFilter(admin.ModelAdmin):
    list_filter = ('school', 'subject', 'requestor', 'status', 'subject')
    search_fields = ('school', 'subject', 'requestor', 'status', 'subject')

admin.site.register(Training, TrainingFilter)
admin.site.register(TrainingRequestsModel, TrainingRequestFilter)

admin.site.register([TrainingSheetModel, TrainingDataModel, MasterTraining])
