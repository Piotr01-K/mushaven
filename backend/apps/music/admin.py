# ======================================================
# ADMIN PANEL DJANGO
# Ten plik mówi Django jakie modele mają być
# widoczne w panelu administratora
# ======================================================

from django.contrib import admin
from .models import Genre, Artist, Album, Song


# Rejestracja modelu Genre w panelu admin
@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):

    # pola widoczne w tabeli
    list_display = ("id", "name")

    # możliwość wyszukiwania
    search_fields = ("name",)


# Rejestracja modelu Artist
@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):

    list_display = ("id", "pseudonym", "genre")

    search_fields = ("pseudonym",)

    list_filter = ("genre",)


# Rejestracja modelu Album
@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):

    list_display = ("id", "title", "artist", "release_date")

    search_fields = ("title",)

    list_filter = ("release_date", "artist")


# Rejestracja modelu Song
@admin.register(Song)
class SongAdmin(admin.ModelAdmin):

    list_display = ("id", "title", "album", "duration_seconds")

    search_fields = ("title",)

    list_filter = ("album",)
