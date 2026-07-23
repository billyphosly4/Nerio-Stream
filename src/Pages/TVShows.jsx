import { useState, useEffect } from "react";
import { getTVShows, searchTV, getTVGenres, getTVByGenre } from "../Components/Apis";
import { getContinueWatching } from "../utils";
import TVCard from "../Components/TVCard";
import { Link } from "react-router-dom";
import "../css/Home.css";

function TVShows() {
    const [shows, setShows] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [continueWatching, setContinueWatching] = useState([]);

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            const [popularShows, genreList] = await Promise.all([
                getTVShows(),
                getTVGenres()
            ]);
            setShows(popularShows);
            setGenres(genreList);
            setContinueWatching(getContinueWatching());
            setLoading(false);
        };
        loadInitial();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSelectedGenre(null);
        setLoading(true);
        if (!searchQuery.trim()) {
            const data = await getTVShows();
            setShows(data);
        } else {
            const data = await searchTV(searchQuery);
            setShows(data);
        }
        setLoading(false);
    };

    const handleGenreSelect = async (genreId) => {
        if (selectedGenre === genreId) {
            setSelectedGenre(null);
            setLoading(true);
            const data = await getTVShows();
            setShows(data);
            setLoading(false);
            return;
        }
        setSelectedGenre(genreId);
        setSearchQuery("");
        setLoading(true);
        const data = await getTVByGenre(genreId);
        setShows(data);
        setLoading(false);
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice search is not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setSelectedGenre(null);
            setLoading(true);
            searchTV(transcript).then(results => {
                setShows(results);
                setLoading(false);
            });
        };
        recognition.start();
    };

    return (
        <div className="home">
            <div className="hero-section">
                <h1 className="hero-title">📺 TV Shows & Series</h1>
                <p className="hero-subtitle">Binge-watch the most popular series, season by season, episode by episode.</p>
                <form onSubmit={handleSearch} className="search-form" style={{ position: 'relative', display: 'flex' }}>
                    <input
                        type="text"
                        placeholder="Search TV shows..."
                        className="search-input"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ flex: 1, paddingRight: '40px' }}
                    />
                    <button type="button" onClick={handleVoiceSearch} style={{ position: 'absolute', right: '110px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Voice Search">🎤</button>
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>

            {continueWatching.length > 0 && !searchQuery && !selectedGenre && (
                <div className="continue-watching-section" style={{ padding: '2rem 5%', background: 'rgba(99, 102, 241, 0.05)', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ▶ Continue Watching
                    </h2>
                    <div className="continue-watching-grid" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        {continueWatching.map(item => (
                            <Link to={`/tv/${item.showId}`} key={item.showId} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, width: '250px' }}>
                                <div className="cw-card" style={{ background: '#1e1e2f', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                                        <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.showName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#333' }}>
                                            <div style={{ width: '65%', height: '100%', background: '#6366f1' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem' }}>
                                        <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.showName}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>S{item.seasonNum} E{item.episodeNum} • {item.episodeName}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="genres-container">
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        className={`genre-pill ${selectedGenre === genre.id ? "active" : ""}`}
                        onClick={() => handleGenreSelect(genre.id)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading shows...</p>
                </div>
            ) : (
                <div className="movie-grid">
                    {shows.length > 0 ? shows.map(show => (
                        <TVCard show={show} key={show.id} />
                    )) : (
                        <div className="no-results">No shows found. Try a different search.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TVShows;
