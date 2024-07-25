from django.urls import path
from .views import *
from django.views.decorators.cache import cache_page

urlpatterns = [
    path("", TrainingGetPost.as_view()),
    path("all/", cache_page(60*10)(AllActiveTraining.as_view())),
    path("<uuid:pk>/", TrainingById.as_view()),
    path("filter/", TrainingFilterView.as_view()),
    path("request/", TrainingRequestView.as_view()),
    path("request/<uuid:id>", TrainingRequestByIdView.as_view()),
    path("sheet/<uuid:id>/", TrainingSheetView.as_view()),
    path("sheet/data/<uuid:id>/", TrainingDataView.as_view()),
    path("statistics/", cache_page(60*5)(TrainingStatisticsView.as_view())),
    path("transfer/", TrainingTransferView.as_view()),
    path("attendance/", AttendanceView.as_view()),
    path("attendance/<uuid:teacher_id>/", AttendanceByTeacher.as_view()),
    # path("trainer/all/<str:id>/", TrainingByTrainerId.as_view()),
]
