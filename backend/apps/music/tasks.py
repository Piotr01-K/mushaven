"""
Zadania asynchroniczne Celery.
"""

from celery import shared_task

from apps.music.models import Song, SongPopularity

@shared_task
def example_task():

    print("Celery task executed!")

    return "done"

@shared_task
def update_song_popularity():

    for song in Song.objects.all():

        score = song.playlistsong_set.count()

        SongPopularity.objects.update_or_create(
            song=song,
            defaults={"score": score}
        )

    return "Popularity updated"