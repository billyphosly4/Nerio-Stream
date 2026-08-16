import "../css/MovieCard.css";
import { useMovieContext } from "../Contexts/MovieContexts";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);

    function onFavoriteClick(e) {
        e.preventDefault();
        if (favorite) removeFromFavorites(movie.id);
        else addToFavorites(movie);
    }

    const rating = movie.vote_average?.toFixed(1) ?? "N/A";
    const ratingColor =
        movie.vote_average >= 7 ? "#22c55e" :
        movie.vote_average >= 5 ? "#f59e0b" :
        "#ef4444";

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card-link">
            <div className="movie-card overflow-hidden rounded-xl">
                <div className="movie-poster">
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={movie.title}
                        loading="lazy"
                    />
                    <div className="movie-overlay">
                        <button
                            className={`favourite-btn ${favorite ? "active" : ""}`}
                            onClick={onFavoriteClick}
                            title={favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {favorite ? "❤️" : "🤍"}
                        </button>
                    </div>
                    <div className="movie-rating" style={{ color: ratingColor }}>
                        <span>★ {rating}</span>
                    </div>
                </div>
                <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                        <span className="movie-year">{movie.release_date?.split("-")[0] || "TBA"}</span>
                        {movie.vote_count > 0 && (
                            <span className="vote-count">{movie.vote_count.toLocaleString()} votes</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;