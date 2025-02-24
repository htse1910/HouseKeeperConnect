import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBriefcase, FaUsers, FaPlusSquare, FaCalendarAlt, FaBell, FaEnvelope, FaUserCheck } from 'react-icons/fa';

function DashboardCard() {
  return (
    <div className="card p-4 shadow-sm">
      <h2 className="fw-bold">
        Chào mừng bạn trở lại, <span className="text-dark">Trần Tường Vi!</span>
      </h2>
      <p className="text-secondary">Khám phá những công việc phù hợp với bạn.</p>

      <div className="row mt-3">
        {/* Active Jobs */}
        <div className="col-md-4">
          <div className="bg-light p-3 rounded text-dark position-relative">
            <FaBriefcase className="text-warning fs-4 position-absolute top-0 end-0 m-2" />
            <span className="text-muted d-block">Công việc đang hoạt động</span>
            <h3 className="fw-bold mt-1">15</h3>
          </div>
        </div>

        {/* Number of Applications */}
        <div className="col-md-4">
          <div className="bg-light p-3 rounded text-dark position-relative">
            <FaUsers className="text-warning fs-4 position-absolute top-0 end-0 m-2" />
            <span className="text-muted d-block">Số lượt ứng tuyển</span>
            <h3 className="fw-bold mt-1">8</h3>
          </div>
        </div>

        {/* Account Balance */}
        <div className="col-md-4">
          <div className="bg-light p-3 rounded text-dark position-relative">
            <button className="btn btn-warning position-absolute top-0 end-0 m-2">Nạp tiền</button>
            <span className="text-muted d-block">Số dư tài khoản</span>
            <h3 className="fw-bold mt-1">2,000,000đ</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="card p-4 shadow-sm mt-4">
      <div className="row g-3">
        {/* First Action */}
        <div className="col-md-6">
          <div className="d-flex align-items-start p-3 bg-light rounded">
            <FaPlusSquare className="text-warning fs-4 me-3 mt-1" />
            <div>
              <h5 className="fw-bold mb-1">Đăng công việc mới</h5>
              <p className="text-muted mb-0">Tìm kiếm người giúp việc chất lượng và phù hợp với bạn</p>
            </div>
          </div>
        </div>

        {/* Second Action */}
        <div className="col-md-6">
          <div className="d-flex align-items-start p-3 bg-light rounded">
            <FaCalendarAlt className="text-warning fs-4 me-3 mt-1" />
            <div>
              <h5 className="fw-bold mb-1">Lịch sử thanh toán</h5>
              <p className="text-muted mb-0">Quản lý số dư của bạn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTransactions() {
  return (
    <div className="card p-4 shadow-sm mt-4">
      <div className="row">
        {/* Notifications Section */}
        <div className="col-md-6">
          <h5 className="fw-bold">Thông báo</h5>
          <ul className="list-unstyled">
            <li className="d-flex align-items-start mb-2">
              <FaBell className="text-warning me-2 mt-1" />
              <div>
                <p className="mb-1">Bạn đã nạp 1,000,000 VND vào tài khoản.</p>
                <small className="text-muted">2 giờ trước</small>
              </div>
            </li>
            <li className="d-flex align-items-start mb-2">
              <FaEnvelope className="text-warning me-2 mt-1" />
              <div>
                <p className="mb-1">Bạn có tin nhắn mới từ Nguyễn Thị An</p>
                <small className="text-muted">5 giờ trước</small>
              </div>
            </li>
            <li className="d-flex align-items-start">
              <FaUserCheck className="text-warning me-2 mt-1" />
              <div>
                <p className="mb-1">Nguyễn Thị An đã ứng tuyển vào công việc Giúp việc nhà</p>
                <small className="text-muted">1 ngày trước</small>
              </div>
            </li>
          </ul>
        </div>

        {/* Recent Transactions Section */}
        <div className="col-md-6">
          <h5 className="fw-bold">Giao dịch gần đây</h5>
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col">Ngày</th>
                <th scope="col">Người giúp việc</th>
                <th scope="col">Số tiền</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15/03/2025</td>
                <td>Nguyễn Hạ Vi</td>
                <td>500,000đ</td>
                <td className="text-success fw-bold">Hoàn thành</td>
              </tr>
              <tr>
                <td>14/03/2025</td>
                <td>Trần Văn Huy</td>
                <td>800,000đ</td>
                <td className="text-success fw-bold">Hoàn thành</td>
              </tr>
              <tr>
                <td>13/03/2025</td>
                <td>Đinh Thị Nga</td>
                <td>700,000đ</td>
                <td className="text-success fw-bold">Hoàn thành</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FamilyDashboard() {
  return (
    <div className="container mt-4 mb-4"> {/* Added mb-4 for bottom margin */}
      <DashboardCard />
      <QuickActions />
      <NotificationsTransactions />
    </div>
  );
}

export default FamilyDashboard;
