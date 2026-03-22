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
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [newPlaylistName, setNewPlaylistName] = useState("")

  const handleLogin = () => {

    fetch("http://localhost:8000/auth/jwt/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("LOGIN RESPONSE:", data)

        // zapisujemy token
        setToken(data.access)

        // opcjonalnie zapis do localStorage
        localStorage.setItem("token", data.access)
      })
      .catch(error => console.error("Login error:", error))
  }

  // umożliwia tworzenie i edycję playlists w React
  const handleCreatePlaylist = () => {
    // blokada pustych nazw
    if (!newPlaylistName.trim()) {
      alert("Podaj nazwę playlisty!")
      return
    }

    fetch("http://localhost:8000/api/playlists/playlists/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newPlaylistName
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("CREATED:", data)

        // dodajemy nową playlistę do listy
        setPlaylists(prev => [...prev, data])

        // czyścimy input
        setNewPlaylistName("")
      })
      .catch(error => console.error("Create error:", error))
  }

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

  useEffect(() => {

    if (!token) return;  // 🔥 kluczowe

    fetch("http://localhost:8000/api/playlists/playlists/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("PLAYLISTS:", data)
        // zabezpieczenie przed wyrzuceniem błędu przy załadowaniu React
        if (Array.isArray(data)) {
          setPlaylists(data)   // zapisuje playlisty w React
        } else {
          console.error("NOT ARRAY:", data)
          setPlaylists([])   // reset żeby nie crashowało
        }
     })
      .catch(error => console.error("Playlist error:", error))

  }, [token]);   // 🔥 reaguje na zmianę tokena

    // funkcja wywoływana gdy klikniemy przycisk SEARCH
    //const handleSearch = () => {

    // jeśli pole jest puste – nie wysyłamy zapytania
    //if (!searchQuery.trim()) return;

    // wysyłamy request do backendu
    //fetch(`http://localhost:8000/api/music/search/?q=${searchQuery}`)
    //  .then(res => res.json())
    //  .then(data => {

         // łączymy wszystkie wyniki w jedną listę
    //     const combinedResults = [
    //       ...data.artists,
    //       ...data.albums,
    //       ...data.songs
    //     ];

         // zapisujemy wyniki w stanie React
    //      setSearchResults(combinedResults);

    //  })
    //  .catch(error => console.error("Search error:", error));
    //};


    // LIVE SEARCH – uruchamia wyszukiwanie gdy zmienia się tekst - przycisk wyszukiwania nie jest potrzebny!
    useEffect(() => {

      // nie wysyłamy requestów dla pustego pola
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      // wysyłamy zapytanie do API
      fetch(`http://localhost:8000/api/music/search/?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => {

          // łączymy wyniki z backendu w jedną listę
          const combinedResults = [
            ...data.artists,
            ...data.albums,
            ...data.songs
          ];

          setSearchResults(combinedResults);

        })
        .catch(error => console.error("Search error:", error));

    }, [searchQuery]);   // uruchamia się gdy zmieni się searchQuery

    useEffect(() => {
      const savedToken = localStorage.getItem("token")
      if (savedToken) {
        setToken(savedToken)
      }
    }, [])

  return (
   <div style={{
      padding:"40px",
      background:"#0f172a",     // granatowo-grafitowy
      color:"#e5e7eb",          // lekko-biały
      minHeight:"100vh"
    }}>

      <h1 style={{color:"#38bdf8"}}>MusHaven 🎧</h1>

    <div style={{
      padding:"40px",
      display:"flex",        // włącza układ poziomy
      gap:"40px",            // odstęp między kolumnami
      alignItems:"flex-start"
    }}>

   <div style={{marginBottom: "30px"}}>

    <h2>Login</h2>

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>
      Login
    </button>

    {token && <p style={{color:"lightgreen"}}>Logged in ✅</p>}
  
  </div>

     {token && (
     <div>
       <div style={{marginBottom: "10px"}}>

    <input
      type="text"
      placeholder="New playlist name"
      value={newPlaylistName}
      onChange={(e) => setNewPlaylistName(e.target.value)}
    />

    <button onClick={handleCreatePlaylist}>
      Create
    </button>

  </div>

       <h2>Your Playlists</h2>

       <ul>
         {Array.isArray(playlists) && playlists.map(p => (
           <li key={p.id}>
             {JSON.stringify(p)}
           </li>
         ))}
       </ul>

     </div>
   )}

      {/* LEWA KOLUMNA – wyszukiwarka */}
      <div style={{width:"350px"}}>

      <h2 style={{color:"#38bdf8"}}>Search</h2>

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

  </div>

    {searchResults.length > 0 && (

      <>
        <h3>Search Results</h3>

        <ul>
          {searchResults.map(result => (

            <li
              key={result.id}
              style={{
                background:"#1e293b",
                padding:"8px",
                marginBottom:"6px",
                borderRadius:"6px",
                border:"1px solid #334155",
                cursor:"pointer"
              }}

              onClick={() => {

                // jeśli to ARTYSTA
                if (result.pseudonym) {
                  setSelectedArtist(result.id)
                  setSelectedAlbum(null)
                }

                // jeśli to ALBUM
                if (result.title && result.artist) {
                  setSelectedArtist(result.artist)
                  setSelectedAlbum(result.id)
                }

              }}
            >
              {result.title || result.pseudonym}      {/* result.title → dla piosenek i albumów */}
                                                       {/* result.pseudonym → dla artystów */} 
            </li>                                     

          ))}
        </ul>

      </>

    )}

  </div>

  {/* PRAWA KOLUMNA – reszta aplikacji */}
  <div style={{flex:1}}>

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
              borderRadius:"12px",
              padding:"20px",
              cursor:"pointer",

              // kluczowy fragment
              background: Number(selectedArtist) === artist.id
                ? "#334155"   // aktywny
                : "#1e293b",  // normalny

              border: Number(selectedArtist) === artist.id
                ? "2px solid #38bdf8"
                : "1px solid #334155",

              textAlign:"center",
              fontWeight:"bold",
              transition:"0.2s",
              boxShadow:"0 4px 12px rgba(0,0,0,0.3)"
            }}

            onClick={() => {
              setSelectedArtist(artist.id)   // zapisujemy klikniętego artystę
              setSelectedAlbum(null)         // resetujemy wybrany album
            }}

            onMouseEnter={(e) => {
              e.currentTarget.style.transform="scale(1.04)"         // dodaję Hover efekt
              // tylko jeśli NIE aktywny
              if (Number(selectedArtist) !== artist.id) {
               e.currentTarget.style.background="#334155"          // (po najechaniu myszką karta powiększa się i zmienia kolor) 
              }
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.transform="scale(1)"           // dodaję Hover efekt
              if (Number(selectedArtist) !== artist.id) {
               e.currentTarget.style.background="#1e293b"         // (po najechaniu myszką karta powiększa się i zmienia kolor) 
              }
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
              .map(album => {
                return (
                <div
                  key={album.id}

                  style={{
                    
                    borderRadius:"10px",
                    padding:"20px",
                    cursor:"pointer",

                    // Active logic
                    background: Number(selectedAlbum) === album.id
                      ? "#334155"
                      : "#2b2b2b",

                    border: Number(selectedAlbum) === album.id
                      ? "2px solid #38bdf8"
                      : "1px solid #333",

                    color:"#fff",
                    textAlign:"center",
                    transition:"0.2s"
                  }}

                  onClick={() => setSelectedAlbum(album.id)}  // zapisujemy wybrany album
                >
                  {album.title}
                </div>
                )
              })
            }
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
   </div>
 </div>
  );
}


export default App;
