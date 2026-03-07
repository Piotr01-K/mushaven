from rest_framework import viewsets

from .models import Playlist, PlaylistSong
from .serializers import PlaylistSerializer, PlaylistSongSerializer


# ======================================================
# API: Playlist
# ======================================================
class PlaylistViewSet(viewsets.ModelViewSet):

    queryset = Playlist.objects.all()

    serializer_class = PlaylistSerializer


# ======================================================
# API: PlaylistSong
# ======================================================
class PlaylistSongViewSet(viewsets.ModelViewSet):

    queryset = PlaylistSong.objects.all()

    serializer_class = PlaylistSongSerializer
