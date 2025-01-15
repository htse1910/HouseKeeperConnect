import React from 'react';

function HomePageUserStories() {
  return (
    <section style={{ backgroundColor: '#FFF8F0', padding: '3rem 0' }}>
      <div className="container text-center">
        <h2 className="fw-bold" style={{ color: '#FF7F00' }}>Câu chuyện từ người dùng</h2>
        <p className="text-muted mt-3">
          Khám phá những trải nghiệm thực tế từ các gia đình và người giúp việc đã tin tưởng sử dụng dịch vụ của chúng tôi
        </p>
        <div className="row mt-5">
          {/* Story 1 */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg"
                  alt="Nguyễn Thu Hà"
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px' }}
                />
                <div className="text-start">
                  <h5 className="fw-bold">Nguyễn Thu Hà</h5>
                  <p className="text-muted mb-0">Gia đình</p>
                </div>
              </div>
              <p className="text-muted">
                "Tôi đã tìm được người giúp việc tuyệt vời chỉ sau 2 ngày đăng tin! Dịch vụ rất chuyên nghiệp và đáng tin cậy."
              </p>
              <div className="text-warning">
                ★★★★★
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg"
                  alt="Trần Việt Tú"
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px' }}
                />
                <div className="text-start">
                  <h5 className="fw-bold">Trần Việt Tú</h5>
                  <p className="text-muted mb-0">Người giúp việc</p>
                </div>
              </div>
              <p className="text-muted">
                "PCHWF giúp tôi có thu nhập ổn định hàng tháng. Tôi tìm được những gia đình tuyệt vời để làm việc."
              </p>
              <div className="text-warning">
                ★★★★★
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg"
                  alt="Phạm Văn Đức"
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px' }}
                />
                <div className="text-start">
                  <h5 className="fw-bold">Phạm Văn Đức</h5>
                  <p className="text-muted mb-0">Gia đình</p>
                </div>
              </div>
              <p className="text-muted">
                "Dịch vụ tuyệt vời! Tôi đã giới thiệu PCHWF cho nhiều bạn bè và họ đều rất hài lòng với trải nghiệm này."
              </p>
              <div className="text-warning">
                ★★★★★
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button className="btn btn-warning text-white fw-bold">
            Xem thêm đánh giá →
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomePageUserStories;
