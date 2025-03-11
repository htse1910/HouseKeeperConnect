import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaFilter, FaPlus, FaClock, FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { jobs, schedule, statistics, paymentDetails } from "../data/HousekeeperData.jsx";
import "../assets/styles/Dashboard.css";

function HousekeeperDashboard() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState(""); // State lưu tên user

  // Gọi API lấy thông tin user
  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "Người dùng";
    setUserName(storedName);

    /* axios.get("/api/user/profile")
      .then(response => setUserName(response.data.name))
      .catch(error => console.error("Lỗi khi tải thông tin user:", error)); */
  }, []);

  // Xử lý hiển thị star-icon trong thông tin thống kê
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Số sao đầy
    const hasHalfStar = rating % 1 !== 0; // Kiểm tra có sao nửa không

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={index} className="star-icon" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="star-icon" />}
      </>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2 className="welcome-message">{t("dashboard_welcome_message", { name: userName || "..." })}</h2>
        <p className="welcome-detail">{t("dashboard_welcome_detail_housekeeper")}</p>

        {/* Thống kê */}
        <div className="dashboard-cards">
          {statistics.map((stat, index) => (
            <div className="dashboard-card" key={index}>
              <span className="dashboard-card-title">{t(stat.label)}</span>
              <div className="dashboard-card-value">
                {stat.value} {stat.label === "dashboard_stats.rating" && renderStars(stat.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Công việc khả dụng */}
      <div className="available-jobs">
        <div className="available-jobs-header">
          <h2>{t("dashboard_jobs.available")}</h2>
          <div className="available-jobs-actions">
            <button className="filter-btn">
              <FaFilter /> {t("dashboard_jobs.filter")}
            </button>
            <button className="add-job-btn">
              <FaPlus /> {t("dashboard_jobs.find")}
            </button>
          </div>
        </div>

        <div className="job-list">
          {jobs.map((job, index) => (
            <div className="job-card" key={index}>
              <div className="job-header">
                <h3 className="job-title">{t(job.title)}</h3>
                <span className="salary">{job.salary}/ngày</span>
              </div>
              <div className="job-info">
                <p>{job.location}</p>
                <div className="job-details">
                  <span><FaClock /> {job.hours} giờ</span>
                  <span><FaCalendarAlt /> {job.date}</span>
                </div>
              </div>
              <button className="detail-btn">{t("dashboard_jobs.view_details")}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Lịch làm việc & Thanh toán */}
      <div className="dashboard-grid">
        <div className="work-schedule">
          <h2>{t("dashboard_schedule.title")}</h2>
          <div className="schedule-list">
            {schedule.map((item, index) => (
              <div key={index} className="schedule-item">
                <span className="schedule-icon">🧹</span>
                <div className="schedule-item-details">
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.time[0])}, {item.time[1]}</p> {/* Dịch phần ngày, giữ nguyên giờ */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="payment-info">
          <h2>{t("dashboard_payment.title")}</h2>
          <div className="payment-details">
            {paymentDetails.map((detail, index) => (
              <div className="payment-row" key={index}>
                <span>{t(detail.label)}</span>
                <span className={detail.highlight ? "green-text" : ""}>{detail.value}</span>
              </div>
            ))}
          </div>
          <button className="withdraw-btn">{t("dashboard_payment.withdraw")}</button>
        </div>
      </div>
    </div>
  );
}

export default HousekeeperDashboard;
