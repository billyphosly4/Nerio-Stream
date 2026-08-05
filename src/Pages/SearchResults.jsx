import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../Components/Apis";
import MovieCard from "../Components/MovieCard";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runSearch = async () => {
      setLoading(true);
      const results = await searchMovies(query);
      setMovies(results);
      setLoading(false);
    };

    runSearch();
  }, [query]);

  return (
    <div className="home px-6 md:px-8 py-6">
      <div className="hero-section" style={{ paddingBottom: "2rem" }}>
        <h1 className="hero-title">🔎 Search Results</h1>
        <p className="hero-subtitle">
          {query ? `Showing results for "${query}"` : "Enter a search term to find movies."}
        </p>
      </div>

      {loading ? (
        <div className="loading-container px-4 py-6">
          <div className="loader"></div>
          <p>Loading search results...</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="px-0 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-0 py-6 text-center text-slate-400">
          <p>No movies found for "{query}".</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
