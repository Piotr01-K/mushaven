from rest_framework.routers import DefaultRouter

from .views import PlaylistViewSet, PlaylistSongViewSet


router = DefaultRouter()

router.register(r'playlists', PlaylistViewSet)
router.register(r'playlist-songs', PlaylistSongViewSet)

urlpatterns = router.urls