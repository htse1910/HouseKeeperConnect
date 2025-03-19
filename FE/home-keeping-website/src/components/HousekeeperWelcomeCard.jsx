import React, { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/HousekeeperWelcomeCard.css"; // Ensure styling for equal height

const HousekeeperWelcomeCard = () => {
  const [fullName, setFullName] = useState("...");
  const [jobsApplied, setJobsApplied] = useState(0);
  const [jobsAccepted, setJobsAccepted] = useState(0);
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    // Fetch Housekeeper Name
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName(data.name || "Người dùng");
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu tài khoản:", error));

    // Fetch Housekeeper Stats (Jobs Applied & Accepted)
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJobsApplied(data.jobsApplied || 0);
        setJobsAccepted(data.jobCompleted || 0);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu công việc:", error));
  }, [accountID, authToken]);

  return (
    <div className="card p-4 shadow-sm">
      {/* Welcome Message */}
      <h2 className="fw-bold">Chào mừng bạn trở lại, {fullName}!</h2>
      <p className="text-muted">Khám phá những công việc phù hợp với bạn.</p>

      {/* Statistics Row */}
      <div className="row mt-3">
        {/* Applied Jobs */}
        <div className="col-md-4">
          <div className="stats-card">
            <p className="text-muted small">Công việc đã ứng tuyển</p>
            <div className="d-flex align-items-center">
              <strong className="fs-4">{jobsApplied}</strong>
              <FaBriefcase className="text-warning fs-5 ms-auto" />
            </div>
          </div>
        </div>

        {/* Accepted Jobs */}
        <div className="col-md-4">
          <div className="stats-card">
            <p className="text-muted small">Công việc đã nhận</p>
            <div className="d-flex align-items-center">
              <strong className="fs-4">{jobsAccepted}</strong>
              <FaCheckCircle className="text-warning fs-5 ms-auto" />
            </div>
          </div>
        </div>

        {/* Available Jobs */}
        <div className="col-md-4">
          <div className="stats-card d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted small">Nhiều công việc chờ bạn khám phá</p>
              <strong className="fs-4">2M+</strong>
            </div>
            <Link to="/housekeeper/jobs" className="btn btn-warning text-white">
              Tìm việc ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeeperWelcomeCard;
