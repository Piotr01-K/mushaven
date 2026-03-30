from rest_framework import serializers
from .models import Playlist, PlaylistSong
from apps.music.serializers import SongSerializer

# ======================================================
# SERIALIZER: PlaylistSong
# ======================================================
class PlaylistSongSerializer(serializers.ModelSerializer):

    # pobieramy tytuł utworu z powiązanego modelu Song
    song_title = serializers.CharField(source="song.title", read_only=True)

    class Meta:
        model = PlaylistSong
        fields = ["id", "playlist", "song", "song_title"]


# ======================================================
# SERIALIZER: Playlist
# ======================================================
class PlaylistSerializer(serializers.ModelSerializer):

    songs = PlaylistSongSerializer(
        source="playlistsong_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = Playlist
        fields = ["id", "name", "creator", "songs"]

    def get_songs(self, obj):
        playlist_songs = obj.playlistsong_set.all()
        songs = [ps.song for ps in playlist_songs]
        return SongSerializer(songs, many=True).data