import React, { useEffect, useState, useCallback } from "react";

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
  const [playlists, setPlaylists] = useState([])    //przechowuje klikniętą listę
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)    // tworzy zmienną React

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

  const handleAddToPlaylist = (songId) => {

      if (!playlists.length) {
        alert("Brak playlist")
        return
      }

    if (!selectedPlaylist) {
      alert("Najpierw wybierz playlistę!")
      return
    }

    const playlistId = selectedPlaylist.id


    fetch(`http://localhost:8000/api/playlists/playlists/${playlistId}/add-song/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        song_id: songId
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Added:", data)
        alert("Dodano do playlisty ✅")
        fetchPlaylists()   // dzięki temu React pobiera "świeże" dane
      })
      .catch(err => console.error(err))
  }


  // umożliwia tworzenie i edycję playlists w React
  const handleCreatePlaylist = () => {
  
  // dodawania do playlisty  
  
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
      
      .then(res => {
        console.log("CREATE STATUS:", res.status)   // Obsługuje statusy HTTP (200 / 400 / 401 / 403) + odpowiedź backendu
        return res.json()
      })

      .then(data => {
        console.log("CREATED:", data)

        
        // czyścimy input
        setNewPlaylistName("")
        
        fetchPlaylists()

      })
      .catch(error => console.error("Create error:", error))
  }
    //  wysyła del do backendu, usuwa utwór z Palylist i odświeża Playlistę.
    const handleRemoveFromPlaylist = (playlistSongId) => {

      console.log("DELETE ID:", playlistSongId)

    fetch(`http://localhost:8000/api/playlists/playlist-songs/${playlistSongId}/remove/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      
    .then(res => {
      console.log("DELETE STATUS:", res.status)   // debugowanie

      if (res.status === 204) {
        return null   // brak JSON
      }

      return res.json()
    })
    .then(() => {
      alert("Usunięto z playlisty ❌")

      // odśwież dane z backendu
      fetchPlaylists()
    })
      .catch(err => console.error(err))
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

      const fetchPlaylists = useCallback(() => {

    if (!token) return;

    fetch("http://localhost:8000/api/playlists/playlists/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("PLAYLISTS:", data)

        if (Array.isArray(data)) {
          setPlaylists(data)



        } else {
          console.error("NOT ARRAY:", data)
          setPlaylists([])
        }
      })
      .catch(error => console.error("Playlist error:", error))
  }, [token])


  
  useEffect(() => {
      if (token) {
        fetchPlaylists()
      }
    }, [token, fetchPlaylists])


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
      padding:"20px",
      fontSize:"13px",
      background:"#0f172a",     // granatowo-grafitowy
      color:"#e5e7eb",          // lekko-biały
      minHeight:"100vh"
    }}>


     <h1 style={{color:"#38bdf8"}}>MusHaven 🎧</h1>


     <p style={{color:"#94a3b8", marginTop:"-10px"}}>
      Discover music. Build playlists. 🎶
     </p>

    <div style={{
      padding:"40px",
      display:"grid",     // włącza układ poziomy
      gridTemplateColumns:"280px 1fr 260px",
      gap:"30px"     // odstęp między kolumnami
    }}>

   <div>   {/* LEWA KOLUMNA */}
    <div style={{marginBottom:"30px"}}>
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
     {/* PLAYLISTY */}
     {token && (
       <div>
         <div style={{marginBottom: "10px"}}>

        <input
          type="text"
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          style={{
            padding:"8px",
            marginRight:"8px",
            borderRadius:"6px",
            border:"1px solid #334155"
          }}
        />

        <button
          onClick={handleCreatePlaylist}
          style={{
            padding:"8px 12px",
            borderRadius:"6px",
            background:"#38bdf8",
            border:"none",
            cursor:"pointer"
          }}
        >
          Create
        </button>

        </div>

        <h2>Your Playlists</h2>

        {selectedPlaylist && (
          <p style={{color:"#38bdf8"}}>
            Wybrana: {selectedPlaylist.name}    {/* pokazuje użytkownikowi, do której playlisty dodaje */}
          </p>
        )}

       <ul style={{listStyle:"none", padding:0}}>
          {Array.isArray(playlists) && playlists.map(p => (
            <li
              key={p.id}
                              

                onClick={() => setSelectedPlaylist(p)}   // zapisuje playlistę

                style={{
                  cursor:"pointer",

                  background: selectedPlaylist?.id === p.id    // sprawdza czy ta ta sama lista
                    ? "#334155"   // aktywna (kliknięta)
                    : "#1e293b",

                padding:"8px",
                marginBottom:"6px",
                borderRadius:"6px",
                border: selectedPlaylist?.id === p.id     // niebieska ramka jeśli zostaje wybrany
                  ? "2px solid #38bdf8"
                  : "1px solid #334155",

              }}
            >
             {p.name || "Unnamed playlist"}
           </li>
         ))}
       </ul>


      {selectedPlaylist && (
      <div style={{marginTop:"20px"}}>

        <h3>Playlist Songs</h3>

        <ul>
          {selectedPlaylist.songs.map(item => {

            console.log("ITEM:", item)

            return (
              <li key={item.id}>
                {item.song_title}

              <button
                onClick={() => handleRemoveFromPlaylist(item.id)}
                style={{ marginLeft: "10px" }}
              >
                ❌
              </button>

            </li>
            )
          })}
        </ul>

    
     </div>
    )}
  </div>
  
  )}  
