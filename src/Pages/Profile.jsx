import { useState, useEffect } from "react";
import { getContinueWatching, getWatchedEpisodes } from "../utils";
import { Link } from "react-router-dom";
import "../css/Home.css"; // Reuse existing grid styles

function Profile() {
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        setHistory(getContinueWatching());
    }, []);

    return (
        <div className="home px-6 md:px-8 py-6" style={{ padding: '2rem 5%' }}>
            <div className="hero-section" style={{ textAlign: 'left', minHeight: 'auto', marginBottom: '2rem' }}>
                <h1 className="hero-title">👤 User Profile</h1>
                <p className="hero-subtitle">Manage your viewing activity, stats, and account settings.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#a5b4fc' }}>Viewing Stats</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', flex: 1 }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{history.length}</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Shows Started</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', flex: 1 }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Hours Watched</div>
                        </div>
                    </div>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#f59e0b' }}>🏆 Gamification & Rewards</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '10px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fcd34d' }}>Lv 1</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Newcomer</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>0</div>
                            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Nerio Points (XP)</div>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#a5b4fc' }}>Recent Badges Earned:</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>No badges yet. Keep watching to earn some!</span>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#a5b4fc' }}>Account Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Manage Subscription</button>
                        <button style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Streaming Quality Preferences</button>
                        <button style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Notification Settings</button>
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🕒 Watch History</h2>
            {history.length === 0 ? (
                <p style={{ color: '#9ca3af' }}>You haven't watched any shows yet.</p>
            ) : (
                <div className="continue-watching-grid" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {history.map(item => (
                        <Link to={`/tv/${item.showId}`} key={item.showId} style={{ textDecoration: 'none', color: 'inherit', width: '250px' }}>
                            <div className="cw-card" style={{ background: '#1e1e2f', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                                    <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`} alt={item.showName} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#333' }}>
                                        <div style={{ width: '100%', height: '100%', background: '#22c55e' }}></div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.showName}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>Watched S{item.seasonNum} E{item.episodeNum}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profile;
