import { useState, useEffect, useRef } from "react";
import "../css/BroadcastHub.css";

const DESTINATIONS = [
    { id: "youtube", name: "YouTube Live", icon: "▶️", color: "#ff0000", placeholder: "rtmp://a.rtmp.youtube.com/live2/STREAM_KEY" },
    { id: "twitch",  name: "Twitch",       icon: "💜", color: "#9146ff", placeholder: "rtmp://live.twitch.tv/app/STREAM_KEY"     },
    { id: "facebook",name: "Facebook Live",icon: "📘", color: "#1877f2", placeholder: "rtmps://live-api-s.facebook.com:443/rtmp/STREAM_KEY" },
    { id: "custom",  name: "Custom RTMP",  icon: "📡", color: "#10b981", placeholder: "rtmp://your-server.com/live/STREAM_KEY"  },
];

const CHAT_SEED = [
    { user: "StreamFan99", text: "Just joined! This is awesome 🔥", color: "#a5b4fc" },
    { user: "TwitchUser42", text: "Love the multi-platform broadcast!", color: "#c084fc" },
    { user: "YTWatcher", text: "Watching from YouTube side 👀", color: "#fb923c" },
];

const BADGES = [
    { id: "first_stream", icon: "🎙️", label: "First Stream",   earned: true  },
    { id: "poll_master",  icon: "📊", label: "Poll Master",    earned: true  },
    { id: "multi_cast",   icon: "📡", label: "MultiCaster",    earned: false },
    { id: "gifted",       icon: "🎁", label: "Gift Receiver",  earned: true  },
    { id: "viral",        icon: "🚀", label: "Viral Moment",   earned: false },
];

const GIFTS = [
    { id: "star",   icon: "⭐", label: "Star",    coins: 10  },
    { id: "heart",  icon: "❤️", label: "Heart",   coins: 25  },
    { id: "fire",   icon: "🔥", label: "Fire",    coins: 50  },
    { id: "crown",  icon: "👑", label: "Crown",   coins: 200 },
    { id: "rocket", icon: "🚀", label: "Rocket",  coins: 500 },
];

