import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={{ backgroundColor: 'white', padding: '3rem 0', borderTop: '2px solid orange' }}>
      <div className="container">
        <div className="row">
          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="fw-bold text-warning">Đường dẫn nhanh</h5>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Giới thiệu</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>FAQs</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Phương thức liên lạc</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Điều khoản sử dụng</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-4 text-center">
            <h5 className="fw-bold text-warning">Nhận thông tin và ưu đãi mới nhất từ PCHWF</h5>
            <div className="mt-3 d-flex justify-content-center align-items-center">
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email của bạn để được thông báo"
                style={{ border: '1px solid orange', borderRadius: '5px', marginRight: '10px' }}
              />
              <button className="btn btn-warning text-white fw-bold">Theo dõi</button>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-md-4 text-end">
            <h5 className="fw-bold text-warning">Liên hệ với chúng tôi</h5>
            <div className="mt-3 d-flex justify-content-end gap-3">
              <FaFacebook size={24} color="orange" />
              <FaInstagram size={24} color="orange" />
              <FaTwitter size={24} color="orange" />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 text-center">
          <hr style={{ border: '1px solid orange' }} />
          <p className="text-muted mt-3">© 2025 Housekeeping Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;