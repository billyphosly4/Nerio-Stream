import { useState } from "react";
import "../css/VideoPlayer.css";

// Multiple embed sources as fallbacks
const MOVIE_SOURCES = (id) => [
    `https://vidsrc.to/embed/movie/${id}`,
    `https://2embed.cc/embed/${id}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
];

const TV_SOURCES = (id, season, episode) => [
    `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
    `https://2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
];

export function getMoviePlayerSrc(id)                          { return MOVIE_SOURCES(id)[0]; }
export function getTVPlayerSrc(id, season, episode)            { return TV_SOURCES(id, season, episode)[0]; }
export function getMovieAllSources(id)                         { return MOVIE_SOURCES(id); }
export function getTVAllSources(id, season, episode)           { return TV_SOURCES(id, season, episode); }

/**
 * VideoPlayer
 * ─ sandbox WITHOUT allow-top-navigation prevents the embed from redirecting
 *   the parent window (app stays open).
 */
function VideoPlayer({ src, allSources = [], title = "Video Player", onClose }) {
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
                            referrerPolicy="no-referrer"
                            /*
                             * CRITICAL: sandbox WITHOUT allow-top-navigation
                             * stops the iframe from navigating the parent (app)
                             * away from itself.
                             */
                            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
                            scrolling="no"
                        />
                    </div>
                )}

                {/* Footer */}
                <div className="vp-footer">
                    <p className="vp-disclaimer">
                        ⚠️ Third-party stream · An ad-blocker is recommended
                    </p>
                    {!error && sources.length > 1 && (
                        <button className="vp-switch-btn" onClick={tryNext}>
                            Try another source →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
