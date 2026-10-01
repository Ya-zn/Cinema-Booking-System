import { NavLink } from "react-router";
import "./Navbar.css";

function Navbar({ favoriteCount = 0 }) {
  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        <NavLink
          to="/"
          className="navbar-brand"
        >
          <div className="brand-icon">
            <span>▶</span>
          </div>

          <div className="brand-text">
            <strong>Mini</strong>
            <span>Cinema</span>
          </div>
        </NavLink>


        <div className="navbar-links">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            Favorites

            {favoriteCount > 0 && (
              <span className="favorite-count">
                {favoriteCount}
              </span>
            )}
          </NavLink>


          <NavLink
            to="/addMovie"
            className={({ isActive }) =>
              isActive
                ? "add-movie-link add-movie-active"
                : "add-movie-link"
            }
          >
            <span className="add-icon">+</span>
            Add Movie
          </NavLink>

        </div>

      </nav>
    </header>
  );
}

export default Navbar;