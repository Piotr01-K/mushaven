"""
Custom permissions dla aplikacji playlists.

Tutaj tworzymy własną klasę permission,
która sprawdza czy użytkownik jest właścicielem playlisty.
"""

from rest_framework.permissions import BasePermission


class IsPlaylistOwner(BasePermission):
    """
    Permission pozwalająca edytować playlistę
    tylko jej właścicielowi.
    """

    def has_object_permission(self, request, view, obj):
        """
        obj = obiekt playlisty

        request.user = użytkownik który wysłał request

        Sprawdzamy czy creator playlisty
        jest tym samym użytkownikiem.
        """
         # jeśli to jest PlaylistSong → idziemy przez playlist
        if hasattr(obj, "playlist"):
            return obj.playlist.creator == request.user

        #  jeśli to jest Playlist
        return obj.creator == request.user