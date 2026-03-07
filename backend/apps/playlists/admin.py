from django.contrib import admin
from .models import Playlist, PlaylistSong


# ======================================================
# INLINE ADMIN
# pozwala dodawać piosenki bezpośrednio w playliście
# ======================================================
class PlaylistSongInline(admin.TabularInline):

    model = PlaylistSong

    extra = 1


# ======================================================
# ADMIN PLAYLISTY
# ======================================================
@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):

    list_display = ("id", "name", "creator")

    search_fields = ("name",)

    inlines = [PlaylistSongInline]


# ======================================================
# ADMIN PLAYLISTSONG
# ======================================================
@admin.register(PlaylistSong)
class PlaylistSongAdmin(admin.ModelAdmin):

    list_display = ("playlist", "song", "order", "added_at")

    list_filter = ("playlist",)