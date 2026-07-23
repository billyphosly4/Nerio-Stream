import { useState } from "react";
import "../css/VideoPlayer.css";

// Multiple embed sources as fallbacks
const MOVIE_SOURCES = (id) => [
    `https://vidsrc.cc/v2/embed/movie/${id}`,
    `https://embed.su/embed/movie/${id}`,
    `https://vidsrc.me/embed/movie?tmdb=${id}`,
    `https://vidsrc.xyz/embed/movie/${id}`,
    `https://player.autoembed.co/movie/${id}`,
];

const TV_SOURCES = (id, season, episode) => [
    `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
    `https://embed.su/embed/tv/${id}/${season}/${episode}`,
    `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
    `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
    `https://player.autoembed.co/tv/${id}/${season}/${episode}`,
];

export function getMoviePlayerSrc(id)                          { return MOVIE_SOURCES(id)[0]; }
export function getTVPlayerSrc(id, season, episode)            { return TV_SOURCES(id, season, episode)[0]; }
export function getMovieAllSources(id)                         { return MOVIE_SOURCES(id); }
export function getTVAllSources(id, season, episode)           { return TV_SOURCES(id, season, episode); }

/**
 * VideoPlayer
 */
function VideoPlayer({ src, allSources = [], title = "Video Player", onClose, onNextEpisode }) {
    const sources = allSources.length ? allSources : [src];
    const [srcIndex, setSrcIndex] = useState(0);
    const [error, setError] = useState(false);

    const currentSrc = sources[srcIndex];

    const tryNext = () => {
        if (srcIndex < sources.length - 1) {
            setSrcIndex(i => i + 1);
            setError(false);
        } else {
            setError(true);
        }
    };

    return (
        <div className="vp-modal" onClick={onClose}>
            <div className="vp-container" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="vp-header">
                    <span className="vp-title">{title}</span>
                    <div className="vp-header-actions">
                        {sources.length > 1 && (
                            <span className="vp-source-label">
                                Source {srcIndex + 1} / {sources.length}
                            </span>
                        )}
                        <button className="vp-close" onClick={onClose} title="Close">✕</button>
                    </div>
                </div>

                {/* Player */}
                {error ? (
                    <div className="vp-error">
                        <p>😔 All sources failed to load.</p>
                        <p className="vp-error-sub">Try again later or use a VPN / ad-blocker.</p>
                        <button className="vp-retry-btn" onClick={() => { setSrcIndex(0); setError(false); }}>
                            ↺ Retry
                        </button>
                    </div>
                ) : (
                    <div className="vp-iframe-wrap">
                        <iframe
                            key={currentSrc}
                            src={currentSrc}
                            title={title}
                            allowFullScreen
                            allow="autoplay; fullscreen; picture-in-picture"
                            referrerPolicy="origin"
                            scrolling="no"
                        />
                    </div>
                )}

                {/* Footer */}
                <div className="vp-footer">
                    <p className="vp-disclaimer">
                        ⚠️ Third-party stream · An ad-blocker is recommended
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {!error && sources.length > 1 && (
                            <button className="vp-switch-btn" onClick={tryNext}>
                                Try another source →
                            </button>
                        )}
                        {onNextEpisode && (
                            <button className="vp-switch-btn" style={{ background: '#6366f1', borderColor: '#4f46e5', color: '#fff' }} onClick={onNextEpisode}>
                                Next Episode ⏭
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
