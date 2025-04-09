import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  FaBriefcase,
  FaUsers,
  FaBell,
  FaEnvelope,
  FaUserCheck,
  FaPlusSquare,
  FaCalendarAlt
} from "react-icons/fa";

import "../assets/styles/Dashboard.css";
import "../assets/styles/icon.css";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";
import { formatCurrency, formatDate, formatPhone, formatGender } from "../utils/formatData";

function FamilyDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json"
  };

  const [userName, setUserName] = useState("...");
  const [balance, setBalance] = useState(0);
  const [jobStats, setJobStats] = useState({ activeJobs: 0, applicants: 0 });
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return t("transaction.transactionStatus.pending");
      case 2:
        return t("transaction.transactionStatus.completed");
      case 3:
        return t("transaction.transactionStatus.expired");
      case 4:
        return t("transaction.transactionStatus.cancelled");
      default:
        return t("transaction.transactionStatus.unknown");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "status-pending";
      case 2:
        return "status-approved";
      case 3:
        return "status-expired";
      case 4:
        return "status-cancelled";
      default:
        return "status-unknown";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 1:
        return t("transaction.transactionStatus.deposit");
      case 2:
        return t("transaction.transactionStatus.withdrawal");
      case 3:
        return t("transaction.transactionStatus.payment");
      case 4:
        return t("transaction.transactionStatus.payout");
      default:
        return t("transaction.transactionStatus.unknown");
    }
  };

  useEffect(() => {
    if (!authToken || !accountID) {
      setError(t("error.error_auth"));
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const accRes = await axios.get(
          `http://localhost:5280/api/Account/GetAccount?id=${accountID}`,
          { headers }
        );
        const accData = accRes.data;
        if (!accData?.accountID) throw new Error(t("error.error_auth"));
        setUserName(accData.name || "...");

        try {
          const walletRes = await axios.get(
            `http://localhost:5280/api/wallet/getWallet?id=${accountID}`,
            { headers }
          );
          setBalance(walletRes.data?.balance || 0);
        } catch (walletErr) {
          console.warn("Lỗi khi gọi API ví:", walletErr);
        }

        try {
          const jobsRes = await axios.get(
            `http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}`,
            { headers }
          );
          setJobStats({
            activeJobs: jobsRes.data?.length || 0,
            applicants: jobsRes.data?.totalApplicant || 0
          });
        } catch (jobErr) {
          console.warn("Lỗi khi gọi API job:", jobErr);
        }

        try {
          const notiRes = await axios.get(
            `http://localhost:5280/api/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=1&pageSize=5`,
            { headers }
          );
          const sortedNotis = (notiRes.data || []).sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setNotifications(sortedNotis.slice(0, 5));
        } catch (notiErr) {
          console.warn("Lỗi khi gọi API thông báo:", notiErr);
        }

        try {
          const txRes = await axios.get(
            `http://localhost:5280/api/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=5`,
            { headers }
          );
          setTransactions(txRes.data || []);
        } catch (txErr) {
          console.warn("Lỗi khi gọi API giao dịch:", txErr);
        }

        setError(null);
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        setError(t("error.error_auth"));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const feedback = shouldShowLoadingOrError(loading, error, t);
  if (feedback) return feedback;

  return (
    <div className="dashboard-container">
      <div className="dashboard-box shadow-box">
        <h2 className="dashboard-heading">
          {t("dashboard.dashboard_welcome_message", { name: userName })}
        </h2>
        <p className="dashboard-subtext">{t("dashboard.dashboard_family_subtext")}</p>

        <div className="stat-card-container">
          <div className="stat-card">
            <div>
              <div className="stat-card-label">{t("dashboard.dashboard_active_jobs")}</div>
              <div className="stat-card-value">{jobStats.activeJobs}</div>
            </div>
            <FaBriefcase className="stat-card-icon" />
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-card-label">{t("dashboard.dashboard_applicants")}</div>
              <div className="stat-card-value">{jobStats.applicants}</div>
            </div>
            <FaUsers className="stat-card-icon" />
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-card-label">{t("dashboard.dashboard_balance")}</div>
              <div className="stat-card-value">{formatCurrency(balance, t)}</div>
            </div>
            <button className="btn-primary" onClick={() => navigate("/family/deposit")}>
              {t("dashboard.dashboard_deposit")}
            </button>
          </div>
        </div>
      </div>

      <div className="quick-action-container">
        <div className="quick-action-card" onClick={() => navigate("/family/post-job")}>
          <FaPlusSquare className="quick-action-icon" />
          <div>
            <h5 className="quick-action-title">{t("dashboard.dashboard_post_job")}</h5>
            <p className="quick-action-desc">{t("dashboard.dashboard_post_desc")}</p>
          </div>
        </div>

        <div className="quick-action-card" onClick={() => navigate("/family/transactions")}>
          <FaCalendarAlt className="quick-action-icon" />
          <div>
            <h5 className="quick-action-title">{t("dashboard.dashboard_transaction_history")}</h5>
            <p className="quick-action-desc">{t("dashboard.dashboard_transaction_desc")}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-box">
          <h5 className="dashboard-box-title">{t("uncategorized.notifications")}</h5>
          <ul className="dashboard-notification-list">
            {notifications.length === 0 ? (
              <li className="text-muted">{t("transaction.transactionStatus.no_notifications")}</li>
            ) : (
              notifications.map((noti) => (
                <li key={noti.notificationsID} className="dashboard-notification-item">
                  <FaBell className="icon text-warning" />
                  <div>
                    <p className="dashboard-notification-text">{noti.message}</p>
                    <small className="dashboard-notification-time">
                      {formatDate(noti.createdDate, t)}
                    </small>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="dashboard-box">
          <h5 className="dashboard-box-title">{t("dashboard.dashboard_recent_transactions")}</h5>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>{t("misc.date")}</th>
                <th>{t("transaction.transaction_type")}</th>
                <th>{t("misc.housekeeper")}</th>
                <th>{t("misc.amount")}</th>
                <th>{t("status.status")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    {t("misc.no_transactions")}
                  </td>
                </tr>
              ) : (
                transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{formatDate(tx.createdDate, t)}</td>
                    <td>{getTypeLabel(tx.transactionType)}</td>
                    <td>{tx.receiverName || ""}</td>
                    <td>{formatCurrency(tx.amount, t)}</td>
                    <td className={getStatusClass(tx.status)}>{getStatusLabel(tx.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FamilyDashboardPage;
