import React from 'react';
import { FaUserPlus, FaQuestionCircle, FaHandshake, FaStar } from 'react-icons/fa';

function HomePageUsersGuides() {
  return (
    <section style={{ backgroundColor: 'white', padding: '3rem 0' }}>
      <div className="container text-center">
        <h2 className="fw-bold" style={{ color: '#FF7F00' }}>PCHWF Hoạt động như thế nào?</h2>
        <p className="text-muted mt-3">
          Quy trình đơn giản, hiệu quả để bắt đầu sử dụng nền tảng của chúng tôi
        </p>
        <div className="row mt-5">
          {/* Step 1 */}
          <div className="col-md-3 d-flex">
            <div className="p-4 bg-white rounded shadow flex-fill">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <FaUserPlus className="text-warning" size={32} />
                </span>
              </div>
              <h5 className="fw-bold">Đăng ký tài khoản</h5>
              <p className="text-muted">
                Tạo tài khoản miễn phí trong vài phút với thông tin cơ bản của bạn
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-md-3 d-flex">
            <div className="p-4 bg-white rounded shadow flex-fill">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <FaQuestionCircle className="text-warning" size={32} />
                </span>
              </div>
              <h5 className="fw-bold">Xác thực thông tin</h5>
              <p className="text-muted">
                Hoàn thành xác minh danh tính để đảm bảo an toàn cho cộng đồng
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-md-3 d-flex">
            <div className="p-4 bg-white rounded shadow flex-fill">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <FaHandshake className="text-warning" size={32} />
                </span>
              </div>
              <h5 className="fw-bold">Kết nối đối tác</h5>
              <p className="text-muted">
                Tìm kiếm và kết nối với đối tác phù hợp nhất với nhu cầu của bạn
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="col-md-3 d-flex">
            <div className="p-4 bg-white rounded shadow flex-fill">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <FaStar className="text-warning" size={32} />
                </span>
              </div>
              <h5 className="fw-bold">Thanh toán & Đánh giá</h5>
              <p className="text-muted">
                Hoàn tất thanh toán an toàn và chia sẻ đánh giá trải nghiệm của bạn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageUsersGuides;
