#  podłączone API do projektu
# https://docs.djangoproject.com/en/6.0/topics/http/urls/

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [

    path('admin/', admin.site.urls),

    path('api/music/', include('apps.music.urls')),
    path('api/playlists/', include('apps.playlists.urls')),

    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

]
