"""
Zadania asynchroniczne Celery.
"""

from celery import shared_task


@shared_task
def example_task():

    print("Celery task executed!")

    return "done"