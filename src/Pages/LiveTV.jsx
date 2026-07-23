import { useState, useEffect } from "react";
import "../css/LiveTV.css";

// Mock Data
const EPG_CATEGORIES = ["All", "Sport", "News", "International", "Entertainment"];
const CHANNELS = [
    { id: 'c1', name: 'Nerio Sports HD', category: 'Sport', currentShow: 'Premier League: Arsenal vs Chelsea', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'c2', name: 'Global News 24', category: 'News', currentShow: 'Live World Updates', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'c3', name: 'BBC International', category: 'International', currentShow: 'Documentary: Planet Earth', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 'c4', name: 'ESPN Live', category: 'Sport', currentShow: 'NBA Finals: Lakers vs Heat', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

function LiveTV() {
    const [activeCategory, setActiveCategory] = useState("Sport");
    const [multiviewCount, setMultiviewCount] = useState(1); // 1, 2, or 4
    const [activeStreams, setActiveStreams] = useState([CHANNELS[0]]);
    
    // Player Controls
    const [abrQuality, setAbrQuality] = useState("Auto");
    const [cdn, setCdn] = useState("Primary CDN (Fastest)");
    const [isRecording, setIsRecording] = useState(false);
    
    // Social Stadium
    const [chatMessages, setChatMessages] = useState([
        { user: "Alex22", text: "What a match!" },
        { user: "FootyFan", text: "Did you see that goal?!" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const [popupEvent, setPopupEvent] = useState(null);

    // Filter EPG
    const [searchQuery, setSearchQuery] = useState("");
    const [epgDate, setEpgDate] = useState("Today");

    const filteredChannels = CHANNELS.filter(c => {
        const matchesCat = activeCategory === "All" || c.category === activeCategory;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.currentShow.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    useEffect(() => {
        // Simulate interactive events for Social Stadium
        const timer1 = setTimeout(() => {
            setPopupEvent({
                type: "poll",
                question: "Who will score next?",
                options: ["Arsenal", "Chelsea", "No one"]
            });
        }, 10000);

        const timer2 = setTimeout(() => {
            setPopupEvent({
                type: "trivia",
                question: "Trivia: Which team has won more PL titles?",
                options: ["Arsenal", "Chelsea"]
            });
        }, 25000);

        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const handleChannelClick = (channel) => {
        if (multiviewCount === 1) {
            setActiveStreams([channel]);
        } else {
            if (activeStreams.length < multiviewCount && !activeStreams.find(c => c.id === channel.id)) {
                setActiveStreams([...activeStreams, channel]);
            } else if (activeStreams.length === multiviewCount) {
                // replace last
                const newStreams = [...activeStreams];
                newStreams[newStreams.length - 1] = channel;
                setActiveStreams(newStreams);
            }
        }
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMessages([...chatMessages, { user: "You", text: chatInput }]);
        setChatInput("");
    };

    const handlePopupAnswer = (option) => {
        setChatMessages([...chatMessages, { user: "System", text: `You answered: ${option}` }]);
        setPopupEvent(null);
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice search is not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.onresult = (event) => {
            setSearchQuery(event.results[0][0].transcript);
        };
        recognition.start();
    };

    return (
        <div className="live-tv-container">
            {/* EPG Top Bar */}
            <div className="epg-container">
                <div className="epg-header">
                    <h2>📡 Live Channel Guide</h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select className="ctrl-select" value={epgDate} onChange={e => setEpgDate(e.target.value)} style={{ padding: '4px 8px', fontSize: '0.85rem' }}>
                            <option value="Today">Today</option>
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="Upcoming">Upcoming (Week)</option>
                        </select>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="text" 
                                placeholder="Search channels or shows..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ padding: '6px 30px 6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '0.85rem' }}
                            />
                            <button type="button" onClick={handleVoiceSearch} style={{ position: 'absolute', right: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Voice Search">🎤</button>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    {EPG_CATEGORIES.map(cat => (
                        <button 
                            key={cat} 
                            className={`epg-category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="epg-timeline">
                    {filteredChannels.map(channel => (
                        <div 
                            key={channel.id} 
                            className={`epg-channel ${activeStreams.find(c => c.id === channel.id) ? 'active' : ''}`}
                            onClick={() => handleChannelClick(channel)}
                        >
                            <div className="epg-channel-name">
                                {channel.name}
                                {channel.category === "Sport" && "⚽"}
                            </div>
                            <div className="epg-show-title">{channel.currentShow}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area */}
            <div className="live-main-area">
                {/* Left: Player & Controls */}
                <div className="live-player-section">
                    {/* Multiview Options */}
                    <div className="player-advanced-controls" style={{ background: 'transparent', padding: '0 0 10px 0' }}>
                        <div className="control-group">
                            <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Multiview:</span>
                            <button className={`ctrl-btn ${multiviewCount === 1 ? 'active' : ''}`} onClick={() => {setMultiviewCount(1); setActiveStreams([activeStreams[0]]);}}>1 Screen</button>
                            <button className={`ctrl-btn ${multiviewCount === 2 ? 'active' : ''}`} onClick={() => setMultiviewCount(2)}>2 Screens</button>
                            <button className={`ctrl-btn ${multiviewCount === 4 ? 'active' : ''}`} onClick={() => setMultiviewCount(4)}>4 Screens</button>
                        </div>
                        <div className="control-group">
                            <button className="ctrl-btn" onClick={() => alert("Custom Playlist imported successfully!")}>+ Import Playlist</button>
                            <button className="ctrl-btn">⭐ Add to Favorites</button>
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className={`multiview-grid multiview-${multiviewCount}`}>
                        {Array.from({ length: multiviewCount }).map((_, idx) => {
                            const stream = activeStreams[idx];
                            return (
                                <div key={idx} className={`live-screen ${stream ? 'active' : ''}`}>
                                    {stream ? (
                                        <>
                                            <div className="live-badge">LIVE</div>
                                            <video src={stream.videoUrl} autoPlay loop muted playsInline />
                                            <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                {stream.currentShow}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                                            Select a channel from EPG
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Infrastructure & DVR Controls */}
                    <div className="player-advanced-controls">
                        <div className="control-group">
                            <span>Quality (ABR):</span>
                            <select className="ctrl-select" value={abrQuality} onChange={(e) => setAbrQuality(e.target.value)}>
                                <option value="Auto">Auto (Adaptive)</option>
                                <option value="1080p">1080p HD</option>
                                <option value="720p">720p</option>
                                <option value="480p">480p</option>
                            </select>

                            <span style={{ marginLeft: '10px' }}>Server:</span>
                            <select className="ctrl-select" value={cdn} onChange={(e) => setCdn(e.target.value)}>
                                <option value="Primary CDN (Fastest)">Primary CDN (Edge)</option>
                                <option value="Backup CDN (US East)">Backup CDN (US East)</option>
                                <option value="Backup CDN (EU West)">Backup CDN (EU West)</option>
                            </select>
                        </div>

                        <div className="control-group">
                            <button className="ctrl-btn" onClick={() => alert("Rewinding live broadcast - Cloud DVR active")}>⏪ 10s</button>
                            <button className={`ctrl-btn ${isRecording ? 'active' : ''}`} onClick={() => setIsRecording(!isRecording)}>
                                {isRecording ? "⏹ Stop Recording" : "⏺ Cloud Record (VOD)"}
                            </button>
                            <button className="ctrl-btn" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }} onClick={() => alert("Generating AI Highlights...")}>
                                ✨ AI Highlights
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Social Stadium */}
                <div className="social-stadium">
                    <div className="stadium-header">
                        🏟️ Social Stadium
                        <span style={{ fontSize: '0.8rem', background: '#ef4444', padding: '2px 6px', borderRadius: '10px' }}>12.4k watching</span>
                    </div>

                    {popupEvent && (
                        <div className="interactive-popup">
                            <div className="popup-title">{popupEvent.type === 'poll' ? '📊 Live Poll' : '🧠 Trivia'}</div>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>{popupEvent.question}</p>
                            {popupEvent.options.map(opt => (
                                <button key={opt} className="poll-option" onClick={() => handlePopupAnswer(opt)}>{opt}</button>
                            ))}
                        </div>
                    )}

                    <div className="chat-messages">
                        {chatMessages.map((msg, i) => (
                            <div key={i} className="chat-msg">
                                <span className="chat-user">{msg.user}:</span>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                    </div>

                    <form className="chat-input-area" onSubmit={handleChatSubmit}>
                        <input 
                            type="text" 
                            placeholder="Join the conversation..." 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                        />
                        <button type="submit" className="ctrl-btn">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LiveTV;
