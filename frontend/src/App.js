import React, { useEffect, useState } from "react";

function App() {

  const [topSongs, setTopSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [stats, setStats] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {

    fetch("http://localhost:8000/api/music/top-songs/")   // dlatego localhost bo React działa w przeglądarce a nie w kontenerze
      .then(res => res.json())
      .then(data => setTopSongs(data));

    fetch("http://localhost:8000/api/stats/")
      .then(res => res.json())
      .then(data => setStats(data));

    fetch("http://localhost:8000/api/music/artists/")
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(error => console.error("Error loading artists:", error));

    fetch("http://localhost:8000/api/music/songs/")
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(error => console.error("Error loading songs:", error));

    fetch("http://localhost:8000/api/music/albums/")
      .then(res => res.json())
      .then(data => setAlbums(data));

  }, []);

  return (
    <div style={{padding:"40px"}}>

      <h1>MusHaven 🎧</h1>

      {stats && (
        <>
          <h2>Statistics</h2>
          <p>Artists: {stats.artists}</p>
          <p>Albums: {stats.albums}</p>
          <p>Songs: {stats.songs}</p>
          <p>Playlists: {stats.playlists}</p>
        </>
      )}

      <h2>Top Songs</h2>

      <ul>
        {topSongs.map(song => (
          <li key={song.id}>
            {song.title}
          </li>
        ))}
      </ul>

      <h2>Artists</h2>

      <div
        style={{
          display: "grid",              // grid layout zamiast listy
          gridTemplateColumns: "repeat(auto-fill, 200px)", // ile kart w rzędzie
          gap: "15px",                  // odstęp między kartami
          marginBottom: "30px"
        }}
      >
        {artists.map(artist => (
          <div
            key={artist.id}

            style={{
              border: "1px solid #ddd",      // ramka karty
              borderRadius: "10px",          // zaokrąglone rogi
              padding: "20px",
              cursor: "pointer",
              background: "#f8f8f8",
              textAlign: "center",
              fontWeight: "bold"
            }}

            onClick={() => {
              setSelectedArtist(artist.id)   // zapisujemy klikniętego artystę
              setSelectedAlbum(null)         // resetujemy wybrany album
            }}
          >
            {artist.pseudonym}
          </div>
        ))}
      </div>

      {selectedArtist && (                // jeśli użytkownik kliknął artystę
        <>
          <h2>Albums</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 200px)",
              gap: "15px",
              marginBottom: "30px"
            }}
          >
            {albums
              .filter(album => Number(album.artist) === selectedArtist)  // tylko albumy wybranego artysty
              .map(album => (
                <div
                  key={album.id}

                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    cursor: "pointer",
                    background: "#eef6ff",
                    textAlign: "center"
                  }}

                  onClick={() => setSelectedAlbum(album.id)}  // zapisujemy wybrany album
                >
                  {album.title}
                </div>
              ))}
          </div>
        </>
      )}

      {selectedAlbum && (
        <>
          <h2>Album Songs</h2>

          <ul>
            {songs
              .filter(song => Number(song.album) === selectedAlbum)     // pokaż utory z albumu
              .map(song => (
                <li key={song.id}>
                  {song.title}
                </li>
              ))}
          </ul>
        </>
      )}


      <h2>All Songs</h2>

      <ul>
        {songs.map(song => (
          <li key={song.id}>
            {song.title}
          </li>
        ))}
      </ul>

    </div>
  );
}


export default App;
