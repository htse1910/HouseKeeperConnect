import React from "react";
import { FaBriefcase, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import HousekeeperWelcomeCard from "../components/HousekeeperWelcomeCard";
import SearchJobsCard from "../components/SearchJobsCard";
import ScheduleManagementCard from "../components/ScheduleManagementCard";

const HousekeeperDashboard = () => {
  return (
    <div className="container py-4">
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
            <p className="text-muted text-center mt-3">Sẽ cập nhật sớm nhất</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-semibold">Giao dịch gần đây</h5>
            <p className="text-muted text-center mt-3">Sẽ cập nhật sớm nhất</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeeperDashboard;
