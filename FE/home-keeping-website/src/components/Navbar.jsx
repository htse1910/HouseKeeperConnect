import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import logo from './images/logo.png';

function Navbar() {
  const userRoleID = localStorage.getItem('userRoleID'); // Get the user role ID from localStorage

  const handleLogout = () => {
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
        style={{ borderBottom: '2px solid orange' }}
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
                <Link className="nav-link fw-bold text-dark mx-3" to="/">TRANG CHỦ</Link>
              </li>

              {/* Dynamic Navbar Based on User Role */}
              {userRoleID === '1' ? (
                // Housekeeper
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/find-jobs">TÌM CÔNG VIỆC</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/my-jobs">CÔNG VIỆC CỦA TÔI</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/messages">TIN NHẮN</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/support">HỖ TRỢ</Link>
                  </li>
                </>
              ) : userRoleID === '2' ? (
                // Family
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/post-jobs">ĐĂNG CÔNG VIỆC</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/posted-jobs">CÔNG VIỆC ĐÃ ĐĂNG</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/messages">TIN NHẮN</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/support">HỖ TRỢ</Link>
                  </li>
                </>
              ) : userRoleID === '3' ? (
                // Staff
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/manage-users">QUẢN LÝ NGƯỜI DÙNG</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/reports">BÁO CÁO</Link>
                  </li>
                </>
              ) : userRoleID === '4' ? (
                // Admin
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/admin-dashboard">QUẢN TRỊ</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/system-settings">CÀI ĐẶT HỆ THỐNG</Link>
                  </li>
                </>
              ) : (
                // Guest Links
                <>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/about">GIỚI THIỆU</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link fw-bold text-dark mx-3" to="/faq">CÂU HỎI THƯỜNG GẶP</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Search and Account Options */}
          <div className="d-flex align-items-center">
            {/* Search Button */}
            <button
              type="button"
              className="btn btn-light p-2 border me-2"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
              }}
              onClick={() => alert('Search button clicked!')}
            >
              <FaSearch className="text-black" size={14} />
            </button>

            {/* Conditional Rendering for Account Options */}
            {userRoleID ? (
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
                <Link className="btn btn-outline-warning text-warning fw-bold mx-2 login-btn" to="/login">
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
