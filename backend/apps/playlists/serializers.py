from rest_framework import serializers
from .models import Playlist, PlaylistSong
from apps.music.serializers import SongSerializer

# ======================================================
# SERIALIZER: PlaylistSong
# ======================================================
class PlaylistSongSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlaylistSong
        fields = ["id", "playlist", "song"]


# ======================================================
# SERIALIZER: Playlist
# ======================================================
class PlaylistSerializer(serializers.ModelSerializer):

    songs = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = ["id", "name", "creator", "songs"]

    def get_songs(self, obj):
        playlist_songs = obj.playlistsong_set.all()
        songs = [ps.song for ps in playlist_songs]
        return SongSerializer(songs, many=True).data