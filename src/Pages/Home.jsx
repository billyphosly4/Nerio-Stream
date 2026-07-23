import { useState, useEffect } from "react";
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre } from "../Components/Apis";
import { getContinueWatching } from "../utils";
import MovieCard from "../Components/MovieCard";
import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [popularMovies, genreList] = await Promise.all([
          getPopularMovies(),
          getGenres()
        ]);
        setMovies(popularMovies);
        setGenres(genreList);
        setContinueWatching(getContinueWatching());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSelectedGenre(null);
    if (!searchQuery.trim()) {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
        return;
    }
    setLoading(true);
    const results = await searchMovies(searchQuery);
    setMovies(results);
    setLoading(false);
  };

  const handleGenreSelect = async (genreId) => {
      if (selectedGenre === genreId) {
          setSelectedGenre(null);
          setLoading(true);
          const popularMovies = await getPopularMovies();
          setMovies(popularMovies);
          setLoading(false);
          return;
      }
      setSelectedGenre(genreId);
      setSearchQuery("");
      setLoading(true);
      const results = await getMoviesByGenre(genreId);
      setMovies(results);
      setLoading(false);
  };

  return (
    <div className="home">
      <div className="hero-section">
          <h1 className="hero-title">Discover Your Next Favorite Movie</h1>
          <p className="hero-subtitle">Explore millions of movies. Dive into curated collections and personalized recommendations.</p>
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search for movies..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                  className={`genre-pill ${selectedGenre === genre.id ? 'active' : ''}`}
                  onClick={() => handleGenreSelect(genre.id)}
              >
                  {genre.name}
              </button>
          ))}
      </div>

      {loading ? (
        <div className="loading-container">
            <div className="loader"></div>
            <p>Loading movies...</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.length > 0 ? movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          )) : (
            <div className="no-results">No movies found. Try a different search.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;