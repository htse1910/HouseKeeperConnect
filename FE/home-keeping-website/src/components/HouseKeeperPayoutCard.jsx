import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/ScheduleManagementCard.css"; // Reuse existing styling

const HouseKeeperPayoutCard = () => {
  return (
    <div className="col-md-6">
      <Link to="/housekeeper/payouts" className="schedule-management-card">
        <FaMoneyBillWave className="text-success fs-3 me-3" />
        <div>
          <h5 className="fw-semibold mb-0">Thu nhập của tôi</h5>
          <p className="text-muted small">Xem và quản lý khoản thanh toán</p>
        </div>
      </Link>
    </div>
  );
};

export default HouseKeeperPayoutCard;