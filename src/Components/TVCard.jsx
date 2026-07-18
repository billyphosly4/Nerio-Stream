import "../css/MovieCard.css";
import { Link } from "react-router-dom";

function TVCard({ show }) {
    const rating = show.vote_average?.toFixed(1) ?? "N/A";
    const ratingColor =
        show.vote_average >= 7 ? "#22c55e" :
        show.vote_average >= 5 ? "#f59e0b" : "#ef4444";

    return (
        <Link to={`/tv/${show.id}`} className="movie-card-link">
            <div className="movie-card">
                <div className="movie-poster">
                    <img
                        src={
                            show.poster_path
                                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                                : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={show.name}
                        loading="lazy"
                    />
                    <div className="movie-overlay">
                        <span className="tv-badge">TV</span>
                    </div>
                    <div className="movie-rating" style={{ color: ratingColor }}>
                        <span>★ {rating}</span>
                    </div>
                </div>
                <div className="movie-info">
                    <h3>{show.name}</h3>
                    <div className="movie-meta">
                        <span className="movie-year">{show.first_air_date?.split("-")[0] || "TBA"}</span>
                        {show.vote_count > 0 && (
                            <span className="vote-count">{show.vote_count.toLocaleString()} votes</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default TVCard;
