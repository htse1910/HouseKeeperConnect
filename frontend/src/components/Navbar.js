import React, { useContext, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../assets/styles/Navbar.css";
import logo from "../assets/images/logo.png";
import { FaGlobe, FaSearch, FaBars, FaCaretDown, FaUser, FaSignOutAlt } from "react-icons/fa";
import userAvatar from "../assets/images/default-avatar.png";
import { UserRoleContext } from "./UserRoleProvider";
import { useMenuItems } from "./menuConfig"; // Import menu config

function Navbar() {
  const { t, i18n } = useTranslation();
  const { userRole, setUserRole } = useContext(UserRoleContext);
  const menuItems = useMenuItems(); // Lấy danh sách menu theo role
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false); // State cho menu user
  const langRef = useRef(null);
  const userMenuRef = useRef(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate(); // Hook điều hướng

  // Xử lý khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchVisible(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    setUserRole("guest"); // Reset role về guest
    localStorage.removeItem("userRole"); // Xóa role khỏi localStorage
    navigate("/"); // Quay về trang chủ
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="PCHWF Logo" />
      </div>

      {/* Menu Items */}
      <ul className="navbar-links">
        {menuItems[userRole || "guest"].map((item, index) => (
          <li key={index} className={item.dropdown ? "dropdown" : ""}>
            <a href={item.link}>
              {item.label.toUpperCase()} {item.dropdown && <FaCaretDown className="dropdown-icon" />}
            </a>
          </li>
        ))}
      </ul>

      {/* Ô tìm kiếm */}
      <div className="navbar-search-container" ref={searchRef}>
        {searchVisible && (
          <input type="text" placeholder={t("search")} className="search-input" />
        )}
        <button className="search-btn" onClick={() => setSearchVisible(!searchVisible)}>
          <FaSearch />
        </button>
      </div>

      <div className="navbar-user-container">
        {/* Avatar hoặc Đăng nhập/Đăng ký */}
        <div className="navbar-user"
          ref={userMenuRef}
          onMouseEnter={() => setUserMenuVisible(true)}
          onMouseLeave={() => setUserMenuVisible(false)}>
          {userRole && userRole !== "guest" ? (
            <>
              <img
                src={userAvatar}
                alt="User Avatar"
                className="user-avatar"
              />
              {userMenuVisible && (
                <div className="user-dropdown">
                  <button onClick={() => navigate(`/${userRole}/profile`)}>
                    <FaUser /> {t("profile")}
                  </button>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> {t("logout")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate("/login")}>
                {t("login").toUpperCase()}
              </button>
              <button className="btn-register" onClick={() => navigate("/register")}>
                {t("register").toUpperCase()}
              </button>
            </>
          )}
        </div>

        {/* Language Switcher */}
        <div className="language-switcher" ref={langRef}>
          <button
            className="lang-btn"
            onMouseEnter={() => setDropdownVisible(true)} // Khi hover vào, mở dropdown
            onMouseLeave={() => setDropdownVisible(false)} // Khi rời khỏi, đóng dropdown
          >
            <FaGlobe />
          </button>
          {dropdownVisible && (
            <div className="language-dropdown">
              <button onClick={() => changeLanguage("en")}>English</button>
              <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
            </div>
          )}
        </div>
      </div>

      {/* Nút menu trên mobile */}
      <div className="navbar-menu">
        <FaBars />
      </div>
    </nav>
  );
}

export default Navbar;
