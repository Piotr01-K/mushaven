#  Router automatycznie tworzy adresy URL dla API

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import GenreViewSet, ArtistViewSet, AlbumViewSet, SongViewSet
from .views import top_songs
from .views import recommendations
from .views import search_music, genres_list
from .views import like_song, unlike_song

router = DefaultRouter()

router.register(r'genres', GenreViewSet)
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'songs', SongViewSet)


urlpatterns = router.urls + [

    path("top-songs/", top_songs),
    path("recommendations/<int:song_id>/", recommendations),
    path("search/", search_music),
    path("genres/", genres_list),
]

urlpatterns += [
    path("songs/<int:song_id>/like/", like_song),
    path("songs/<int:song_id>/unlike/", unlike_song),
]