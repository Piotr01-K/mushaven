"""
Konfiguracja Celery dla projektu MusHaven.
"""

import os

from celery import Celery


# ustawienie modułu settings Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")


app = Celery("mushaven")


# Celery czyta ustawienia z Django settings.py
app.config_from_object("django.conf:settings", namespace="CELERY")


# automatyczne znajdowanie tasks.py w aplikacjach
app.autodiscover_tasks()