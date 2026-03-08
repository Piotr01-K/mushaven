"""
Management command do importu artystów z MusicBrainz API.

Uruchomienie:
python manage.py import_artists
"""

import requests

from django.core.management.base import BaseCommand

from apps.music.models import Artist, Genre


class Command(BaseCommand):

    help = "Import artists from MusicBrainz API"

    def handle(self, *args, **kwargs):

        url = "https://musicbrainz.org/ws/2/artist"

        params = {
            "query": "rock",
            "fmt": "json",
            "limit": 10
        }

        response = requests.get(url, params=params)

        data = response.json()

        genre, _ = Genre.objects.get_or_create(name="Rock")

        for artist_data in data["artists"]:

            name = artist_data["name"]

            Artist.objects.get_or_create(
                pseudonym=name,
                genre=genre
            )

            self.stdout.write(self.style.SUCCESS(f"Imported {name}"))