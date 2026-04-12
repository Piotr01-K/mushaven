from django.db import models
from django.contrib.auth.models import User

# ======================================================
# MODEL: Genre
# Reprezentuje gatunek muzyczny (np. Rock, Jazz, Pop)
# ======================================================
class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# ======================================================
# MODEL: Artist
# Reprezentuje artystę muzycznego
# ======================================================
class Artist(models.Model):
    pseudonym = models.CharField(max_length=200)
    genre = models.ForeignKey(
        Genre,
        on_delete=models.CASCADE,
        related_name="artists"
    )

    avatar = models.ImageField(
        upload_to="artists/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.pseudonym


# ======================================================
# MODEL: Album
# Reprezentuje album muzyczny
# ======================================================
class Album(models.Model):
    title = models.CharField(max_length=200)

    release_date = models.DateField()

    artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name="albums"
    )

    cover = models.ImageField(
        upload_to="albums/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title


# ======================================================
# MODEL: Song
# Reprezentuje pojedynczy utwór
# ======================================================
class Song(models.Model):
    title = models.CharField(max_length=200)

    duration_seconds = models.IntegerField()

    album = models.ForeignKey(
        Album,
        on_delete=models.CASCADE,
        related_name="songs"
    )

     # ❤️ LIKE SYSTEM (ulubione utwory użytkowników)
    liked_by = models.ManyToManyField(
        User,
        related_name="liked_songs",
        blank=True
    )

    def __str__(self):
        return self.title
    

# ======================================================
# Popularność utworów
# ======================================================

class SongPopularity(models.Model):

    song = models.OneToOneField(
        "Song",
        on_delete=models.CASCADE,
        related_name="popularity"
    )

    score = models.IntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.song.title} popularity: {self.score}"