import { NavLink } from "react-router-dom"; // Change Link to NavLink
import "../css/NavBar.css";
function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">Movie App</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
        <NavLink to="/favourites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Favorites</NavLink>
      </div>
    </nav>
  );
}
export default NavBar;