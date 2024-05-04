from django.urls import path
from .views import SchoolById, SchoolsGetPost, GradeGetView, SchoolFilterView
from django.views.decorators.cache import cache_page

urlpatterns = [
    path("", SchoolsGetPost.as_view()),
    path("filter/", SchoolFilterView.as_view()),
    path("grades/",cache_page(60*10)(GradeGetView.as_view())),
    path("<str:pk>/", SchoolById.as_view()),
]
