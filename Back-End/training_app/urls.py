from django.urls import path
from .views import TrainingGetPost, TrainingById, TrainingFilterView, TrainingStatisticsView, AllActiveTraining, TrainingSheetView, TrainingDataView, TrainingRequestView, TrainingRequestByIdView, TrainingTransferView
from django.views.decorators.cache import cache_page

urlpatterns = [
    path("", TrainingGetPost.as_view()),
    path("all/", cache_page(60*10)(AllActiveTraining.as_view())),
    path("request/", TrainingRequestView.as_view()),
    path("request/<str:id>", TrainingRequestByIdView.as_view()),
    path("filter/", TrainingFilterView.as_view()),
    path("sheet/<str:id>/", TrainingSheetView.as_view()),
    path("sheet/data/<str:id>/", TrainingDataView.as_view()),
    path("statistics/", cache_page(60*5)(TrainingStatisticsView.as_view())),
    path("transfer/", TrainingTransferView.as_view()),
    path("<str:pk>/", TrainingById.as_view()),
    # path("trainer/all/<str:id>/", TrainingByTrainerId.as_view()),
]
