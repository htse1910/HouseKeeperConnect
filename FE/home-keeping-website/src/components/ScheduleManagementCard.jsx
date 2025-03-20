import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/ScheduleManagementCard.css"; // Ensure styling

const ScheduleManagementCard = () => {
  return (
    <div className="col-md-6">
      <Link to="/housekeeper/schedule" className="schedule-management-card">
        <FaCalendarAlt className="text-warning fs-3 me-3" />
        <div>
          <h5 className="fw-semibold mb-0">Lịch trình của tôi</h5>
          <p className="text-muted small">Quản lý lịch làm việc của bạn</p>
        </div>
      </Link>
    </div>
  );
};

export default ScheduleManagementCard;
