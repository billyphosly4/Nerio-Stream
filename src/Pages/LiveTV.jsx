import { useState, useEffect, useRef } from "react";
import { getLiveMatchDetails, getTeamSquad, getIPTVChannels, getIPTVStreams, getUpcomingFixtures, getSoccersLeagues } from "../Components/Apis";
import Hls from "hls.js";
import "../css/LiveTV.css";

const HlsVideo = ({ src }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let hls;
        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log("Autoplay prevented", e));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log("Autoplay prevented", e));
            });
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [src]);

    return <video ref={videoRef} autoPlay loop playsInline />;
};

const DEFAULT_CHANNELS = [
    { id: 'c1', name: 'Nerio Sports HD', category: 'Sport', currentShow: 'Premier League: Arsenal vs Chelsea', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

function LiveTV() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [multiviewCount, setMultiviewCount] = useState(1); // 1, 2, or 4
    const [channels, setChannels] = useState(DEFAULT_CHANNELS);
    const [categories, setCategories] = useState(["All", "Sport", "News", "International", "Entertainment"]);
    const [activeStreams, setActiveStreams] = useState([DEFAULT_CHANNELS[0]]);

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

    // Live Match Data
    const [socialTab, setSocialTab] = useState("Chat");
    const [matchData, setMatchData] = useState(null);
    const [squadData, setSquadData] = useState([]);
    const [upcomingFixtures, setUpcomingFixtures] = useState([]);
    const [leaguesData, setLeaguesData] = useState([]);

    // Filter EPG
    const [searchQuery, setSearchQuery] = useState("");
    const [epgDate, setEpgDate] = useState("Today");

    const filteredChannels = channels.filter(c => {
        const matchesCat = activeCategory === "All" || (c.category && c.category.toLowerCase() === activeCategory.toLowerCase());
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.currentShow && c.currentShow.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
    }).slice(0, 100); // Slice to 100 strictly for DOM performance

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

        const fetchMatchInfo = async () => {
            const data = await getLiveMatchDetails();
            if (data) setMatchData(data);
            const squad = await getTeamSquad();
            if (squad) setSquadData(squad);
            const fixtures = await getUpcomingFixtures();
            if (fixtures) setUpcomingFixtures(fixtures.slice(0, 20)); // Keep top 20
            const leagues = await getSoccersLeagues();
            if (leagues) setLeaguesData(leagues.slice(0, 20)); // Keep top 20 leagues
        };
        fetchMatchInfo();

        const fetchIPTV = async () => {
            try {
                const [allChannels, allStreams] = await Promise.all([
                    getIPTVChannels(),
                    getIPTVStreams()
                ]);

                const streamsWithUrl = allStreams.filter(s => s.url && s.channel && s.url.includes('.m3u8'));

                if (streamsWithUrl.length > 0) {
                    // Map ALL valid streams to allow full global search
                    const formattedChannels = streamsWithUrl.map((stream, idx) => {
                        const chanInfo = allChannels.find(c => c.id === stream.channel) || {};
                        let category = 'Entertainment';
                        if (chanInfo.categories && chanInfo.categories.length > 0) {
                            category = chanInfo.categories[0];
                            category = category.charAt(0).toUpperCase() + category.slice(1);
                        }
                        return {
                            id: `iptv_${idx}`,
                            name: chanInfo.name || stream.channel,
                            category,
                            currentShow: stream.title || 'Live Broadcast',
                            videoUrl: stream.url
                        };
                    });

                    // Only use real channels from API, no mock data
                    setChannels(formattedChannels);
                    setActiveStreams([formattedChannels[0]]);
                    const cats = new Set(formattedChannels.map(c => c.category));
                    setCategories(["All", ...Array.from(cats)]);
                } else {
                    // If no streams from API, keep DEFAULT_CHANNELS but don't add mock Kenyan channels
                    console.log("No IPTV streams available from API");
                }
            } catch (err) {
                console.error("Error fetching IPTV:", err);
                // Keep DEFAULT_CHANNELS on error
            }
        };
        fetchIPTV();

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
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`epg-category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                            style={{ whiteSpace: 'nowrap' }}
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
                            <button className={`ctrl-btn ${multiviewCount === 1 ? 'active' : ''}`} onClick={() => { setMultiviewCount(1); setActiveStreams([activeStreams[0]]); }}>1 Screen</button>
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
                                            {stream.videoUrl.includes('.m3u8') ? (
                                                <HlsVideo src={stream.videoUrl} />
                                            ) : (
                                                <video src={stream.videoUrl} autoPlay loop playsInline />
                                            )}
                                            <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', zIndex: 2 }}>
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
                    <div className="stadium-header" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            🏟️ Social Stadium
                            <span style={{ fontSize: '0.8rem', background: '#ef4444', padding: '2px 6px', borderRadius: '10px' }}>12.4k watching</span>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button className={`ctrl-btn ${socialTab === 'Chat' ? 'active' : ''}`} onClick={() => setSocialTab("Chat")} style={{ flex: 1, padding: '8px' }}>Chat</button>
                            <button className={`ctrl-btn ${socialTab === 'Data' ? 'active' : ''}`} onClick={() => setSocialTab("Data")} style={{ flex: 1, padding: '8px', background: '#6366f1', borderColor: '#4f46e5' }}>Match</button>
                            <button className={`ctrl-btn ${socialTab === 'Fixtures' ? 'active' : ''}`} onClick={() => setSocialTab("Fixtures")} style={{ flex: 1, padding: '8px', background: '#10b981', borderColor: '#059669' }}>Fixtures</button>
                            <button className={`ctrl-btn ${socialTab === 'Leagues' ? 'active' : ''}`} onClick={() => setSocialTab("Leagues")} style={{ flex: 1, padding: '8px', background: '#f59e0b', borderColor: '#d97706' }}>Leagues</button>
                        </div>
                    </div>

                    {socialTab === 'Data' ? (
                        <div style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
                            {matchData ? (
                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '15px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#a5b4fc' }}>Live Match Center</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: 'bold' }}>{matchData.participants?.[0]?.name || "Team 1"}</div>
                                        </div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: '#ef4444', padding: '5px 10px', borderRadius: '8px' }}>
                                            {matchData.scores?.[0]?.score?.goals || 0} - {matchData.scores?.[1]?.score?.goals || 0}
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: 'bold' }}>{matchData.participants?.[1]?.name || "Team 2"}</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '15px' }}>
                                        <strong>Venue:</strong> {matchData.venue?.name || "TBA"} <br />
                                        <strong>Status:</strong> {matchData.state?.name || "Upcoming"}
                                    </div>

                                    {squadData.length > 0 && (
                                        <>
                                            <h4 style={{ margin: '15px 0 5px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>Team Squad</h4>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', maxHeight: '150px', overflowY: 'auto' }}>
                                                {squadData.slice(0, 11).map(sq => (
                                                    <li key={sq.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <span>{sq.player?.display_name || sq.player?.name}</span>
                                                        <span style={{ color: '#a5b4fc' }}>{sq.position?.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="loader-sm" style={{ margin: '20px auto' }}></div>
                            )}
                        </div>
                    ) : socialTab === 'Fixtures' ? (
                        <div style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#10b981' }}>Upcoming Matches</h3>
                            {upcomingFixtures.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                                    {upcomingFixtures.map(fix => (
                                        <li key={fix.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <strong style={{ color: '#a5b4fc' }}>{fix.league?.name || "League"}</strong>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{fix.starting_at ? new Date(fix.starting_at).toLocaleString() : 'TBA'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ flex: 1, textAlign: 'right' }}>{fix.participants?.[0]?.name || "Team A"}</span>
                                                <span style={{ padding: '0 10px', color: '#ef4444', fontWeight: 'bold' }}>vs</span>
                                                <span style={{ flex: 1 }}>{fix.participants?.[1]?.name || "Team B"}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>Loading fixtures...</div>
                            )}
                        </div>
                    ) : socialTab === 'Leagues' ? (
                        <div style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#f59e0b' }}>Top Leagues (SoccersAPI)</h3>
                            {leaguesData.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
                                    {leaguesData.map(league => (
                                        <li key={league.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {league.img && <img src={league.img} alt={league.name} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />}
                                            <div>
                                                <strong style={{ color: 'white', display: 'block' }}>{league.name}</strong>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{league.country?.name || 'International'}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '20px' }}>Loading leagues...</div>
                            )}
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LiveTV;
