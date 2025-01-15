import React from 'react';

function HomePageUsersDesire() {
  return (
    <section style={{ backgroundColor: '#FFEFD5', padding: '3rem 0' }}>
      <div className="container text-center">
        <h2 className="fw-bold" style={{ color: '#FF7F00' }}>Tại sao bạn yêu cầu chúng tôi?</h2>
        <div className="row mt-5">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle bg-warning p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <i className="fas fa-shield-alt text-orange"></i>
                </span>
              </div>
              <h5 className="fw-bold">Chuyên gia đáng tin cậy</h5>
              <p className="text-muted">
                Tất cả người giúp việc đều được xác minh vì sự an toàn của bạn
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle bg-warning p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <i className="fas fa-tasks text-orange"></i>
                </span>
              </div>
              <h5 className="fw-bold">Dịch vụ tuỳ chỉnh</h5>
              <p className="text-muted">
                Điều chỉnh công việc vệ sinh phù hợp với nhu cầu của bạn
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow">
              <div className="mb-3">
                <span
                  className="d-inline-block rounded-circle bg-warning p-3"
                  style={{ backgroundColor: '#FFE4B5' }}
                >
                  <i className="fas fa-credit-card text-orange"></i>
                </span>
              </div>
              <h5 className="fw-bold">Thanh toán an toàn</h5>
              <p className="text-muted">
                Phương thức thanh toán nhanh chóng và an toàn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePageUsersDesire;
