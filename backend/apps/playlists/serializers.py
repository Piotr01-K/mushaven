from rest_framework import serializers
from .models import Playlist, PlaylistSong


# ======================================================
# SERIALIZER: PlaylistSong
# ======================================================
class PlaylistSongSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlaylistSong
        fields = "__all__"


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
        fields = "__all__"