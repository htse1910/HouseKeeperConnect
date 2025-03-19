import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/SearchJobsCard.css"; // Ensure styling is applied

const SearchJobsCard = () => {
  return (
    <div className="col-md-6">
      <Link to="/jobs" className="search-jobs-card">
        <FaSearch className="text-warning fs-3 me-3" />
        <div>
          <h5 className="fw-semibold mb-0">Tìm công việc</h5>
          <p className="text-muted small">Khám phá các cơ hội việc làm mới</p>
        </div>
      </Link>
    </div>
  );
};

export default SearchJobsCard;
