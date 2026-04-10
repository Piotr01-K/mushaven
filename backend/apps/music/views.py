# ======================================================
# VIEWS API dla aplikacji music
# ======================================================

from rest_framework import viewsets

from .models import Genre, Artist, Album, Song
from .serializers import GenreSerializer, ArtistSerializer, AlbumSerializer, SongSerializer
from django.db.models import Count, Q

from rest_framework.decorators import api_view, permission_classes
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


# ======================================================
# API: Top songs
# ======================================================

@api_view(["GET"])
def top_songs(request):
    """
    Zwraca listę najpopularniejszych piosenek.

    Popularność = ile razy piosenka została dodana do playlist.
    """

    songs = (
        PlaylistSong.objects
        .values("song__title")
        .annotate(count=Count("song"))
        .order_by("-count")[:10]
    )

    result = [
        {"title": item["song__title"], "count": item["count"]}
        for item in songs
    ]

    return Response(result)


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