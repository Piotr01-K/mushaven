# 🎧 MusHaven

MusHaven is a full-stack music platform built with **Django REST Framework** and **React**.

The application allows users to browse music data (artists, albums, songs), search content dynamically, and manage playlists.

This project is developed as part of learning modern backend + frontend + DevOps stack.

---

# Features

## 🎼 Music browsing
- list of artists
- list of albums
- list of songs
- relational structure:
  - Artist → Album → Song

## Search
- dynamic search for:
  - artists
  - albums
  - songs
- real-time API queries
- clicking a result:
  - selects artist
  - displays albums
  - allows navigation to songs

## Interactive navigation
- click artist → shows albums
- click album → shows songs
- frontend filtering (no page reload)

## Statistics panel
- number of:
  - artists
  - albums
  - songs
  - playlists

## Playlists
- create playlists (authenticated users)
- ManyToMany relation: Playlist ↔ Song
- intermediate model: `PlaylistSong`

## Authentication
- JWT authentication (Djoser + SimpleJWT)
- login from frontend
- token stored in localStorage

## Features (updated)

- User authentication (JWT)
- Playlist management (create, add/remove songs)
- Top songs ranking (based on likes)
- Like / Unlike system
- Genre filtering
- Search functionality
- REST API with Django DRF
- React frontend with dynamic updates

---

# Tech Stack

## Backend
- Python
- Django
- Django REST Framework
- Djoser + JWT authentication
- Celery (async tasks)
- Redis (Celery broker)

## Frontend
- React (Create React App)
- Fetch API
- useState / useEffect
- dynamic UI rendering

## Database
- SQLite (current)
- ready for PostgreSQL

## DevOps
- Docker
- Docker Compose

## API Docs
- drf-spectacular
- Swagger UI

---

## Architecture:

Project consists of two main parts:

- Backend (Django REST API)
- Frontend (React)

# Communication:
React → HTTP (fetch) → Django REST API → Database

# Project Structure:

mushaven/
│
├── backend/
│ ├── apps/
│ │ ├── music/
│ │ ├── playlists/
│ │ ├── accounts/
│ │ └── core/
│ │
│ ├── config/
│ └── manage.py
│
├── frontend/
│ ├── src/
│ │ └── App.js
│
├── docker-compose.yml
└── README.md

# API (example endpoints):

/api/music/artists/
/api/music/albums/
/api/music/songs/
/api/music/top-songs/
/api/music/search/?q=...
/api/playlists/
/api/stats/
/api/genres/


# API documentation:
http://localhost:8000/api/docs/


# Run the project:

Docker (recommended)
```bash
docker compose up --build


Frontend:
http://localhost:3000

Backend:
http://127.0.0.1:8000/api/docs/



# Local setup:

Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver

Frontend
cd frontend
npm install
npm start


# Data:

Project uses:

test data (seed / Faker - earlier)
prepared structure for external data sources (e.g. MusicBrainz)
Async (Celery)

Configured:

Celery
Redis

Prepared for:

background tasks
async processing
Frontend (UI)
dark theme UI
grid-based layout (3 columns)
interactive navigation:
artist → albums → songs
scrollable panels
dynamic rendering
hover effects

# Project Status:

- working backend API
- working React frontend
- search functionality
- JWT authentication
- playlists
- Docker setup
- improved UI layout

Still in progress:

UI/UX improvements
better state management
feature expansion

# Roadmap:
music recommendations
popularity ranking

album covers
UI upgrade (Tailwind / MUI)
PostgreSQL migration
deployment (render.com/ AWS / Docker)

Author:

Piotr Kaźmierczuk

Project created as part of learning:
Django + DRF + React + Docker