import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import HousekeeperWelcomeCard from "../components/HousekeeperWelcomeCard";
import SearchJobsCard from "../components/SearchJobsCard";
import ScheduleManagementCard from "../components/ScheduleManagementCard";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import NotificationsCard from "../components/NotificationsCard";
import ScrollToTopButton from "../components/ScrollToTopButton";

const HousekeeperDashboard = () => {
  return (
    <div className="container py-4 position-relative">
      <ScrollToTopButton />

      <HousekeeperWelcomeCard />

      <div className="row mt-4">
        <SearchJobsCard />
        <ScheduleManagementCard />
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <NotificationsCard />
        </div>
        <div className="col-md-6">
          <RecentTransactionsCard />
        </div>
      </div>
    </div>
  );
};

export default HousekeeperDashboard;
