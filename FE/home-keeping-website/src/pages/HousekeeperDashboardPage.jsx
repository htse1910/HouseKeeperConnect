import React from "react";
import { FaBriefcase, FaCheckCircle, FaMoneyBillWave, FaSearch, FaCalendarAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import HousekeeperWelcomeCard from "../components/HousekeeperWelcomeCard";
import SearchJobsCard from "../components/SearchJobsCard";
import ScheduleManagementCard from "../components/ScheduleManagementCard";

const HousekeeperDashboard = () => {
  return (
    <div className="container mt-4">
      {/* Welcome Section */}
      <HousekeeperWelcomeCard />

      {/* Job Search & Schedule */}
      <div className="row mt-4">
        <SearchJobsCard />
        <ScheduleManagementCard />
      </div>

      {/* Notifications & Transactions */}
      <div className="row mt-4">
        {/* Notifications */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-semibold">Thông báo</h5>
            <div className="mt-3">
              <div className="d-flex align-items-center text-muted mb-2">
                <FaBriefcase className="text-warning me-2" />
                <p className="mb-0">Gia đình Nguyễn đã mời bạn ứng tuyển</p>
                <span className="ms-auto small">2 giờ trước</span>
              </div>
              <div className="d-flex align-items-center text-muted mb-2">
                <FaCheckCircle className="text-warning me-2" />
                <p className="mb-0">Bạn có tin nhắn mới từ Gia đình Trần</p>
                <span className="ms-auto small">5 giờ trước</span>
              </div>
              <div className="d-flex align-items-center text-muted">
                <FaMoneyBillWave className="text-warning me-2" />
                <p className="mb-0">Thanh toán cho công việc đã hoàn tất</p>
                <span className="ms-auto small">1 ngày trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-semibold">Giao dịch gần đây</h5>
            <table className="table table-borderless mt-3">
              <thead>
                <tr className="text-muted small">
                  <th>Ngày</th>
                  <th>Gia đình</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15/03/2025</td>
                  <td>Gia đình Nguyễn</td>
                  <td>500,000đ</td>
                  <td className="text-success">Hoàn thành</td>
                </tr>
                <tr>
                  <td>14/03/2025</td>
                  <td>Gia đình Trần</td>
                  <td>800,000đ</td>
                  <td className="text-warning">Đang chờ</td>
                </tr>
                <tr>
                  <td>13/03/2025</td>
                  <td>Gia đình Lê</td>
                  <td>700,000đ</td>
                  <td className="text-success">Hoàn thành</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeeperDashboard;
