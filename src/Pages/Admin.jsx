import { useState } from "react";
import "../css/Admin.css";

const ANALYTICS_DATA = [
    { label: "Total Active Users", value: "124,592", trend: "+12.4%", positive: true },
    { label: "Monthly Recurring Revenue", value: "$425,890", trend: "+8.2%", positive: true },
    { label: "Total Bandwidth (CDN)", value: "1.2 PB", trend: "-2.1%", positive: false },
    { label: "Concurrent Viewers", value: "18,402", trend: "+15.3%", positive: true },
];

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <h2>🛠️ Admin Panel</h2>
                <nav>
                    <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>📊 Dashboard</button>
                    <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>👥 User Management</button>
                    <button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")}>🎬 Content Ops</button>
                    <button className={activeTab === "infrastructure" ? "active" : ""} onClick={() => setActiveTab("infrastructure")}>☁️ Infrastructure</button>
                    <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>🛡️ Security & DRM</button>
                </nav>
            </div>

            <div className="admin-content">
                <header className="admin-header">
                    <h1>Real-time Analytics Overview</h1>
                    <button className="export-btn">📥 Export CSV Report</button>
                </header>

                <div className="stats-grid">
                    {ANALYTICS_DATA.map((stat, i) => (
                        <div key={i} className="stat-card">
                            <h3 className="stat-label">{stat.label}</h3>
                            <div className="stat-value">{stat.value}</div>
                            <div className={`stat-trend ${stat.positive ? "positive" : "negative"}`}>
                                {stat.trend} from last month
                            </div>
                        </div>
                    ))}
                </div>

                <div className="admin-main-widgets">
                    <div className="widget">
                        <h3>📈 Server & CDN Load Map</h3>
                        <div className="map-placeholder">
                            <div className="node" style={{ top: '30%', left: '20%' }}></div>
                            <div className="node" style={{ top: '40%', left: '50%' }}></div>
                            <div className="node" style={{ top: '60%', left: '80%' }}></div>
                            <p>Global Edge Network Status: <span>Healthy</span></p>
                        </div>
                    </div>
                    <div className="widget">
                        <h3>🔥 Top Trending Content</h3>
                        <ul className="trending-list">
                            <li>1. Nerio Sports HD (Live) <span>4,200 viewers</span></li>
                            <li>2. The Matrix Resurrections <span>1,890 viewers</span></li>
                            <li>3. Champions League Final <span>12,050 viewers</span></li>
                            <li>4. Stranger Things S04E01 <span>840 viewers</span></li>
                        </ul>
                    </div>
                </div>

                {activeTab !== "dashboard" && (
                    <div className="wip-banner">
                        🚧 <strong>{activeTab.toUpperCase()}</strong> module is currently in development (Phase 4).
                    </div>
                )}
            </div>
        </div>
    );
}
