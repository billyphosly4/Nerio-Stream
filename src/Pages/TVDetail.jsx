import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getTVDetails,
    getTVSeasonDetails,
    getSimilarTV,
    getTVEpisodeEmbedUrl
} from "../Components/Apis";
import { saveContinueWatching, getWatchedEpisodes, markEpisodeWatched } from "../utils";
import TVCard from "../Components/TVCard";
import VideoPlayer, { getTVAllSources } from "../Components/VideoPlayer";
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
    const [currentPlayingEp, setCurrentPlayingEp] = useState(null); // { seasonNum, ep }

    // Features
    const [hoveredEpisode, setHoveredEpisode] = useState(null);
    const [hoverTimer, setHoverTimer] = useState(null);
    const [watchedEpisodes, setWatchedEpisodes] = useState([]);
    const [subscribed, setSubscribed] = useState(false);

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
        setWatchedEpisodes(getWatchedEpisodes(id));
    }, [id]);

    const handleMouseEnter = (epId) => {
        const timer = setTimeout(() => {
            setHoveredEpisode(epId);
        }, 1000); // Auto-play preview after 1s linger
        setHoverTimer(timer);
    };

    const handleMouseLeave = () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        setHoveredEpisode(null);
    };

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
        const label = `${show.name} — S${String(seasonNum).padStart(2,"0")}E${String(ep.episode_number).padStart(2,"0")}: ${ep.name}`;
        setPlayerSrc(getTVAllSources(id, seasonNum, ep.episode_number)[0]);
        setPlayerTitle(label);
        setCurrentPlayingEp({ seasonNum, ep });
        setShowPlayer(true);
        
        // Mark previous as watched
        markEpisodeWatched(id, seasonNum, ep.episode_number);
        setWatchedEpisodes(getWatchedEpisodes(id));

        // Save progress mock
        saveContinueWatching({
            showId: id,
            showName: show.name,
            posterPath: show.poster_path,
            seasonNum,
            episodeNum: ep.episode_number,
            episodeName: ep.name,
            timestamp: 0 // real tracking not implemented yet
        });
    };

    const handleNextEpisode = () => {
        if (!currentPlayingEp) return;
        const { seasonNum, ep } = currentPlayingEp;
        const currentSeasonData = seasonData[seasonNum];
        if (!currentSeasonData) return;
        
        const eps = currentSeasonData.episodes;
        const currentIndex = eps.findIndex(e => e.id === ep.id);
        
        if (currentIndex < eps.length - 1) {
            // Next episode in same season
            playEpisode(seasonNum, eps[currentIndex + 1]);
        } else {
            // Might need to switch season, mock handling
            alert("End of season! Open next season to continue.");
            setShowPlayer(false);
        }
    };

    const toggleSubscribe = () => {
        setSubscribed(!subscribed);
        alert(subscribed ? "Unsubscribed from notifications." : "You will now be notified when new episodes air!");
    };

    const downloadEpisode = (e, epName) => {
        e.stopPropagation();
        alert(`Downloading "${epName}" for offline viewing...`);
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
                    allSources={getTVAllSources(
                        id,
                        playerTitle.match(/S(\d+)/)?.[1],
                        playerTitle.match(/E(\d+)/)?.[1]
                    )}
                    title={playerTitle}
                    onClose={() => setShowPlayer(false)}
                    onNextEpisode={handleNextEpisode}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h1 className="detail-title">{show.name}</h1>
                            <button className={`btn-subscribe ${subscribed ? 'active' : ''}`} onClick={toggleSubscribe}>
                                {subscribed ? "🔕 Subscribed" : "🔔 Get Notified"}
                            </button>
                        </div>
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
                                                eps.map(ep => {
                                                    const isWatched = watchedEpisodes.includes(`${season.season_number}-${ep.episode_number}`);
                                                    return (
                                                    <div 
                                                        key={ep.id} 
                                                        className="episode-card"
                                                        onMouseEnter={() => handleMouseEnter(ep.id)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        <div className="ep-thumb-wrap">
                                                            {hoveredEpisode === ep.id ? (
                                                                <video 
                                                                    className="ep-thumb-video" 
                                                                    src="https://www.w3schools.com/html/mov_bbb.mp4" 
                                                                    autoPlay 
                                                                    loop 
                                                                    muted 
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    className="ep-thumb"
                                                                    src={
                                                                        ep.still_path
                                                                            ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                                                                            : "https://via.placeholder.com/300x169?text=No+Preview"
                                                                    }
                                                                    alt={ep.name}
                                                                />
                                                            )}
                                                            <button
                                                                className="ep-play-btn"
                                                                onClick={() => playEpisode(season.season_number, ep)}
                                                                title="Play episode"
                                                            >
                                                                ▶
                                                            </button>
                                                            {/* Watched Badge */}
                                                            {isWatched && (
                                                                <div className="watched-badge" title="Fully Watched">
                                                                    ✓ Watched
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ep-info">
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <div className="ep-number">
                                                                    E{String(ep.episode_number).padStart(2, "0")}
                                                                </div>
                                                                <button className="ep-download-btn" onClick={(e) => downloadEpisode(e, ep.name)} title="Download Episode">
                                                                    ⬇ Download
                                                                </button>
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
                                                    );
                                                })
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
                            {similar.map(s => <TVCard show={s} key={s.id} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TVDetail;
