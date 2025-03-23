import React from "react";
import { FaBriefcase, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import HousekeeperWelcomeCard from "../components/HousekeeperWelcomeCard";
import SearchJobsCard from "../components/SearchJobsCard";
import ScheduleManagementCard from "../components/ScheduleManagementCard";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import NotificationsCard from "../components/NotificationsCard";

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
          <NotificationsCard />
        </div>

        {/* Recent Transactions */}
        <div className="col-md-6">
          <RecentTransactionsCard />
        </div>
      </div>
    </div>
  );
};

export default HousekeeperDashboard;
