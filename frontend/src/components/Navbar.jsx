import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Link to="/">
          <span className="logo-icon">🛡️</span>
          <h2>SAR Gen</h2>
        </Link>
      </div>
      <div className="nav-user">
        <span className="welcome-text">Analyst: <strong>{username}</strong></span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
