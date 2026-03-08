from .permissions import IsPlaylistOwner
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from rest_framework import viewsets

from .models import Playlist, PlaylistSong
from .serializers import PlaylistSerializer, PlaylistSongSerializer


# ======================================================
# API: Playlist
# ======================================================
class PlaylistViewSet(viewsets.ModelViewSet):

    queryset = Playlist.objects.all()

    serializer_class = PlaylistSerializer

    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """
        Ta metoda jest wywoływana gdy ktoś tworzy playlistę.

        Automatycznie zapisujemy twórcę playlisty
        jako aktualnie zalogowanego użytkownika.
        """
        serializer.save(creator=self.request.user)

    def get_permissions(self):
        """
        Ta metoda pozwala ustawić różne permissions
        dla różnych operacji.
        """

        if self.action in ["update", "partial_update", "destroy"]:
            return [IsPlaylistOwner()]

        return super().get_permissions()


# ======================================================
# API: PlaylistSong
# ======================================================
class PlaylistSongViewSet(viewsets.ModelViewSet):

    queryset = PlaylistSong.objects.all()

    serializer_class = PlaylistSongSerializer
