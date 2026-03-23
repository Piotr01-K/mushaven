from rest_framework import serializers
from .models import Playlist, PlaylistSong


# ======================================================
# SERIALIZER: PlaylistSong
# ======================================================
class PlaylistSongSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlaylistSong
        fields = ["id", "name", "creator", "songs"]


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