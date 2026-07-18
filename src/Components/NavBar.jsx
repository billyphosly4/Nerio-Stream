import { NavLink } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">🎬 Nerio Stream</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/trending" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          🔥 Trending
        </NavLink>
        <NavLink to="/favourites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          ❤️ Favorites
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;