import { Link } from 'react-router-dom';
import logo from './logo.png'; // Ensure your logo file is in the public folder or adjust the path accordingly.

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-secondary">
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
              <Link className="nav-link text-dark fw-normal mx-2" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-normal mx-2" to="/jobs">Công việc</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-normal mx-2" to="/helpers">Người giúp việc</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-normal mx-2" to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="d-flex">
          <Link className="btn btn-outline-warning text-warning fw-bold mx-2" to="/login">
            Đăng nhập
          </Link>
          <Link className="btn btn-warning text-white fw-bold" to="/register">
            Đăng ký
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
