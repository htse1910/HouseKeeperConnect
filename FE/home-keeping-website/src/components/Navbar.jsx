import { Link } from 'react-router-dom';
import { FaGlobe } from 'react-icons/fa'; // Import the globe icon
import logo from './images/logo.png';

function Navbar() {
  return (
    <>
      {/* Inline styles for hover effect */}
      <style>
        {`
          .login-btn:hover {
            background-color: #ffc107; /* Yellow background */
            color: #ffffff !important; /* White text */
            border-color: #ffc107; /* Match border to the background */
          }
        `}
      </style>

      <nav
        className="navbar navbar-expand-lg bg-white"
        style={{
          borderBottom: '2px solid orange', // Thin orange bottom border
        }}
      >
        <div className="container">
          {/* Logo and Brand Name */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="PCHWF Logo" width="40" height="40" className="me-2" />
            <span className="fw-bold text-black">PCHWF</span>
          </Link>

          {/* Toggle Button for Mobile View */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link fw-bold text-dark mx-3" to="/">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold text-dark mx-3" to="/about">Giới thiệu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold text-dark mx-3" to="/how-it-works">Cách hoạt động</Link>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="d-flex align-items-center">
            {/* Globe Icon */}
            <FaGlobe className="text-black me-2" size={14} />
            <Link
              className="btn btn-outline-warning text-warning fw-bold mx-2 login-btn"
              to="/login"
            >
              Đăng nhập
            </Link>
            <Link className="btn btn-warning text-white fw-bold" to="/register">
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
