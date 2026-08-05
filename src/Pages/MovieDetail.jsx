import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getSimilarMovies } from "../Components/Apis";
import { useMovieContext } from "../Contexts/MovieContexts";
import MovieCard from "../Components/MovieCard";
import VideoPlayer, { getMovieAllSources } from "../Components/VideoPlayer";
import "../css/MovieDetail.css";

const STORAGE_KEY = "nerio_downloads";

const getStoredDownloads = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
};

const saveStoredDownloads = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const queueMovieDownload = (movie) => {
    const current = getStoredDownloads();
    const item = {
        id: `movie-${movie.id}-${Date.now()}`,
        title: movie.title,
        type: "movie",
        quality: "1080p",
        size: "1.8 GB",
        sizeBytes: 1800000000,
        duration: `${movie.runtime || 120} min`,
        timestamp: new Date().toISOString(),
        downloadedAt: new Date().toISOString(),
        status: "downloading",
        progress: 0,
        thumbnail: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "",
        downloadUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    };

    saveStoredDownloads([item, ...current]);
    return item;
};

const triggerMediaDownload = async (title, mediaUrl) => {
    try {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.mp4`;
        anchor.rel = "noopener";
        anchor.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed:", error);
        alert("This file cannot be downloaded directly from the current source URL.");
    }
};

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const [movie, setMovie] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trailerKey, setTrailerKey] = useState(null);
    const [showPlayer, setShowPlayer] = useState(false);
    const [playerSrc, setPlayerSrc] = useState("");
    const [playerTitle, setPlayerTitle] = useState("");

    const favorite = movie ? isFavorite(movie.id) : false;

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            window.scrollTo(0, 0);
            const [details, similarMovies] = await Promise.all([
                getMovieDetails(id),
                getSimilarMovies(id)
            ]);
            setMovie(details);
            setSimilar(similarMovies.slice(0, 8));
            if (details?.videos?.results) {
                const trailer = details.videos.results.find(
                    v => v.type === "Trailer" && v.site === "YouTube"
                );
                setTrailerKey(trailer?.key || null);
            }
            setLoading(false);
        };
        loadDetails();
    }, [id]);

    const openMovie = () => {
        setPlayerSrc(getMovieAllSources(id)[0]);
        setPlayerTitle(movie?.title || "Movie");
        setShowPlayer(true);
    };

    const openTrailer = () => {
        if (!trailerKey) return;
        setPlayerSrc(`https://www.youtube.com/embed/${trailerKey}?autoplay=1`);
        setPlayerTitle(`${movie?.title} — Trailer`);
        setShowPlayer(true);
    };

    const downloadMovie = async () => {
        if (!movie) return;
        const queued = queueMovieDownload(movie);
        await triggerMediaDownload(movie.title, queued.downloadUrl);
    };

    if (loading) {
        return (
            <div className="detail-loading">
                <div className="loader"></div>
                <p>Loading movie details...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="detail-error">
                <h2>Movie not found</h2>
                <button onClick={() => navigate("/")}>← Back to Home</button>
            </div>
        );
    }

    const rating = movie.vote_average?.toFixed(1) ?? "N/A";
    const ratingColor =
        movie.vote_average >= 7 ? "#22c55e" :
        movie.vote_average >= 5 ? "#f59e0b" : "#ef4444";

    const directors = movie.credits?.crew?.filter(c => c.job === "Director") || [];
    const cast = movie.credits?.cast?.slice(0, 8) || [];
    const runtime = movie.runtime
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : "N/A";

    return (
        <div className="movie-detail">
            {/* Video Player Modal */}
            {showPlayer && (
                <VideoPlayer
                    src={playerSrc}
                    allSources={playerTitle.includes("Trailer") ? [playerSrc] : getMovieAllSources(id)}
                    title={playerTitle}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {/* Hero Backdrop */}
            <div
                className="detail-backdrop"
                style={{
                    backgroundImage: movie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
                        : "none"
                }}
            >
                <div className="backdrop-overlay" />
            </div>

            <div className="detail-content">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

                <div className="detail-main">
                    {/* Poster */}
                    <div className="detail-poster">
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://via.placeholder.com/500x750?text=No+Image"
                            }
                            alt={movie.title}
                        />
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <h1 className="detail-title">{movie.title}</h1>
                        {movie.tagline && (
                            <p className="detail-tagline">"{movie.tagline}"</p>
                        )}

                        <div className="detail-badges">
                            <span className="badge rating-badge" style={{ color: ratingColor }}>
                                ★ {rating}
                            </span>
                            <span className="badge">{movie.release_date?.split("-")[0]}</span>
                            <span className="badge">{runtime}</span>
                            {movie.genres?.map(g => (
                                <span className="badge genre-badge" key={g.id}>{g.name}</span>
                            ))}
                        </div>

                        <p className="detail-overview">{movie.overview}</p>

                        <div className="detail-meta">
                            {directors.length > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Director</span>
                                    <span className="meta-value">{directors.map(d => d.name).join(", ")}</span>
                                </div>
                            )}
                            {movie.vote_count > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Votes</span>
                                    <span className="meta-value">{movie.vote_count.toLocaleString()}</span>
                                </div>
                            )}
                            {movie.budget > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Budget</span>
                                    <span className="meta-value">${(movie.budget / 1e6).toFixed(1)}M</span>
                                </div>
                            )}
                            {movie.revenue > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Revenue</span>
                                    <span className="meta-value">${(movie.revenue / 1e6).toFixed(1)}M</span>
                                </div>
                            )}
                        </div>

                        <div className="detail-actions">
                            {/* Primary: Watch Now */}
                            <button className="watch-now-btn" onClick={openMovie}>
                                ▶ Watch Now
                            </button>
                            {/* Trailer */}
                            {trailerKey && (
                                <button className="trailer-btn" onClick={openTrailer}>
                                    🎬 Trailer
                                </button>
                            )}
                            <button className="trailer-btn" onClick={downloadMovie}>
                                ⬇ Download
                            </button>
                            {/* Favourite */}
                            <button
                                className={`fav-action-btn ${favorite ? "active" : ""}`}
                                onClick={() => favorite ? removeFromFavorites(movie.id) : addToFavorites(movie)}
                            >
                                {favorite ? "❤️" : "🤍"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cast */}
                {cast.length > 0 && (
                    <div className="cast-section">
                        <h2 className="section-title">Top Cast</h2>
                        <div className="cast-grid">
                            {cast.map(actor => (
                                <div className="cast-card" key={actor.id}>
                                    <img
                                        src={
                                            actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                : "https://via.placeholder.com/185x278?text=N/A"
                                        }
                                        alt={actor.name}
                                    />
                                    <p className="cast-name">{actor.name}</p>
                                    <p className="cast-char">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similar Movies */}
                {similar.length > 0 && (
                    <div className="similar-section px-6 md:px-8 py-6">
                        <h2 className="section-title">More Like This</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {similar.map(m => <MovieCard movie={m} key={m.id} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetail;
