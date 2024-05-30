from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_view'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh_view'),
    path('admin/', admin.site.urls),
    path('account/', include('account_app.urls')),
    path('school/', include('school_app.urls')),
    path('training/', include('training_app.urls')),
    path('gsheet/', include('google_sheet_app.urls')),
    path("__debug__/", include("debug_toolbar.urls")),
]

# Add statics file to url to access the profile pics
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
