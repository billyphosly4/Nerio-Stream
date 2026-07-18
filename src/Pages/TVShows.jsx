import { useState, useEffect } from "react";
import { getTVShows, searchTV, getTVGenres, getTVByGenre } from "../Components/Apis";
import TVCard from "../Components/TVCard";
import "../css/Home.css";

function TVShows() {
    const [shows, setShows] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            const [popularShows, genreList] = await Promise.all([
                getTVShows(),
                getTVGenres()
            ]);
            setShows(popularShows);
            setGenres(genreList);
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

    return (
        <div className="home">
            <div className="hero-section">
                <h1 className="hero-title">📺 TV Shows & Series</h1>
                <p className="hero-subtitle">Binge-watch the most popular series, season by season, episode by episode.</p>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search TV shows..."
                        className="search-input"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>

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
