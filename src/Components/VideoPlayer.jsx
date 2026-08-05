import { useState } from "react";
import "../css/VideoPlayer.css";

// Multiple embed sources as fallbacks. TMDB supplies metadata; the actual
// playback source needs to come from a separate embed provider chain.
const MOVIE_SOURCES = (id) => [
    `https://vidsrc.me/embed/movie?tmdb=${id}`,
];

const TV_SOURCES = (id, season, episode) => [
    `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`,
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
                    <div className="vp-header-actions" style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button className="vp-action-btn" title="Watch Party" onClick={() => alert("Watch Party link copied to clipboard! Share with friends to co-watch.")}>🎉 Watch Party</button>
                        <select className="vp-action-btn" title="Quality Selector (ABR)" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
                            <option value="auto">Auto (ABR)</option>
                            <option value="1080p">1080p</option>
                            <option value="720p">720p</option>
                            <option value="480p">480p</option>
                        </select>
                        <select className="vp-action-btn" title="Playback Speed" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
                            <option value="1">1.0x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2.0x</option>
                        </select>
                        <button className="vp-action-btn" title="Picture-in-Picture" onClick={() => alert("Picture-in-Picture mode activated")}>🔲 PiP</button>
                        <button className="vp-action-btn" title="Chromecast" onClick={() => alert("Looking for casting devices...")}>📺 Cast</button>
                        <button className="vp-action-btn" title="AirPlay" onClick={() => alert("Looking for AirPlay devices...")}>🍎 AirPlay</button>
                        {sources.length > 1 && (
                            <span className="vp-source-label" style={{ marginLeft: '4px' }}>
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
                            onError={() => tryNext()}
                        />
                    </div>
                )}

                {/* Footer */}
                <div className="vp-footer">
                    <p className="vp-disclaimer">
                        ⚠️ Third-party stream · An ad-blocker is recommended
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="vp-switch-btn" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }} onClick={() => alert("Skipping Intro/Recap using AI Scene Detection...")}>
                            ⏭ Skip Intro
                        </button>
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
