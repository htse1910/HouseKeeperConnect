import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom"; // Thay vì window.location
import "../assets/styles/Footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { UserRoleContext } from "./UserRoleProvider";

function Footer() {
  const { userRole } = useContext(UserRoleContext);
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const isLandingPage = (location.pathname === "/" || location.pathname === "/about") && userRole === "guest";

  return (
    <footer className="footer">
      {isLandingPage && (
        <div className="footer-content">
          <div className="footer-section">
            <h3>Đường dẫn nhanh</h3>
            <ul>
              <li><Link to="/about">Giới thiệu</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/contact">Phương thức liên lạc</Link></li>
              <li><Link to="/terms">Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div className="footer-section subscribe-section">
            <h3>Nhận thông tin và ưu đãi mới nhất từ PCHWF</h3>
            <div className="subscribe">
              <input type="email" placeholder="Nhập email của bạn để được thông báo" />
              <button>Theo dõi</button>
            </div>
          </div>
          <div className="footer-section">
            <h3>Liên hệ với chúng tôi</h3>
            <div className="social-icons">
              <FaFacebook />
              <FaInstagram />
              <FaTwitter />
            </div>
          </div>
        </div>
      )}
      <div className="footer-bottom">
        <hr />
        <p>© 2025 Housekeeping Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
