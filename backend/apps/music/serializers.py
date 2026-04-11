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

    # liczba lajków
    likes_count = serializers.SerializerMethodField()

    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = "__all__"

    def get_likes_count(self, obj):
        return obj.liked_by.count()
    
    # Sprawdza czy użytkownik polubił ten utwór
    def get_is_liked(self, obj):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()

        return False