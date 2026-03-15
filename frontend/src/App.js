import React, { useEffect, useState } from "react";

function App() {

  const [topSongs, setTopSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [stats, setStats] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");      // przechowuje tekst wpisany w wyszukiwarkę
  const [searchResults, setSearchResults] = useState([]);    // przechowuje wyniki wyszukiwania z API

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

    // funkcja wywoływana gdy klikniemy przycisk SEARCH
    const handleSearch = () => {

    // jeśli pole jest puste – nie wysyłamy zapytania
    if (!searchQuery.trim()) return;

    // wysyłamy request do backendu
    fetch(`http://localhost:8000/api/music/search/?q=${searchQuery}`)
      .then(res => res.json())
      .then(data => {

         // łączymy wszystkie wyniki w jedną listę
         const combinedResults = [
           ...data.artists,
           ...data.albums,
           ...data.songs
         ];

         // zapisujemy wyniki w stanie React
          setSearchResults(combinedResults);

      })
      .catch(error => console.error("Search error:", error));
   };

  return (
    <div style={{padding:"40px"}}>

      <h1>MusHaven 🎧</h1>

      <h2>Search</h2>

    <div style={{marginBottom:"30px"}}>

      {/* pole wpisywania tekstu */}
      <input
        type="text"
        placeholder="Search artists, albums, songs..."

        value={searchQuery}

        // zapisujemy tekst wpisany przez użytkownika
        onChange={(e) => setSearchQuery(e.target.value)}

        style={{
          padding:"10px",
          width:"250px",
          marginRight:"10px"
        }}
      />

      {/* przycisk uruchamia wyszukiwanie */}
      <button
        onClick={handleSearch}

        style={{
          padding:"10px 20px",
          cursor:"pointer"
        }}
      >
        Search
      </button>

    </div>


    {searchResults.length > 0 && (

      <>
        <h3>Search Results</h3>

        <ul>
          {searchResults.map(result => (

            <li key={result.id}>
              {result.title || result.pseudonym}      {/* result.title → dla piosenek i albumów */}
                                                       {/* result.pseudonym → dla artystów */} 
            </li>                                     

          ))}
        </ul>

      </>

    )}


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
