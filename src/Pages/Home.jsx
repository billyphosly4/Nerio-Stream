import { useState, useEffect } from "react";
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre } from "../Components/Apis";
import MovieCard from "../Components/MovieCard";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [popularMovies, genreList] = await Promise.all([
          getPopularMovies(),
          getGenres()
        ]);
        setMovies(popularMovies);
        setGenres(genreList);
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