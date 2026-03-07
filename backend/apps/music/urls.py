#  Router automatycznie tworzy adresy URL dla API

from rest_framework.routers import DefaultRouter

from .views import GenreViewSet, ArtistViewSet, AlbumViewSet, SongViewSet


router = DefaultRouter()

router.register(r'genres', GenreViewSet)
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'songs', SongViewSet)


urlpatterns = router.urls