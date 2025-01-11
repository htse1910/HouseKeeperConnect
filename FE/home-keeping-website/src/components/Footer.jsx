function Footer() {
  return (
    <footer
      className="bg-light"
      style={{
        borderTop: '4px solid orange',
        paddingTop: '3rem',
        paddingBottom: '13rem',
        minHeight: '200px',
      }}
    >
      <div className="container">
        <div className="row align-items-start">
          {/* Left Section: Header and Search Bar */}
          <div className="col-md-4">
            <h2 className="fw-bold">Chúc bạn một ngày mới không nhuốm bụi trần.</h2>
            <div
              className="mt-4"
              style={{
                border: '1px solid black',
                borderRadius: '5px',
                display: 'flex',
                overflow: 'hidden', // Ensures button and input are part of the same box
              }}
            >
              <input
                type="email"
                className="form-control border-0"
                placeholder="Email của bạn"
                style={{
                  height: '46px',
                  fontSize: '14px',
                  borderRight: '1px solid black', // Separator between input and button
                }}
              />
              <button
                className="btn btn-warning text-white"
                style={{
                  height: '46px',
                  padding: '0 16px',
                  fontSize: '14px',
                  border: 'none',
                }}
              >
                Nhận tư vấn
              </button>
            </div>
          </div>

          {/* Right Section: Two Vertical Lists */}
          <div className="col-md-3 offset-md-1">
            <h5 className="fw-bold text-warning">PCHWF</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">Giới thiệu</a></li>
              <li><a href="#" className="text-muted">Phương thức liên lạc</a></li>
              <li><a href="#" className="text-muted">Điều khoản sử dụng</a></li>
              <li><a href="#" className="text-muted">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-muted">FAQ</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="fw-bold text-warning">Dịch vụ</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">Tìm người giúp việc</a></li>
              <li><a href="#" className="text-muted">Tìm công việc</a></li>
              <li><a href="#" className="text-muted">Yêu cầu hỗ trợ</a></li>
              <li><a href="#" className="text-muted">Khiếu nại</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
