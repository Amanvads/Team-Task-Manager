import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../api";

function Navbar() {
  const user = getUser();
  const location = useLocation();
  const navigate = useNavigate();

  const hideOnAuthPages =
    location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  if (hideOnAuthPages) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>Team Task Manager</h2>
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects">Projects</Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {user && (
          <>
            <span>
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;