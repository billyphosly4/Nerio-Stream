import { useState, useRef, useEffect, useCallback } from "react";
import Hls from "hls.js";
import "../css/VideoPlayer.css";
import { getCustomStreamUrl, saveCustomStreamUrl } from "../utils";

const DEMO_HLS_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const DEMO_MP4_STREAM = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function getMoviePlayerSrc(id) {
    return `https://vidsrc.me/embed/movie?tmdb=${id}`;
}

export function getTVPlayerSrc(id, season, episode) {
    const s = season || 1;
    const e = episode || 1;
    return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`;
}

export function getMovieAllSources(id) {
    return [
        `https://vidsrc.me/embed/movie?tmdb=${id}`,
        `https://vidsrc.cc/v2/embed/movie/${id}`,
        `https://embed.su/embed/movie/${id}`,
        `https://2embed.org/embed/movie/${id}`,
        DEMO_HLS_STREAM
    ];
}

export function getTVAllSources(id, season, episode) {
    const s = season || 1;
    const e = episode || 1;
    return [
        `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
        `https://embed.su/embed/tv/${id}/${s}/${e}`,
        DEMO_HLS_STREAM
    ];
}

function VideoPlayer({ src, allSources = [], title = "Video Player", overview, movie, show, similar = [], onSelectRecommendation, onClose, onNextEpisode }) {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);
    const hlsRef = useRef(null);

    const sources = allSources.length ? allSources : [src];
    const [srcIndex, setSrcIndex] = useState(0);
    const currentSrc = sources[srcIndex] || src;

    const isIframeEmbed = currentSrc.includes("vidsrc") || currentSrc.includes("embed") || currentSrc.includes("youtube.com/embed");

    // Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [qualityLevels, setQualityLevels] = useState([]);
    const [currentQuality, setCurrentQuality] = useState(-1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [hoverTime, setHoverTime] = useState(null);
    const [hoverPos, setHoverPos] = useState(0);
    const [playerError, setPlayerError] = useState(false);
    const [showClickAnimation, setShowClickAnimation] = useState(null);

    // Interactive Channel State
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [likeCount, setLikeCount] = useState(movie?.vote_count || show?.vote_count || 790);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [showShareNotice, setShowShareNotice] = useState(false);

    const controlsTimeoutRef = useRef(null);

    // Real Movie / Show Metadata Extraction
    const movieTitle = title || movie?.title || show?.name || "Video Stream";
    const videoOverview = overview || movie?.overview || show?.overview || "No detailed description available for this title.";
    const studioName = movie?.production_companies?.[0]?.name || show?.networks?.[0]?.name || "Nerio Studios";
    const releaseYear = movie?.release_date?.split("-")[0] || show?.first_air_date?.split("-")[0] || "2026";
    const ratingText = movie?.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : show?.vote_average ? `★ ${show.vote_average.toFixed(1)}` : "";
    const votesText = movie?.vote_count ? `${movie.vote_count.toLocaleString()} votes` : show?.vote_count ? `${show.vote_count.toLocaleString()} votes` : "Nerio HD Stream";

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    useEffect(() => {
        if (isIframeEmbed) return;
        const video = videoRef.current;
        if (!video) return;

        setPlayerError(false);

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        const isHlsStream = currentSrc.includes(".m3u8") || currentSrc.includes("mux.dev");

        if (isHlsStream && Hls.isSupported()) {
            const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: true });
            hlsRef.current = hls;
            hls.loadSource(currentSrc);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const levels = data.levels.map((lvl, index) => ({
                    index,
                    name: lvl.height ? `${lvl.height}p` : `Level ${index + 1}`
                }));
                setQualityLevels(levels);
                video.play().catch(() => setIsPlaying(false));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            setPlayerError(true);
                            break;
                    }
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl") && isHlsStream) {
            video.src = currentSrc;
            video.play().catch(() => setIsPlaying(false));
        } else {
            video.src = currentSrc;
            video.play().catch(() => setIsPlaying(false));
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [currentSrc, isIframeEmbed]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        setCurrentTime(video.currentTime);
        setDuration(video.duration || 0);

        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            setBuffered((bufferedEnd / (video.duration || 1)) * 100);
        }
    };

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
            triggerClickAnimation('play');
        } else {
            video.pause();
            setIsPlaying(false);
            triggerClickAnimation('pause');
        }
    }, []);

    const triggerClickAnimation = (type) => {
        setShowClickAnimation(type);
        setTimeout(() => setShowClickAnimation(null), 600);
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        const bar = progressBarRef.current;
        if (!video || !bar) return;

        const rect = bar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const seekTime = pos * (video.duration || 0);
        video.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleProgressBarHover = (e) => {
        const bar = progressBarRef.current;
        if (!bar || !duration) return;

        const rect = bar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setHoverTime(pos * duration);
        setHoverPos(e.clientX - rect.left);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        const video = videoRef.current;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (video) {
            video.volume = newVolume;
            video.muted = newVolume === 0;
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        if (isMuted) {
            video.muted = false;
            setIsMuted(false);
            video.volume = volume || 0.5;
        } else {
            video.muted = true;
            setIsMuted(true);
        }
    };

    const handleSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    };

    const handleQualityChange = (levelIndex) => {
        setCurrentQuality(levelIndex);
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
        }
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const togglePiP = async () => {
        const video = videoRef.current;
        if (!video) return;
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else if (document.pictureInPictureEnabled) {
                await video.requestPictureInPicture();
            }
        } catch (err) {
            console.error("PiP error:", err);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isIframeEmbed) return;
            if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "f":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "m":
                    e.preventDefault();
                    toggleMute();
                    break;
                case "arrowleft":
                case "j":
                    e.preventDefault();
                    if (videoRef.current) videoRef.current.currentTime -= 5;
                    break;
                case "arrowright":
                case "l":
                    e.preventDefault();
                    if (videoRef.current) videoRef.current.currentTime += 5;
                    break;
                case "arrowup":
                    e.preventDefault();
                    setVolume(v => {
                        const next = Math.min(1, v + 0.1);
                        if (videoRef.current) videoRef.current.volume = next;
                        return next;
                    });
                    break;
                case "arrowdown":
                    e.preventDefault();
                    setVolume(v => {
                        const next = Math.max(0, v - 0.1);
                        if (videoRef.current) videoRef.current.volume = next;
                        return next;
                    });
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [togglePlay, isIframeEmbed]);

    const handleLike = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            if (isDisliked) setIsDisliked(false);
        }
    };

    const handleDislike = () => {
        if (isDisliked) {
            setIsDisliked(false);
        } else {
            setIsDisliked(true);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            }
        }
    };

    const handleShare = () => {
        navigator.clipboard?.writeText?.(window.location.href);
        setShowShareNotice(true);
        setTimeout(() => setShowShareNotice(false), 2500);
    };

    return (
        <div className="yt-watch-modal" onClick={onClose}>
            <div
                className={`yt-watch-container ${isFullscreen ? "fullscreen" : ""}`}
                ref={containerRef}
                onClick={e => e.stopPropagation()}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                {/* ── Nerio Stream Top Bar ── */}
                <div className="yt-topbar">
                    <div className="yt-logo-group">
                        <span className="ns-logo-text">
                            <span style={{ color: '#6366f1', fontWeight: 900 }}>NERIO</span> STREAM
                        </span>
                    </div>
                    <div className="yt-topbar-right">
                        <button className="yt-close-modal" onClick={onClose} title="Close Player" aria-label="Close Player">
                            <svg xmlns="http://www.w3.org/2000/svg" className="yt-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Main Content Area ── */}
                <div className="yt-watch-body">
                    {/* Left Column: Player & Metadata */}
                    <div className="yt-main-column">
                        {/* Video Player Box */}
                        <div className="yt-player-box">
                            {isIframeEmbed ? (
                                <iframe
                                    key={currentSrc}
                                    src={currentSrc}
                                    title={movieTitle}
                                    allowFullScreen
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    referrerPolicy="origin"
                                    scrolling="no"
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            ) : (
                                <div className="yt-video-wrapper" onClick={togglePlay}>
                                    <video
                                        ref={videoRef}
                                        className="yt-video-element"
                                        onTimeUpdate={handleTimeUpdate}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onError={() => setPlayerError(true)}
                                        playsInline
                                    />

                                    {showClickAnimation && (
                                        <div className="yt-click-anim">
                                            {showClickAnimation === 'play' ? '▶' : '❚❚'}
                                        </div>
                                    )}

                                    {playerError && (
                                        <div className="vp-error">
                                            <p>⚠️ Stream unavailable natively.</p>
                                            <button className="vp-retry-btn" onClick={() => setSrcIndex((srcIndex + 1) % sources.length)}>
                                                Try Source ({srcIndex + 1}/{sources.length})
                                            </button>
                                        </div>
                                    )}

                                    {/* Controls Overlay */}
                                    <div
                                        className={`yt-controls-bar ${showControls ? "visible" : "hidden"}`}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {/* Glowing Progress Line */}
                                        <div
                                            className="yt-progress-container"
                                            ref={progressBarRef}
                                            onClick={handleSeek}
                                            onMouseMove={handleProgressBarHover}
                                            onMouseLeave={() => setHoverTime(null)}
                                        >
                                            {hoverTime !== null && (
                                                <div className="yt-hover-tooltip" style={{ left: `${hoverPos}px` }}>
                                                    {formatTime(hoverTime)}
                                                </div>
                                            )}

                                            <div className="yt-progress-bg">
                                                <div className="yt-progress-buffer" style={{ width: `${buffered}%` }} />
                                                <div
                                                    className="yt-progress-played"
                                                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                                >
                                                    <div className="yt-progress-scrubber" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Control Buttons */}
                                        <div className="yt-controls-row">
                                            <div className="yt-controls-left">
                                                <button className="yt-btn" onClick={togglePlay} title={isPlaying ? "Pause (k)" : "Play (k)"}>
                                                    {isPlaying ? "❚❚" : "▶"}
                                                </button>
                                                {onNextEpisode && (
                                                    <button className="yt-btn" onClick={onNextEpisode} title="Next episode">
                                                        ⏭
                                                    </button>
                                                )}
                                                <div className="yt-volume-wrap">
                                                    <button className="yt-btn" onClick={toggleMute} title="Mute (m)">
                                                        {isMuted || volume === 0 ? "🔇" : "🔊"}
                                                    </button>
                                                    <input
                                                        type="range"
                                                        className="yt-volume-slider"
                                                        min="0"
                                                        max="1"
                                                        step="0.05"
                                                        value={isMuted ? 0 : volume}
                                                        onChange={handleVolumeChange}
                                                    />
                                                </div>
                                                <span className="yt-time-display">
                                                    {formatTime(currentTime)} / {formatTime(duration)}
                                                </span>
                                            </div>

                                            <div className="yt-controls-right">
                                                <button className="yt-btn" title="Subtitles/CC">CC</button>
                                                
                                                {/* Settings Dropdown */}
                                                <div className="yt-dropdown-wrap">
                                                    <select
                                                        className="yt-select-btn"
                                                        value={playbackSpeed}
                                                        onChange={e => handleSpeedChange(parseFloat(e.target.value))}
                                                    >
                                                        <option value="0.5">0.5x</option>
                                                        <option value="1">1.0x</option>
                                                        <option value="1.5">1.5x</option>
                                                        <option value="2">2.0x</option>
                                                    </select>
                                                </div>

                                                <button className="yt-btn" onClick={togglePiP} title="Miniplayer">🗔</button>
                                                <button className="yt-btn" onClick={toggleFullscreen} title="Full screen (f)">⛶</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Below Video Real Metadata Section ── */}
                        <div className="yt-details-section">
                            {/* Real Video Title */}
                            <h1 className="yt-video-title">
                                {movieTitle}
                            </h1>

                            {/* Channel & Action Row */}
                            <div className="yt-channel-row">
                                {/* Left: Real Studio / Channel Profile */}
                                <div className="yt-channel-info">
                                    <div className="yt-avatar">
                                        {studioName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="yt-channel-text">
                                        <h3 className="yt-channel-name">{studioName}</h3>
                                        <span className="yt-sub-count">{votesText}</span>
                                    </div>
                                    <button
                                        className={`yt-subscribe-btn ${isSubscribed ? "subscribed" : ""}`}
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                    >
                                        {isSubscribed ? "Subscribed" : "Subscribe"}
                                    </button>
                                </div>

                                {/* Right: Action Pills */}
                                <div className="yt-action-pills">
                                    {/* Like / Dislike split pill */}
                                    <div className="yt-like-dislike-pill">
                                        <button className={`yt-like-btn ${isLiked ? "active" : ""}`} onClick={handleLike}>
                                            👍 <span className="yt-like-count">{likeCount}</span>
                                        </button>
                                        <div className="yt-pill-divider" />
                                        <button className={`yt-dislike-btn ${isDisliked ? "active" : ""}`} onClick={handleDislike}>
                                            👎
                                        </button>
                                    </div>

                                    {/* Link Custom Stream Pill */}
                                    <button
                                        className="yt-pill-btn"
                                        onClick={() => {
                                            const streamId = movie ? `movie-${movie.id}` : show ? `tv-${show.id}` : null;
                                            const inputUrl = prompt(`Paste your direct ad-free video stream URL (.m3u8 or .mp4) for "${movieTitle}":`);
                                            if (inputUrl && inputUrl.trim()) {
                                                saveCustomStreamUrl(streamId || "default", inputUrl.trim());
                                                alert("✨ Custom ad-free stream saved successfully! The player will now use your direct video link.");
                                                window.location.reload();
                                            }
                                        }}
                                        title="Attach your own direct ad-free HLS (.m3u8) or MP4 link"
                                    >
                                        🔗 Stream URL
                                    </button>

                                    {/* Share Pill */}
                                    <button className="yt-pill-btn" onClick={handleShare}>
                                        ↗ Share
                                    </button>

                                    {/* Ask AI Pill */}
                                    <button className="yt-pill-btn" onClick={() => alert(`Nerio AI: Searching information about "${movieTitle}"...`)}>
                                        ✨ Ask AI
                                    </button>

                                    {/* Download Pill */}
                                    <button className="yt-pill-btn" onClick={() => alert(`Downloading "${movieTitle}" in HD...`)}>
                                        ⬇ Download
                                    </button>

                                    {/* Options Pill */}
                                    <button className="yt-pill-btn yt-more-btn" onClick={() => setSrcIndex((srcIndex + 1) % sources.length)}>
                                        •••
                                    </button>
                                </div>
                            </div>

                            {showShareNotice && (
                                <div className="yt-share-toast">
                                    Link copied to clipboard!
                                </div>
                            )}

                            {/* Real Movie Description Box */}
                            <div className="yt-description-box">
                                <p className="yt-desc-meta">
                                    {releaseYear} {ratingText && ` · ${ratingText}`} {votesText && ` · ${votesText}`}
                                </p>
                                <p className="yt-desc-text">
                                    {videoOverview}
                                </p>
                            </div>

                            {/* ── More Like This Recommendations Grid ── */}
                            {similar && similar.length > 0 && (
                                <div className="yt-more-section">
                                    <h3 className="yt-more-title">🎬 More Like This</h3>
                                    <div className="yt-more-grid">
                                        {similar.slice(0, 6).map(item => (
                                            <div
                                                key={item.id}
                                                className="yt-more-card"
                                                onClick={() => onSelectRecommendation ? onSelectRecommendation(item) : null}
                                                title={`Watch ${item.title || item.name}`}
                                            >
                                                <div className="yt-more-thumb">
                                                    <img
                                                        src={
                                                            item.poster_path
                                                                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                                                                : "https://via.placeholder.com/300x450?text=No+Image"
                                                        }
                                                        alt={item.title || item.name}
                                                        loading="lazy"
                                                    />
                                                    <span className="yt-more-rating">★ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                                                </div>
                                                <div className="yt-more-card-info">
                                                    <h4 className="yt-more-card-name">{item.title || item.name}</h4>
                                                    <span className="yt-more-card-year">
                                                        {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '2026'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;


