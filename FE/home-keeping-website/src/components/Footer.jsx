import { FaFacebook, FaTwitter, FaInstagram, FaTelegram, FaGoogle } from "react-icons/fa";

function Footer() {
  return (
    <footer
      className="bg-light"
      style={{
        borderTop: "4px solid orange",
        paddingTop: "3rem",
        paddingBottom: "1rem",
      }}
    >
      <div className="container">
        <div className="row align-items-start">
          {/* Left Section: Header, Search Bar, and Social Media Icons */}
          <div className="col-md-4">
            <h2 className="fw-bold">Chúc bạn một ngày mới không nhuốm bụi trần.</h2>
            <div
              className="mt-4"
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <input
                type="email"
                className="form-control border-0"
                placeholder="Để lại email của bạn"
                style={{
                  height: "46px",
                  fontSize: "14px",
                  borderRight: "1px solid black",
                }}
              />
              <button
                className="btn btn-warning text-white"
                style={{
                  height: "46px",
                  padding: "0 16px",
                  fontSize: "14px",
                  border: "none",
                }}
              >
                Nhận tư vấn
              </button>
            </div>
            {/* Social Media Icons */}
            <div className="d-flex mt-3 gap-3">
              <FaFacebook size={24} color="orange" />
              <FaTwitter size={24} color="orange" />
              <FaInstagram size={24} color="orange" />
              <FaTelegram size={24} color="orange" />
              <FaGoogle size={24} color="orange" />
            </div>
          </div>

          {/* Right Section: Two Vertical Lists */}
          <div className="col-md-7 d-flex justify-content-end gap-5">
            <div>
              <h5 className="fw-bold text-warning">PCHWF</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Phương thức liên lạc
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="fw-bold text-warning">Dịch vụ</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Tìm người giúp việc
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Tìm công việc
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Yêu cầu hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted" style={{ textDecoration: "none" }}>
                    Khiếu nại
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Thin Black Border */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "black",
          margin: "2rem 0", // Spacing between content and button
        }}
      ></div>

      {/* Contact Us Button */}
      <div className="d-flex justify-content-end container">
        <button
          className="btn btn-outline-warning fw-bold"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
          }}
        >
          Liên hệ với chúng tôi
        </button>
      </div>
    </footer>
  );
}

export default Footer;
