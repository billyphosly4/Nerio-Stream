import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getTVDetails,
    getTVSeasonDetails,
    getSimilarTV,
    getTVEpisodeEmbedUrl
} from "../Components/Apis";
import TVCard from "../Components/TVCard";
import VideoPlayer from "../Components/VideoPlayer";
import "../css/TVDetail.css";
import "../css/MovieDetail.css";

function TVDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);

    // Season / Episode state
    const [seasons, setSeasons] = useState([]);
    const [openSeason, setOpenSeason] = useState(null);      // seasonNumber currently open
    const [seasonData, setSeasonData] = useState({});         // { [seasonNum]: seasonDetails }
    const [loadingSeason, setLoadingSeason] = useState(null); // which season is being fetched

    // Player
    const [showPlayer, setShowPlayer] = useState(false);
    const [playerSrc, setPlayerSrc] = useState("");
    const [playerTitle, setPlayerTitle] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            window.scrollTo(0, 0);
            const [details, sim] = await Promise.all([
                getTVDetails(id),
                getSimilarTV(id)
            ]);
            setShow(details);
            setSimilar(sim.slice(0, 8));
            // Filter out specials (season 0) and set seasons list
            if (details?.seasons) {
                setSeasons(details.seasons.filter(s => s.season_number > 0));
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const toggleSeason = async (seasonNum) => {
        if (openSeason === seasonNum) {
            setOpenSeason(null);
            return;
        }
        setOpenSeason(seasonNum);
        // Fetch only if not cached
        if (!seasonData[seasonNum]) {
            setLoadingSeason(seasonNum);
            const data = await getTVSeasonDetails(id, seasonNum);
            setSeasonData(prev => ({ ...prev, [seasonNum]: data }));
            setLoadingSeason(null);
        }
    };

    const playEpisode = (seasonNum, ep) => {
        setPlayerSrc(getTVEpisodeEmbedUrl(id, seasonNum, ep.episode_number));
        setPlayerTitle(`${show.name} — S${String(seasonNum).padStart(2,"0")}E${String(ep.episode_number).padStart(2,"0")}: ${ep.name}`);
        setShowPlayer(true);
    };

    if (loading) {
        return (
            <div className="detail-loading">
                <div className="loader"></div>
                <p>Loading show details...</p>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="detail-error">
                <h2>Show not found</h2>
                <button onClick={() => navigate("/tv")}>← Back to TV Shows</button>
            </div>
        );
    }

    const rating = show.vote_average?.toFixed(1) ?? "N/A";
    const ratingColor =
        show.vote_average >= 7 ? "#22c55e" :
        show.vote_average >= 5 ? "#f59e0b" : "#ef4444";
    const cast = show.credits?.cast?.slice(0, 8) || [];

    return (
        <div className="movie-detail">
            {showPlayer && (
                <VideoPlayer
                    src={playerSrc}
                    title={playerTitle}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {/* Backdrop */}
            <div
                className="detail-backdrop"
                style={{
                    backgroundImage: show.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/w1280${show.backdrop_path})`
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
                                show.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                                    : "https://via.placeholder.com/500x750?text=No+Image"
                            }
                            alt={show.name}
                        />
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <h1 className="detail-title">{show.name}</h1>
                        {show.tagline && <p className="detail-tagline">"{show.tagline}"</p>}

                        <div className="detail-badges">
                            <span className="badge rating-badge" style={{ color: ratingColor }}>★ {rating}</span>
                            <span className="badge">{show.first_air_date?.split("-")[0]}</span>
                            <span className="badge">{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}</span>
                            <span className="badge">{show.number_of_episodes} Episodes</span>
                            <span className="badge" style={{ borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc", background: "rgba(99,102,241,0.1)" }}>
                                {show.status}
                            </span>
                            {show.genres?.map(g => (
                                <span className="badge genre-badge" key={g.id}>{g.name}</span>
                            ))}
                        </div>

                        <p className="detail-overview">{show.overview}</p>

                        <div className="detail-meta">
                            {show.created_by?.length > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Created By</span>
                                    <span className="meta-value">{show.created_by.map(c => c.name).join(", ")}</span>
                                </div>
                            )}
                            {show.vote_count > 0 && (
                                <div className="meta-item">
                                    <span className="meta-label">Votes</span>
                                    <span className="meta-value">{show.vote_count.toLocaleString()}</span>
                                </div>
                            )}
                            {show.episode_run_time?.[0] && (
                                <div className="meta-item">
                                    <span className="meta-label">Runtime</span>
                                    <span className="meta-value">{show.episode_run_time[0]} min/ep</span>
                                </div>
                            )}
                            {show.networks?.[0] && (
                                <div className="meta-item">
                                    <span className="meta-label">Network</span>
                                    <span className="meta-value">{show.networks[0].name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Seasons & Episodes ── */}
                <div className="seasons-section">
                    <h2 className="section-title">Seasons & Episodes</h2>
                    <div className="seasons-list">
                        {seasons.map(season => {
                            const isOpen = openSeason === season.season_number;
                            const isFetching = loadingSeason === season.season_number;
                            const eps = seasonData[season.season_number]?.episodes || [];

                            return (
                                <div
                                    key={season.season_number}
                                    className={`season-item ${isOpen ? "open" : ""}`}
                                >
                                    {/* Season Header */}
                                    <button
                                        className="season-header"
                                        onClick={() => toggleSeason(season.season_number)}
                                    >
                                        <div className="season-header-left">
                                            {season.poster_path ? (
                                                <img
                                                    className="season-thumb"
                                                    src={`https://image.tmdb.org/t/p/w92${season.poster_path}`}
                                                    alt={season.name}
                                                />
                                            ) : (
                                                <div className="season-thumb-placeholder">
                                                    S{season.season_number}
                                                </div>
                                            )}
                                            <div className="season-meta-info">
                                                <span className="season-name">{season.name}</span>
                                                <span className="season-ep-count">
                                                    {season.episode_count} episode{season.episode_count !== 1 ? "s" : ""}
                                                    {season.air_date ? ` · ${season.air_date.split("-")[0]}` : ""}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`season-chevron ${isOpen ? "up" : ""}`}>▾</span>
                                    </button>

                                    {/* Episodes */}
                                    {isOpen && (
                                        <div className="episodes-list">
                                            {isFetching ? (
                                                <div className="episodes-loading">
                                                    <div className="loader-sm"></div>
                                                    <span>Loading episodes...</span>
                                                </div>
                                            ) : eps.length === 0 ? (
                                                <p className="no-eps">No episodes available yet.</p>
                                            ) : (
                                                eps.map(ep => (
                                                    <div key={ep.id} className="episode-card">
                                                        <div className="ep-thumb-wrap">
                                                            <img
                                                                className="ep-thumb"
                                                                src={
                                                                    ep.still_path
                                                                        ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                                                                        : "https://via.placeholder.com/300x169?text=No+Preview"
                                                                }
                                                                alt={ep.name}
                                                            />
                                                            <button
                                                                className="ep-play-btn"
                                                                onClick={() => playEpisode(season.season_number, ep)}
                                                                title="Play episode"
                                                            >
                                                                ▶
                                                            </button>
                                                        </div>
                                                        <div className="ep-info">
                                                            <div className="ep-number">
                                                                E{String(ep.episode_number).padStart(2, "0")}
                                                            </div>
                                                            <div className="ep-name">{ep.name}</div>
                                                            <div className="ep-date">{ep.air_date || "TBA"}</div>
                                                            {ep.overview && (
                                                                <p className="ep-overview">{ep.overview}</p>
                                                            )}
                                                            {ep.vote_average > 0 && (
                                                                <div className="ep-rating">
                                                                    ★ {ep.vote_average.toFixed(1)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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

                {/* Similar Shows */}
                {similar.length > 0 && (
                    <div className="similar-section">
                        <h2 className="section-title">More Like This</h2>
                        <div className="movie-grid">
                            {similar.map(s => <TVCard show={s} key={s.id} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TVDetail;