</div>

    {/* ŚRODKOWA KOLUMNA – wyszukiwarka */}
      <div>

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
          width:"100px",
          borderRadius:"6px",
          border:"1px solid #334155"
        }}
      />

  </div>

    {searchResults.length > 0 && (

      <>
        <h3>Search Results</h3>

        <ul style={{
          maxHeight:"300px",
          overflowY:"auto",
          padding:0,
          maxWidth:"500px" 
        }}>

          {searchResults.map(result => (

            <li
              key={result.id}
              style={{
                background:"#1e293b",
                width:"100%",        
                maxWidth:"500px",    
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
  
      
       <h2>Artists</h2>

      <div
        style={{
          display: "grid",              // grid layout zamiast listy
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", // ile kart w rzędzie
          gap: "15px",                  // odstęp między kartami
          marginBottom: "30px"
        }}
      >
        {artists.map(artist => (
          <div
            key={artist.id}

            style={{
              borderRadius:"12px",
              padding:"12px",
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
                  
                  <button
                    // onClick={() => handleAddToPlaylist(song.id)}
                       onClick={() => {
                         console.log("CLICK", song.id)
                         handleAddToPlaylist(song.id)
                       }}

                    style={{ marginLeft: "10px" }}
                  >
                     ➕
                  </button>

                </li>
              ))}
          </ul>
        </>
      )}

  
      <h2>Top Songs</h2>

      <ul style={{paddingLeft:"15px"}}>
        {topSongs.map(song => (
          <li key={song.id}>
            {song.title}
          </li>
        ))}
      </ul>


      <h2>All Songs</h2>

      <ul style={{
        maxHeight:"200px",
        overflowY:"auto",

        maxWidth:"500px",   // ograniczenie szerokości
        marginLeft:"0px"
      }}>
    
        {songs.map(song => (
          <li key={song.id}>
            {song.title}
          </li>
        ))}
      </ul>
      
    </div>
    
  {/* PRAWA KOLUMNA – statystyki */}

    {stats && (
      <div
        style={{
          background:"#1e293b",
          padding:"20px",
          borderRadius:"10px",
          border:"1px solid #334155",
          height:"fit-content",   // ograniczenie w pionie
          alignSelf:"start"       
        }}
      >
        <h2>Statistics</h2>

        <p>Artists: {stats.artists}</p>
        <p>Albums: {stats.albums}</p>
        <p>Songs: {stats.songs}</p>
        <p>Playlists: {stats.playlists}</p>
      </div>
    )}
  </div>
 </div>
);
}


export default App;
