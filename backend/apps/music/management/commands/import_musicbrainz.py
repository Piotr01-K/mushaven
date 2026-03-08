from django.core.management.base import BaseCommand

import musicbrainzngs

from apps.music.models import Artist, Album, Song, Genre


class Command(BaseCommand):

    help = "Import real music data from MusicBrainz"

    def handle(self, *args, **kwargs):

        self.stdout.write("Connecting to MusicBrainz...")

        musicbrainzngs.set_useragent(
            "mushaven",
            "1.0",
            "example@email.com"
        )

        # tworzymy gatunek
        genre, _ = Genre.objects.get_or_create(
            name="Electronic"
        )

        # wyszukujemy artystów
        result = musicbrainzngs.search_artists(
            artist="electronic",
            limit=15
        )

        artists = result["artist-list"]

        for a in artists:

            name = a["name"]

            artist, created = Artist.objects.get_or_create(
                pseudonym=name,
                genre=genre
            )

            self.stdout.write(f"Artist imported: {name}")

            # pobieramy wydania (albumy)
            try:

                releases = musicbrainzngs.browse_releases(
                    artist=a["id"],
                    limit=5
                )

                for r in releases["release-list"]:

                    title = r["title"]

                    date = r.get("date", "2000-01-01")
                    # -------------------------------------
                    # NORMALIZACJA DATY
                    # -------------------------------------
                    if len(date) == 4:  # tylko rok
                        date = f"{date}-01-01"

                    elif len(date) == 7:  # rok + miesiąc
                        date = f"{date}-01"

                    album, _ = Album.objects.get_or_create(
                        title=title,
                        artist=artist,
                        release_date=date
                    )

                    self.stdout.write(f"  Album imported: {title}")


                # ------------------------------------------
                # IMPORT SONGS
                # ------------------------------------------

                try:

                    recordings = musicbrainzngs.browse_recordings(
                        release=r["id"],
                        limit=10
                    )

                    for rec in recordings["recording-list"]:

                        song_title = rec["title"]

                        duration = rec.get("length")

                        if duration:
                            duration = int(duration) // 1000
                        else:
                            duration = 180

                        Song.objects.get_or_create(
                            title=song_title,
                            album=album,
                            duration_seconds=duration
                        )

                        self.stdout.write(f"    Song imported: {song_title}")

                except Exception as e:

                    self.stdout.write(f"    Error importing songs: {e}")

            except Exception as e:

                self.stdout.write(f"Error importing albums: {e}")

        self.stdout.write(self.style.SUCCESS("Import finished"))