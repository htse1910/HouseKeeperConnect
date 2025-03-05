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
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Trang chủ</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Liên hệ</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Điều khoản</a></li>
              <li><a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-md-4 text-center">
            <h5 className="fw-bold text-warning">Thông tin liên lạc</h5>
            <ul className="list-unstyled mt-3 text-muted">
              <li>📧 support@example.com</li>
              <li>📞 (+84) XXX-XXX-XXXX</li>
              <li>📍 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 text-end">
            <h5 className="fw-bold text-warning">Liên hệ với chúng tôi qua:</h5>
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
          <p className="text-muted mt-3">© 2025 PCHWF. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
