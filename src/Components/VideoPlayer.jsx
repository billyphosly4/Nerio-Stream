import "../css/VideoPlayer.css";

/**
 * VideoPlayer
 * @param {string} src  - full iframe embed URL
 * @param {string} title - accessible title
 * @param {function} onClose - callback to close the player
 */
function VideoPlayer({ src, title = "Video Player", onClose }) {
    return (
        <div className="vp-modal" onClick={onClose}>
            <div className="vp-container" onClick={e => e.stopPropagation()}>
                <div className="vp-header">
                    <span className="vp-title">{title}</span>
                    <button className="vp-close" onClick={onClose} title="Close">✕</button>
                </div>
                <div className="vp-iframe-wrap">
                    <iframe
                        src={src}
                        title={title}
                        allowFullScreen
                        allow="autoplay; fullscreen"
                        referrerPolicy="origin"
                        scrolling="no"
                    />
                </div>
                <p className="vp-disclaimer">
                    ⚠️ Video is served via third-party embed. Use an ad-blocker for the best experience.
                </p>
            </div>
        </div>
    );
}

export default VideoPlayer;
