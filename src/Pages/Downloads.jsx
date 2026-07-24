import { useState, useEffect, useRef } from "react";
import "../css/Downloads.css";

// Simulated download queue manager backed by localStorage
const STORAGE_KEY = "nerio_downloads";

const getDownloads = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch { return []; }
};

const saveDownloads = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// Seed some mock downloads for demo purposes
const seedMockDownloads = () => {
    const existing = getDownloads();
    if (existing.length > 0) return;
    const mock = [
        {
            id: "dl_1",
            title: "Breaking Bad – S05E14: Ozymandias",
            type: "episode",
            quality: "1080p HD",
            size: "2.4 GB",
            sizeBytes: 2576980377,
            progress: 100,
            status: "completed",
            thumbnail: "https://image.tmdb.org/t/p/w500/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
            downloadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            duration: "47 min",
            blob: null
        },
        {
            id: "dl_2",
            title: "Game of Thrones – S01E01: Winter Is Coming",
            type: "episode",
            quality: "4K HDR",
            size: "8.1 GB",
            sizeBytes: 8696401408,
            progress: 100,
            status: "completed",
            thumbnail: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
            downloadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            duration: "62 min",
            blob: null
        },
        {
            id: "dl_3",
            title: "Interstellar (2014)",
            type: "movie",
            quality: "1080p HD",
            size: "4.7 GB",
            sizeBytes: 5046586572,
            progress: 67,
            status: "paused",
            thumbnail: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            downloadedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
            duration: "169 min",
            blob: null
        },
        {
            id: "dl_4",
            title: "The Dark Knight (2008)",
            type: "movie",
            quality: "720p",
            size: "2.1 GB",
            sizeBytes: 2254857830,
            progress: 100,
            status: "completed",
            thumbnail: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            downloadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            duration: "152 min",
            blob: null
        },
    ];
    saveDownloads(mock);
};

function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
    return `${bytes.toFixed(1)} ${units[i]}`;
}

