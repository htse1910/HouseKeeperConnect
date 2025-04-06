import React, { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaClock, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/HousekeeperWelcomeCard.css";

const HousekeeperWelcomeCard = () => {
  const [fullName, setFullName] = useState("...");
  const [jobsPending, setJobsPending] = useState(0);
  const [jobsAccepted, setJobsAccepted] = useState(0);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    // Fetch account name
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setFullName(data.name || "Người dùng");
      })
      .catch(error => console.error("Lỗi khi lấy dữ liệu tài khoản:", error));

    // Fetch housekeeper info + application stats
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(async (data) => {
        localStorage.setItem("housekeeperID", data.housekeeperID);
        localStorage.setItem("verifyID", data.verifyID);

        // Get applications
        const resApp = await fetch(
          `http://localhost:5280/api/Application/GetApplicationsByAccountID?uid=${data.housekeeperID}&pageNumber=1&pageSize=1000`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const apps = await resApp.json();
        setJobsPending(apps.filter(app => app.status === 1).length);
        setJobsAccepted(apps.filter(app => app.status === 2).length);
      })
      .catch(error => console.error("Lỗi khi lấy dữ liệu ứng tuyển:", error));
  }, [accountID, authToken]);

  return (
    <div className="card shadow-sm border-0 p-4">
      {/* Welcome Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="fw-bold mb-1">👋 Chào mừng trở lại, {fullName}!</h4>
          <p className="text-muted mb-0">Hãy khám phá các cơ hội công việc dành cho bạn.</p>
        </div>
        <Link to="/my-jobs" className="btn btn-outline-secondary rounded-pill">
          Quản lý công việc của tôi
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mt-2">
        {/* Pending Applications */}
        <div className="col-md-4">
          <div className="p-3 border rounded shadow-sm h-100">
            <div className="text-muted small mb-1">Đang chờ duyệt</div>
            <div className="d-flex align-items-center">
              <span className="fs-4 fw-bold">{jobsPending}</span>
              <FaClock className="ms-auto text-info fs-5" />
            </div>
          </div>
        </div>

        {/* Accepted Applications */}
        <div className="col-md-4">
          <div className="p-3 border rounded shadow-sm h-100">
            <div className="text-muted small mb-1">Đã nhận việc</div>
            <div className="d-flex align-items-center">
              <span className="fs-4 fw-bold">{jobsAccepted}</span>
              <FaCheckCircle className="ms-auto text-success fs-5" />
            </div>
          </div>
        </div>

        {/* Explore Jobs */}
        <div className="col-md-4">
          <div className="p-3 border rounded shadow-sm h-100 d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small mb-1">Công việc chờ bạn</div>
              <span className="fs-5 fw-bold">2M+</span>
            </div>
            <Link to="/housekeeper/jobs" className="btn btn-warning text-white fw-semibold rounded-pill px-3">
              <FaRocket className="me-1" />
              Tìm việc
            </Link>
          </div>
        </div>
      </div>

      {/* Booking Management */}
      <div className="mt-4 text-end">
        <Link to="/housekeeper/bookings" className="btn btn-primary rounded-pill px-4 fw-semibold">
          Quản lý đặt lịch
        </Link>
      </div>
    </div>
  );
};

export default HousekeeperWelcomeCard;
