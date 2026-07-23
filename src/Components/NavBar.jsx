import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">🎬 Nerio Stream</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
          Movies
        </NavLink>
        <NavLink to="/trending" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          🔥 Trending
        </NavLink>
        <NavLink to="/tv" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          📺 TV Shows
        </NavLink>
        <NavLink to="/live" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          📡 Live & Sports
        </NavLink>
        <NavLink to="/favourites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          ❤️ Favorites
        </NavLink>
        {deferredPrompt && (
          <button className="nav-install-btn" onClick={handleInstallClick}>
            📱 Install App
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;