export default function BroadcastHub() {
    const [isLive, setIsLive] = useState(false);
    const [destinations, setDestinations] = useState(
        DESTINATIONS.map(d => ({ ...d, active: d.id === "youtube", key: "" }))
    );
    const [streamTitle, setStreamTitle] = useState("My Nerio Stream Broadcast");
    const [streamCategory, setStreamCategory] = useState("Gaming");
    const [viewers, setViewers] = useState(0);
    const [duration, setDuration] = useState(0);
    const [chatMessages, setChatMessages] = useState(CHAT_SEED);
    const [chatInput, setChatInput] = useState("");
    const [activeTab, setActiveTab] = useState("destinations"); // destinations | analytics | engagement
    const [activePoll, setActivePoll] = useState(null);
    const [pollVotes, setPollVotes] = useState({});
    const [gifts, setGifts] = useState([]);
    const [totalCoins, setTotalCoins] = useState(0);
    const [showGiftBurst, setShowGiftBurst] = useState(null);
    const [streamHealth, setStreamHealth] = useState({ bitrate: 0, fps: 0, ping: 0 });
    const [xpPoints, setXpPoints] = useState(340);
    const timerRef = useRef(null);
    const healthRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    useEffect(() => {
        if (isLive) {
            timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
            healthRef.current = setInterval(() => {
                setStreamHealth({
                    bitrate: Math.floor(5800 + Math.random() * 400),
                    fps:     Math.floor(58 + Math.random() * 4),
                    ping:    Math.floor(18 + Math.random() * 15),
                });
                setViewers(v => Math.max(10, v + Math.floor(Math.random() * 20 - 8)));

                // Random chat messages while live
                if (Math.random() > 0.55) {
                    const names = ["AlexLive", "StreamerPro", "TwitchBot", "Viewer99", "FanBoy"];
                    const msgs  = ["🔥 Let's gooo!", "Amazing stream!", "Keep it up!", "First time here!", "This is fire 🚀"];
                    const colors = ["#a5b4fc", "#fb923c", "#c084fc", "#34d399", "#f472b6"];
                    const i = Math.floor(Math.random() * names.length);
                    setChatMessages(prev => [
                        ...prev.slice(-80),
                        { user: names[i], text: msgs[i], color: colors[i] }
                    ]);
                }
            }, 1500);

            setViewers(42);
            setXpPoints(p => p + 25);
        } else {
            clearInterval(timerRef.current);
            clearInterval(healthRef.current);
        }
        return () => { clearInterval(timerRef.current); clearInterval(healthRef.current); };
    }, [isLive]);

    const fmtDuration = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return [h, m, sec].map(v => String(v).padStart(2, "0")).join(":");
    };

    const toggleDestination = (id) => {
        setDestinations(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
    };
    const updateKey = (id, val) => {
        setDestinations(prev => prev.map(d => d.id === id ? { ...d, key: val } : d));
    };

    const goLive = () => {
        const active = destinations.filter(d => d.active);
        if (active.length === 0) { alert("Select at least one destination!"); return; }
        setIsLive(true);
        setDuration(0);
        setViewers(42);
    };

    const endStream = () => {
        setIsLive(false);
        setXpPoints(p => p + 50);
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMessages(prev => [...prev.slice(-80), { user: "You (Host)", text: chatInput, color: "#fbbf24", host: true }]);
        setChatInput("");
    };

    const launchPoll = () => {
        setActivePoll({ question: "What should I play next?", options: ["Fortnite", "Minecraft", "Valorant", "COD"] });
        setPollVotes({ Fortnite: 14, Minecraft: 9, Valorant: 21, COD: 7 });
    };

    const sendGift = (gift) => {
        setGifts(prev => [...prev, { ...gift, id: `${gift.id}_${Date.now()}`, from: "Viewer" }]);
        setTotalCoins(c => c + gift.coins);
        setShowGiftBurst(gift.icon);
        setTimeout(() => setShowGiftBurst(null), 1500);
        setChatMessages(prev => [...prev, { user: "🎁 System", text: `Viewer sent a ${gift.label} (${gift.coins} coins)!`, color: "#fbbf24" }]);
    };

    const activeCount = destinations.filter(d => d.active).length;
    const totalPollVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);
    const xpLevel = Math.floor(xpPoints / 200) + 1;
    const xpProgress = (xpPoints % 200) / 200 * 100;

    return (
        <div className="bh-page">
            {/* Gift burst animation */}
            {showGiftBurst && (
                <div className="gift-burst">{showGiftBurst}</div>
            )}

            {/* Header */}
            <div className="bh-header">
                <div>
                    <h1 className="bh-title">📡 Unified Broadcast Hub</h1>
                    <p className="bh-subtitle">Simulcast to multiple platforms with Social Stadium built in</p>
                </div>
                <div className="bh-header-right">
                    {isLive && (
                        <div className="bh-live-stats">
                            <span className="live-pill">🔴 LIVE</span>
                            <span className="bh-stat">⏱ {fmtDuration(duration)}</span>
                            <span className="bh-stat">👥 {viewers.toLocaleString()}</span>
                            <span className="bh-stat">📡 {activeCount} dest.</span>
                        </div>
                    )}
                    <button
                        className={`bh-go-live-btn ${isLive ? "end" : "go"}`}
                        onClick={isLive ? endStream : goLive}
                    >
                        {isLive ? "⏹ End Stream" : "🔴 Go Live"}
                    </button>
                </div>
            </div>

            <div className="bh-layout">
                {/* Left Column – Config & Preview */}
                <div className="bh-left">
                    {/* Stream Info */}
                    <div className="bh-card">
                        <div className="bh-card-title">🎬 Stream Info</div>
                        <label className="bh-label">Title</label>
                        <input className="bh-input" value={streamTitle} onChange={e => setStreamTitle(e.target.value)} placeholder="Stream title..." />
                        <label className="bh-label" style={{ marginTop: 10 }}>Category</label>
                        <select className="bh-input" value={streamCategory} onChange={e => setStreamCategory(e.target.value)}>
                            {["Gaming", "Sports", "Music", "Just Chatting", "Technology", "Education"].map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tab Bar */}
                    <div className="bh-tabs">
                        {[
                            { id: "destinations", label: "📡 Destinations" },
                            { id: "analytics",    label: "📊 Analytics"    },
                            { id: "engagement",   label: "🎮 Engagement"   },
                        ].map(t => (
                            <button key={t.id} className={`bh-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* TAB: Destinations */}
                    {activeTab === "destinations" && (
                        <div className="bh-card">
                            <div className="bh-card-title">📡 Streaming Destinations</div>
                            {destinations.map(dest => (
                                <div key={dest.id} className={`dest-row ${dest.active ? "active" : ""}`}>
                                    <div className="dest-top">
                                        <label className="dest-toggle">
                                            <input type="checkbox" checked={dest.active} onChange={() => toggleDestination(dest.id)} />
                                            <span className="dest-name">
                                                <span style={{ fontSize: "1.2rem" }}>{dest.icon}</span>
                                                {dest.name}
                                            </span>
                                        </label>
                                        {isLive && dest.active && (
                                            <span className="dest-live-badge">LIVE ●</span>
                                        )}
                                    </div>
                                    {dest.active && (
                                        <input
                                            className="bh-input key-input"
                                            placeholder={dest.placeholder}
                                            value={dest.key}
                                            onChange={e => updateKey(dest.id, e.target.value)}
                                            type="password"
                                        />
                                    )}
                                </div>
                            ))}
                            <p className="bh-hint">🔒 Stream keys are stored locally and never sent to our servers.</p>
                        </div>
                    )}

                    {/* TAB: Analytics */}
                    {activeTab === "analytics" && (
                        <div className="bh-card">
                            <div className="bh-card-title">📊 Stream Analytics</div>
                            <div className="analytics-grid">
                                <div className="analytics-card">
                                    <div className="analytics-val" style={{ color: "#a5b4fc" }}>{viewers}</div>
                                    <div className="analytics-label">Live Viewers</div>
                                </div>
                                <div className="analytics-card">
                                    <div className="analytics-val" style={{ color: "#34d399" }}>{streamHealth.bitrate.toLocaleString()}</div>
                                    <div className="analytics-label">Bitrate (kbps)</div>
                                </div>
                                <div className="analytics-card">
                                    <div className="analytics-val" style={{ color: "#fbbf24" }}>{streamHealth.fps}</div>
                                    <div className="analytics-label">FPS</div>
                                </div>
                                <div className="analytics-card">
                                    <div className="analytics-val" style={{ color: "#f472b6" }}>{streamHealth.ping} ms</div>
                                    <div className="analytics-label">Ping</div>
                                </div>
                                <div className="analytics-card">
                                    <div className="analytics-val" style={{ color: "#fb923c" }}>{totalCoins}</div>
                                    <div className="analytics-label">Coins Earned</div>
                                </div>
                                <div className="analytics-card">
                                    <div className="analytics-val" style={{ color: "#c084fc" }}>{chatMessages.length}</div>
                                    <div className="analytics-label">Chat Messages</div>
                                </div>
                            </div>

                            {/* Health Bar */}
                            <div style={{ marginTop: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem", color: "#9ca3af" }}>
                                    <span>Stream Health</span>
                                    <span style={{ color: streamHealth.bitrate > 5000 ? "#34d399" : "#f59e0b" }}>
                                        {streamHealth.bitrate > 5000 ? "Excellent" : "Good"}
                                    </span>
                                </div>
                                <div className="health-bar-track">
                                    <div className="health-bar-fill" style={{ width: `${Math.min((streamHealth.bitrate / 8000) * 100, 100)}%` }} />
                                </div>
                            </div>

                            {/* XP / Gamification */}
                            <div className="xp-panel">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700 }}>⭐ Level {xpLevel} Streamer</span>
                                    <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{xpPoints} XP</span>
                                </div>
                                <div className="xp-track"><div className="xp-fill" style={{ width: `${xpProgress}%` }} /></div>
                                <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 6 }}>
                                    {Math.ceil((Math.ceil(xpPoints / 200) * 200) - xpPoints)} XP to Level {xpLevel + 1}
                                </div>
                                <div className="badges-row">
                                    {BADGES.map(b => (
                                        <div key={b.id} className={`badge-chip ${b.earned ? "earned" : "locked"}`} title={b.label}>
                                            {b.icon} {b.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: Engagement */}
                    {activeTab === "engagement" && (
                        <div className="bh-card">
                            <div className="bh-card-title">🎮 Engagement Tools</div>

                            {/* Poll */}
                            <div className="engagement-section">
                                <div className="engage-title">📊 Live Poll</div>
                                {!activePoll ? (
                                    <button className="bh-btn primary" onClick={launchPoll}>Launch Poll</button>
                                ) : (
                                    <>
                                        <div style={{ fontWeight: 600, marginBottom: 10 }}>{activePoll.question}</div>
                                        {activePoll.options.map(opt => {
                                            const votes = pollVotes[opt] || 0;
                                            const pct = totalPollVotes > 0 ? Math.round((votes / totalPollVotes) * 100) : 0;
                                            return (
                                                <div key={opt} className="poll-bar-row">
                                                    <div className="poll-bar-label">{opt}</div>
                                                    <div className="poll-bar-track">
                                                        <div className="poll-bar-fill" style={{ width: `${pct}%` }} />
                                                        <span className="poll-bar-pct">{pct}%</span>
                                                    </div>
                                                    <span className="poll-votes">{votes}</span>
                                                </div>
                                            );
                                        })}
                                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                            <button className="bh-btn danger" onClick={() => setActivePoll(null)}>End Poll</button>
                                            <span style={{ color: "#9ca3af", fontSize: "0.85rem", alignSelf: "center" }}>{totalPollVotes} votes</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Virtual Gifts */}
                            <div className="engagement-section">
                                <div className="engage-title">🎁 Virtual Gifts (Simulate)</div>
                                <div className="gifts-row">
                                    {GIFTS.map(g => (
                                        <button key={g.id} className="gift-btn" onClick={() => sendGift(g)} title={`${g.label} – ${g.coins} coins`}>
                                            <span className="gift-icon">{g.icon}</span>
                                            <span className="gift-label">{g.label}</span>
                                            <span className="gift-coins">{g.coins} 🪙</span>
                                        </button>
                                    ))}
                                </div>
                                <div style={{ marginTop: 10, color: "#fbbf24", fontSize: "0.85rem" }}>
                                    💰 Total earnings: <strong>{totalCoins}</strong> coins
                                </div>
                            </div>

                            {/* Recent Gifts */}
                            {gifts.length > 0 && (
                                <div className="engagement-section">
                                    <div className="engage-title">🎀 Recent Gifts</div>
                                    <div className="gifts-feed">
                                        {gifts.slice(-5).reverse().map((g, i) => (
                                            <div key={g.id + i} className="gift-feed-row">
                                                <span>{g.icon}</span>
                                                <span>{g.from} sent a <strong>{g.label}</strong></span>
                                                <span className="gift-coins-badge">+{g.coins} 🪙</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column – Live Chat */}
                <div className="bh-right">
                    <div className="bh-chat-panel">
                        <div className="bh-chat-header">
                            <span>💬 Live Chat</span>
                            <span style={{ fontSize: "0.8rem", background: "#ef4444", padding: "2px 8px", borderRadius: 10 }}>
                                {viewers} watching
                            </span>
                        </div>
                        <div className="bh-chat-body">
                            {chatMessages.map((m, i) => (
                                <div key={i} className={`bh-chat-msg ${m.host ? "host" : ""}`}>
                                    <span className="bh-chat-user" style={{ color: m.color || "#a5b4fc" }}>{m.user}:</span>
                                    <span>{m.text}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <form className="bh-chat-form" onSubmit={sendChat}>
                            <input
                                className="bh-chat-input"
                                placeholder="Say something to your audience..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                            />
                            <button type="submit" className="bh-btn primary" style={{ flexShrink: 0 }}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
