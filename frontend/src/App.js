import React, { useEffect, useState } from "react";

function App() {

  const [songs, setSongs] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/music/top-songs/")
      .then(res => res.json())
      .then(data => setSongs(data));

    fetch("http://127.0.0.1:8000/api/stats/")
      .then(res => res.json())
      .then(data => setStats(data));

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
