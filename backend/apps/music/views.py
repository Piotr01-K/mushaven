# ======================================================
# VIEWS API dla aplikacji music
# ======================================================

from rest_framework import viewsets

from .models import Genre, Artist, Album, Song
from .serializers import GenreSerializer, ArtistSerializer, AlbumSerializer, SongSerializer
from django.db.models import Count

from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.playlists.models import PlaylistSong

# ======================================================
# API: Genres
# ======================================================
class GenreViewSet(viewsets.ModelViewSet):

    queryset = Genre.objects.all()

    serializer_class = GenreSerializer


# ======================================================
# API: Artists
# ======================================================
class ArtistViewSet(viewsets.ModelViewSet):

    queryset = Artist.objects.all()

    serializer_class = ArtistSerializer


# ======================================================
# API: Albums
# ======================================================
class AlbumViewSet(viewsets.ModelViewSet):

    queryset = Album.objects.all()

    serializer_class = AlbumSerializer


# ======================================================
# API: Songs
# ======================================================
class SongViewSet(viewsets.ModelViewSet):

    queryset = Song.objects.all()

    serializer_class = SongSerializer


# ======================================================
# API: Top songs
# ======================================================

@api_view(["GET"])
def top_songs(request):
    """
    Zwraca listę najpopularniejszych piosenek.

    Popularność = ile razy piosenka została dodana do playlist.
    """

    songs = (
        PlaylistSong.objects
        .values("song__title")
        .annotate(count=Count("song"))
        .order_by("-count")[:10]
    )

    return Response(songs)