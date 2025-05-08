import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import HousekeeperWelcomeCard from "../components/HousekeeperWelcomeCard";
import SearchJobsCard from "../components/SearchJobsCard";
import RecentTransactionsCard from "../components/RecentTransactionsCard";
import NotificationsCard from "../components/NotificationsCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import HouseKeeperPayoutCard from "../components/HouseKeeperPayoutCard";

const HousekeeperDashboard = () => {
  return (
    <div className="container py-4 position-relative">
      <ScrollToTopButton />

      <HousekeeperWelcomeCard />

      <div className="row mt-4">
        <SearchJobsCard />
        <HouseKeeperPayoutCard />
      </div>

      <div className="row mt-4 d-flex">
        <div className="col-md-6 d-flex flex-column">
          <div className="flex-grow-1">
            <NotificationsCard />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column">
          <div className="flex-grow-1">
            <RecentTransactionsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeeperDashboard;
