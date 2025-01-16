import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa'; // Import necessary icons
import logo from './images/logo.png';

function Navbar() {
  const userRole = localStorage.getItem('userRole'); // Get the user role from localStorage

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <style>
        {`
          .login-btn:hover {
            background-color: #ffc107;
            color: #ffffff !important;
            border-color: #ffc107;
          }
        `}
      </style>

      <nav
        className="navbar navbar-expand-lg bg-white"
        style={{
          borderBottom: '2px solid orange',
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

              {userRole === 'Người giúp việc' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/find-jobs">Tìm công việc</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/my-jobs">Công việc của tôi</Link>
                  </li>
                </>
              )}

              {userRole === 'Gia đình' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/post-jobs">Đăng công việc</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/posted-jobs">Công việc đã đăng</Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link className="nav-link fw-bold text-dark mx-3" to="/messages">Tin nhắn</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold text-dark mx-3" to="/support">Hỗ trợ</Link>
              </li>
            </ul>
          </div>

          {/* Conditional Rendering */}
          <div className="d-flex align-items-center">
            {userRole ? (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="accountDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: '1px solid #ddd', borderRadius: '50%' }}
                >
                  <FaUserCircle size={24} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  className="btn btn-outline-warning text-warning fw-bold mx-2 login-btn"
                  to="/login"
                >
                  Đăng nhập
                </Link>
                <Link className="btn btn-warning text-white fw-bold" to="/register">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
