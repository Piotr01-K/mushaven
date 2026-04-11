# ======================================================
# VIEWS API dla aplikacji music
# ======================================================

from rest_framework import viewsets

from .models import Genre, Artist, Album, Song
from .serializers import GenreSerializer, ArtistSerializer, AlbumSerializer, SongSerializer
from django.db.models import Count, Q

from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response

from apps.playlists.models import PlaylistSong
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


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

    # ❤️ LIKE / UNLIKE
    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        """
        Toggle like:
        - jeśli user już polubił → usuń
        - jeśli nie → dodaj
        """
        song = self.get_object()
        user = request.user

        if user in song.liked_by.all():
            song.liked_by.remove(user)
            return Response({"status": "unliked"})
        else:
            song.liked_by.add(user)
            return Response({"status": "liked"})
        
    def get_serializer_context(self):
        context = super().get_serializer_context()  # bierze domyślny context DRF
        context["request"] = self.request           # dodajemy request (ważne dla is_liked)
        return context


# ======================================================
# API: Top songs
# ======================================================

@api_view(["GET"])
def top_songs(request):
    """
    Top songs na podstawie lajków
    """

    songs = (
        Song.objects
        .annotate(count=Count("liked_by", distinct=True))
        .order_by("-count")[:10]
    )

    data = [
        {
            "title": song.title,
            "count": song.count
        }
        for song in songs
    ]

    return Response(data)

@api_view(["GET"])
def recommendations(request, song_id):

    try:

        song = Song.objects.get(id=song_id)

    except Song.DoesNotExist:

        return Response({"error": "Song not found"})

    genre = song.album.artist.genre

    songs = Song.objects.filter(
        album__artist__genre=genre
    ).exclude(
        id=song.id
    )[:10]

    serializer = SongSerializer(songs, many=True)

    return Response(serializer.data)

@api_view(["GET"])
def search_music(request):

    query = request.GET.get("q")

    if not query:
        return Response({"error": "Query parameter 'q' required"})

    artists = Artist.objects.filter(
        pseudonym__icontains=query
    )[:5]

    albums = Album.objects.filter(
        title__icontains=query
    )[:5]

    songs = Song.objects.filter(
        title__icontains=query
    )[:5]

    return Response({
        "artists": ArtistSerializer(artists, many=True).data,
        "albums": AlbumSerializer(albums, many=True).data,
        "songs": SongSerializer(songs, many=True).data,
    })


# ======================================================
# API: Polubienia
# ======================================================

# ❤️ LIKE
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def like_song(request, song_id):

    song = get_object_or_404(Song, id=song_id)

    song.liked_by.add(request.user)

    return Response({"status": "liked"})


# 💔 UNLIKE
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def unlike_song(request, song_id):

    song = get_object_or_404(Song, id=song_id)

    song.liked_by.remove(request.user)

    return Response({"status": "unliked"})