function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function Downloads() {
    const [downloads, setDownloads] = useState([]);
    const [filter, setFilter] = useState("all"); // all, completed, downloading, paused
    const [sortBy, setSortBy] = useState("date"); // date, size, name
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [exportMsg, setExportMsg] = useState("");
    const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0 });
    const intervalRef = useRef(null);

    useEffect(() => {
        seedMockDownloads();
        setDownloads(getDownloads());

        // Calculate storage estimate
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(({ usage, quota }) => {
                setStorageInfo({ used: usage || 0, total: quota || 0 });
            });
        }

        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    // Simulate download progress for "downloading" items
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setDownloads(prev => {
                const updated = prev.map(dl => {
                    if (dl.status === "downloading" && dl.progress < 100) {
                        const newProgress = Math.min(dl.progress + Math.random() * 3, 100);
                        const completed = newProgress >= 100;
                        return { ...dl, progress: Math.floor(newProgress), status: completed ? "completed" : "downloading" };
                    }
                    return dl;
                });
                saveDownloads(updated);
                return updated;
            });
        }, 800);
        return () => clearInterval(intervalRef.current);
    }, []);

    const filtered = downloads
        .filter(dl => {
            if (filter === "all") return true;
            if (filter === "completed") return dl.status === "completed";
            if (filter === "downloading") return dl.status === "downloading";
            if (filter === "paused") return dl.status === "paused";
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "size") return b.sizeBytes - a.sizeBytes;
            if (sortBy === "name") return a.title.localeCompare(b.title);
            return new Date(b.downloadedAt) - new Date(a.downloadedAt);
        });

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedIds.size === filtered.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filtered.map(d => d.id)));
        }
    };

    const pauseResume = (id) => {
        setDownloads(prev => {
            const updated = prev.map(dl => {
                if (dl.id !== id) return dl;
                if (dl.status === "paused") return { ...dl, status: "downloading" };
                if (dl.status === "downloading") return { ...dl, status: "paused" };
                return dl;
            });
            saveDownloads(updated);
            return updated;
        });
    };

    const deleteDownload = (ids) => {
        setDownloads(prev => {
            const updated = prev.filter(dl => !ids.has(dl.id));
            saveDownloads(updated);
            return updated;
        });
        setSelectedIds(new Set());
    };

    const retryDownload = (id) => {
        setDownloads(prev => {
            const updated = prev.map(dl => {
                if (dl.id !== id) return dl;
                return { ...dl, status: "downloading", progress: 0 };
            });
            saveDownloads(updated);
            return updated;
        });
    };

    // Export: generate a JSON manifest of all completed downloads to a downloadable .json file
    const exportToLocal = (ids) => {
        const toExport = downloads.filter(dl => ids.has(dl.id) || (!ids.size));
        const completed = toExport.filter(dl => dl.status === "completed");
        if (completed.length === 0) {
            setExportMsg("⚠️ No completed downloads to export.");
            setTimeout(() => setExportMsg(""), 3000);
            return;
        }

        const manifest = {
            exportedBy: "Nerio Stream",
            exportedAt: new Date().toISOString(),
            version: "1.0",
            count: completed.length,
            downloads: completed.map(dl => ({
                id: dl.id,
                title: dl.title,
                type: dl.type,
                quality: dl.quality,
                size: dl.size,
                duration: dl.duration,
                downloadedAt: dl.downloadedAt,
                thumbnail: dl.thumbnail,
            }))
        };

        const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nerio-downloads-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setExportMsg(`✅ Exported ${completed.length} file(s) to your local storage!`);
        setTimeout(() => setExportMsg(""), 4000);
    };

    const addNewDownload = () => {
        const newDl = {
            id: `dl_${Date.now()}`,
            title: "Oppenheimer (2023)",
            type: "movie",
            quality: "4K HDR",
            size: "18.2 GB",
            sizeBytes: 19542794240,
            progress: 0,
            status: "downloading",
            thumbnail: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            downloadedAt: new Date().toISOString(),
            duration: "180 min",
            blob: null
        };
        const updated = [newDl, ...downloads];
        saveDownloads(updated);
        setDownloads(updated);
    };

    const storagePercent = storageInfo.total > 0 ? (storageInfo.used / storageInfo.total) * 100 : 18;
    const totalDownloadedBytes = downloads.filter(d => d.status === "completed").reduce((acc, d) => acc + (d.sizeBytes || 0), 0);

    return (
        <div className="downloads-page">
            {/* Header */}
            <div className="dl-header">
                <div>
                    <h1 className="dl-title">📥 My Downloads</h1>
                    <p className="dl-subtitle">Manage your offline content and export to local storage</p>
                </div>
                <div className="dl-header-actions">
                    <button className="dl-action-btn primary" onClick={addNewDownload}>
                        ＋ Add Download
                    </button>
                    <button className="dl-action-btn" onClick={() => exportToLocal(selectedIds)}>
                        📤 Export {selectedIds.size > 0 ? `(${selectedIds.size})` : "All"}
                    </button>
                </div>
            </div>

            {exportMsg && (
                <div className="dl-toast">{exportMsg}</div>
            )}

            {/* Storage Stats */}
            <div className="dl-stats-grid">
                <div className="dl-stat-card">
                    <div className="dl-stat-icon">💾</div>
                    <div>
                        <div className="dl-stat-value">{formatBytes(totalDownloadedBytes)}</div>
                        <div className="dl-stat-label">Downloaded</div>
                    </div>
                </div>
                <div className="dl-stat-card">
                    <div className="dl-stat-icon">✅</div>
                    <div>
                        <div className="dl-stat-value">{downloads.filter(d => d.status === "completed").length}</div>
                        <div className="dl-stat-label">Completed</div>
                    </div>
                </div>
                <div className="dl-stat-card">
                    <div className="dl-stat-icon">⬇️</div>
                    <div>
                        <div className="dl-stat-value">{downloads.filter(d => d.status === "downloading").length}</div>
                        <div className="dl-stat-label">Active</div>
                    </div>
                </div>
                <div className="dl-stat-card storage-card">
                    <div className="dl-stat-icon">🗂️</div>
                    <div style={{ flex: 1 }}>
                        <div className="dl-stat-value">{Math.round(storagePercent)}% Used</div>
                        <div className="dl-stat-label">Browser Storage</div>
                        <div className="storage-bar-wrap">
                            <div className="storage-bar" style={{ width: `${Math.min(storagePercent, 100)}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="dl-controls">
                <div className="dl-filters">
                    {["all", "completed", "downloading", "paused"].map(f => (
                        <button
                            key={f}
                            className={`dl-filter-btn ${filter === f ? "active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === "all" ? "All" : f === "completed" ? "✅ Completed" : f === "downloading" ? "⬇️ Downloading" : "⏸ Paused"}
                            <span className="dl-filter-count">
                                {downloads.filter(d => f === "all" ? true : d.status === f).length}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="dl-sort">
                    <span>Sort:</span>
                    <select className="dl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="date">Date Added</option>
                        <option value="size">File Size</option>
                        <option value="name">Name A–Z</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {filtered.length > 0 && (
                <div className="dl-bulk-bar">
                    <label className="dl-check-label">
                        <input
                            type="checkbox"
                            checked={selectedIds.size === filtered.length && filtered.length > 0}
                            onChange={selectAll}
                        />
                        Select All ({filtered.length})
                    </label>
                    {selectedIds.size > 0 && (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className="dl-action-btn" onClick={() => exportToLocal(selectedIds)}>
                                📤 Export Selected
                            </button>
                            <button className="dl-action-btn danger" onClick={() => deleteDownload(selectedIds)}>
                                🗑 Delete ({selectedIds.size})
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Download List */}
            <div className="dl-list">
                {filtered.length === 0 ? (
                    <div className="dl-empty">
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
                        <h3>No downloads here yet</h3>
                        <p>Download movies and episodes to watch offline anytime.</p>
                    </div>
                ) : (
                    filtered.map(dl => (
                        <div key={dl.id} className={`dl-item ${selectedIds.has(dl.id) ? "selected" : ""}`}>
                            <label className="dl-item-check">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(dl.id)}
                                    onChange={() => toggleSelect(dl.id)}
                                />
                            </label>

                            <div className="dl-thumb-wrap">
                                <img src={dl.thumbnail} alt={dl.title} className="dl-thumb" />
                                <div className={`dl-status-badge ${dl.status}`}>
                                    {dl.status === "completed" ? "✅" : dl.status === "downloading" ? "⬇️" : "⏸"}
                                </div>
                            </div>

                            <div className="dl-info">
                                <div className="dl-item-title">{dl.title}</div>
                                <div className="dl-item-meta">
                                    <span className={`dl-quality-tag quality-${dl.quality.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`}>
                                        {dl.quality}
                                    </span>
                                    <span>🕐 {dl.duration}</span>
                                    <span>📦 {dl.size}</span>
                                    <span>🕒 {timeAgo(dl.downloadedAt)}</span>
                                </div>

                                {dl.status !== "completed" && (
                                    <div className="dl-progress-wrap">
                                        <div className="dl-progress-bar">
                                            <div
                                                className={`dl-progress-fill ${dl.status}`}
                                                style={{ width: `${dl.progress}%` }}
                                            />
                                        </div>
                                        <span className="dl-progress-text">{dl.progress}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="dl-item-actions">
                                {dl.status === "completed" && (
                                    <>
                                        <button className="dl-icon-btn play" title="Play Offline" onClick={() => alert(`Playing: ${dl.title}`)}>▶</button>
                                        <button className="dl-icon-btn export" title="Export to Local Storage" onClick={() => exportToLocal(new Set([dl.id]))}>📤</button>
                                    </>
                                )}
                                {dl.status === "downloading" && (
                                    <button className="dl-icon-btn pause" title="Pause" onClick={() => pauseResume(dl.id)}>⏸</button>
                                )}
                                {dl.status === "paused" && (
                                    <button className="dl-icon-btn resume" title="Resume" onClick={() => pauseResume(dl.id)}>▶</button>
                                )}
                                {dl.status === "error" && (
                                    <button className="dl-icon-btn retry" title="Retry" onClick={() => retryDownload(dl.id)}>🔄</button>
                                )}
                                <button className="dl-icon-btn delete" title="Delete" onClick={() => deleteDownload(new Set([dl.id]))}>🗑</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Export Info Panel */}
            <div className="dl-export-info">
                <h3>📤 About Export to Local Storage</h3>
                <p>
                    Exporting generates a <strong>JSON manifest</strong> file that is saved directly to your device's local file system. This manifest contains metadata about each downloaded title, including quality, duration, and timestamps. You can use this file to:
                </p>
                <ul>
                    <li>🗄️ Back up your download library</li>
                    <li>📂 Import into another device or app</li>
                    <li>📊 Analyze your viewing patterns offline</li>
                    <li>🔄 Restore your library after reinstalling</li>
                </ul>
                <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.85rem" }}>
                    Note: Due to browser security policies, actual video file extraction is managed through the DRM layer. The export includes the manifest for re-authorization.
                </p>
            </div>
        </div>
    );
}
