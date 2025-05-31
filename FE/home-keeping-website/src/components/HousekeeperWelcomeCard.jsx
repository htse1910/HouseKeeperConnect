import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCheckCircle,
  FaCheckDouble,
  FaRocket,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/HousekeeperWelcomeCard.css";
import API_BASE_URL from "../config/apiConfig";
import { useNavigate } from "react-router-dom";

const HousekeeperWelcomeCard = () => {
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [jobsAccepted, setJobsAccepted] = useState(0);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const fullName = localStorage.getItem("userName") || "Người dùng";
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(async data => {
        localStorage.setItem("housekeeperID", data.housekeeperID);
        localStorage.setItem("verifyID", data.verifyID);
        const completed = data.jobCompleted || 0;
        setJobsCompleted(completed);
        localStorage.setItem("jobCompleted", completed.toString());


        await fetch(`${API_BASE_URL}/Application/CountAcceptedApplicationsByAccountID?accountID=${accountID}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
          .then(res => res.ok ? res.json() : 0)
          .then(setJobsAccepted)
          .catch(() => setJobsAccepted(0));
      })
      .catch(console.error);
  }, [accountID, authToken]);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="card shadow-sm border-0 p-4">
        {/* Welcome Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold mb-1">👋 Chào mừng trở lại, {fullName}!</h4>
            <p className="text-muted mb-0">Hãy khám phá các cơ hội công việc dành cho bạn.</p>
          </div>
          <Link to="/my-jobs" className="btn btn-outline-secondary rounded-pill">
            Quản lý đơn ứng tuyển của tôi
          </Link>
        </div>

        {/* Stats */}
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm h-100">
              <div className="text-muted small mb-1">Số lượng công việc đã hoàn thành</div>
              <div className="d-flex align-items-center">
                <span className="fs-4 fw-bold">{jobsCompleted}</span>
                <FaCheckDouble className="ms-auto text-success fs-5" />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm h-100">
              <div className="text-muted small mb-1">Đã nhận việc</div>
              <div className="d-flex align-items-center">
                <span className="fs-4 fw-bold">{jobsAccepted}</span>
                <FaCheckCircle className="ms-auto text-success fs-5" />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm h-100 d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Công việc chờ bạn</div>
                <span className="fs-5 fw-bold">2M+</span>
              </div>
              <Link to="/jobs" className="btn btn-warning text-white fw-semibold rounded-pill px-3">
                <FaRocket className="me-1" />
                Tìm việc
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Link to="/housekeeper/bookings" className="btn btn-primary rounded-pill px-4 fw-semibold">
            Quản lý công việc
          </Link>
        </div>
      </div>
    </>
  );
};

export default HousekeeperWelcomeCard;