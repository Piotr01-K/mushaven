from django.db import models
from django.contrib.auth.models import User
from apps.music.models import Song


# ======================================================
# MODEL: Playlist
# reprezentuje playlistę stworzoną przez użytkownika
# ======================================================
class Playlist(models.Model):

    name = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="playlists"
    )

    songs = models.ManyToManyField(
        Song,
        through="PlaylistSong"
    )

    def __str__(self):
        return self.name


# ======================================================
# MODEL: PlaylistSong
# tabela pośrednia między Playlist i Song
# przechowuje kolejność utworów
# ======================================================
class PlaylistSong(models.Model):

    playlist = models.ForeignKey(
        Playlist,
        on_delete=models.CASCADE
    )

    song = models.ForeignKey(
        Song,
        on_delete=models.CASCADE
    )

    order = models.PositiveIntegerField()

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:

        unique_together = ("playlist", "song")

        ordering = ["order"]

    def __str__(self):
        return f"{self.playlist.name} - {self.song.title}"