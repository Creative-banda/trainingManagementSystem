from django.urls import path
from .views import TrainingGetPost, TrainingById, TrainingsByTrainer, TrainingFilterView, TrainingStatisticsView, AllActiveTraining
from django.views.decorators.cache import cache_page

urlpatterns = [
    path("filter/", cache_page(60*5)(TrainingFilterView.as_view())),
    path("statistics/", cache_page(60*5)(TrainingStatisticsView.as_view())),
    path("all/", cache_page(60*10)(AllActiveTraining.as_view())),
    path("<str:pk>/", TrainingById.as_view()),
    path("trainer/<str:id>/", TrainingsByTrainer.as_view()),
    path("", TrainingGetPost.as_view()),
]