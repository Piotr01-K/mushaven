# ======================================================
# VIEWS API dla aplikacji music
# ======================================================

from rest_framework import viewsets

from .models import Genre, Artist, Album, Song
from .serializers import GenreSerializer, ArtistSerializer, AlbumSerializer, SongSerializer


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
