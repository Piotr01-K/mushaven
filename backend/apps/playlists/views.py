from .permissions import IsPlaylistOwner
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from rest_framework import viewsets

from .models import Playlist, PlaylistSong
from .serializers import PlaylistSerializer, PlaylistSongSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Playlist, PlaylistSong


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

    @action(detail=True, methods=["post"], url_path="add-song")   # dodawanie playlist song
    def add_song(self, request, pk=None):
        playlist = self.get_object()
        song_id = request.data.get("song_id")

        if not song_id:
            return Response({"error": "song_id required"}, status=400)

        last_song = playlist.playlistsong_set.order_by("-order").first()

        next_order = last_song.order + 1 if last_song else 1

        PlaylistSong.objects.create(
            playlist=playlist,
            song_id=song_id,
            order=next_order
        )


        return Response({"status": "song added"})


# ======================================================
# API: PlaylistSong
# ======================================================
class PlaylistSongViewSet(viewsets.ModelViewSet):

    queryset = PlaylistSong.objects.all()

    serializer_class = PlaylistSongSerializer
