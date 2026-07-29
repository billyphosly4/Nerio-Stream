import { useState, useEffect } from "react";
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre } from "../Components/Apis";
import { getContinueWatching } from "../utils";
import MovieCard from "../Components/MovieCard";
import { Link, useSearchParams } from "react-router-dom";
import HeroCarousel from "../Components/HeroCarousel";
import "../css/Home.css";

function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
    setContinueWatching(getContinueWatching());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const results = await searchMovies(searchQuery);
          setMovies(results);
        } else if (selectedGenre) {
          const results = await getMoviesByGenre(selectedGenre);
          setMovies(results);
        } else {
          const popularMovies = await getPopularMovies();
          setMovies(popularMovies);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedGenre]);

  const handleGenreSelect = (genreId) => {
      if (selectedGenre === genreId) {
          setSelectedGenre(null);
      } else {
          setSelectedGenre(genreId);
      }
  };

  return (
    <div className="home">
      <HeroCarousel />
      


      {continueWatching.length > 0 && !searchQuery && !selectedGenre && (
          <div className="continue-watching-section" style={{ padding: '2rem 5%', background: 'rgba(99, 102, 241, 0.05)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ▶ Continue Watching
              </h2>
              <div className="continue-watching-grid hide-scroll" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                  {continueWatching.map(item => (
                      <Link to={`/tv/${item.showId}`} key={item.showId} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }} className="w-48 md:w-64">
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

      <div className="genres-section" style={{ padding: '2rem 5%', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎭 Browse by Genre
          </h2>
          <div className="flex overflow-x-auto whitespace-nowrap hide-scroll py-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', gap: '1rem' }}>
              {genres.map(genre => (
                  <button 
                      key={genre.id} 
                      className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ease-in-out shrink-0 overflow-hidden group ${
                        selectedGenre === genre.id 
                          ? 'border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105 z-10' 
                          : 'border border-slate-700/50 hover:scale-105 hover:border-indigo-400/50 hover:shadow-lg hover:z-10'
                      }`}
                      style={{ width: '150px', height: '80px', flexShrink: 0 }}
                      onClick={() => handleGenreSelect(genre.id)}
                  >
                      {/* Background */}
                      <div className={`absolute inset-0 transition-all duration-300 ${
                          selectedGenre === genre.id 
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-700 opacity-100' 
                              : 'bg-slate-800/70 group-hover:bg-slate-700/80'
                      }`}></div>
                      
                      {/* Text */}
                      <span className={`relative z-10 font-bold tracking-wide transition-all duration-300 ${
                          selectedGenre === genre.id ? 'text-white text-lg' : 'text-slate-300 group-hover:text-white text-base'
                      }`}>
                          {genre.name}
                      </span>
                  </button>
              ))}
          </div>
      </div>

      {!loading && !searchQuery && !selectedGenre && movies.length > 0 && (
          <div className="continue-watching-section" style={{ padding: '0 5%', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ✨ AI Recommended for You
              </h2>
              <div className="continue-watching-grid hide-scroll" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                  {movies.slice(0, 5).map(movie => (
                      <div key={`ai-${movie.id}`} style={{ flexShrink: 0 }} className="w-40 md:w-48 lg:w-56">
                          <MovieCard movie={movie} />
                      </div>
                  ))}
              </div>
          </div>
      )}

      {loading ? (
        <div className="loading-container px-4 py-6">
            <div className="loader"></div>
            <p>Loading movies...</p>
        </div>
      ) : (
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.length > 0 ? movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            )) : (
              <div className="col-span-full text-center text-slate-400 py-10">No movies found. Try a different search.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;