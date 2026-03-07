from rest_framework import serializers
from .models import Genre, Artist, Album, Song


# ======================================================
# SERIALIZER: Genre
# ======================================================

class GenreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Genre
        fields = "__all__"


# ======================================================
# SERIALIZER: Artist
# ======================================================

class ArtistSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = "__all__"


# ======================================================
# SERIALIZER: Album
# ======================================================

class AlbumSerializer(serializers.ModelSerializer):

    class Meta:
        model = Album
        fields = "__all__"


# ======================================================
# SERIALIZER: Song
# ======================================================

class SongSerializer(serializers.ModelSerializer):

    class Meta:
        model = Song
        fields = "__all__"