from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.music.models import Artist, Album, Song
from apps.playlists.models import Playlist

@api_view(["GET"])
def stats(request):

    data = {
        "artists": Artist.objects.count(),
        "albums": Album.objects.count(),
        "songs": Song.objects.count(),
        "playlists": Playlist.objects.count(),
    }

    return Response(data)
