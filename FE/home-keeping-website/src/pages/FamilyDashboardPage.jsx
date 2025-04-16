import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  FaBriefcase, FaUsers, FaBell, FaPlusSquare, FaCalendarAlt
} from "react-icons/fa";
import "../assets/styles/Dashboard.css";
import { formatTotalCurrency, getTransactionFormatData } from "../utils/formatData";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed
import { Modal, Button } from "react-bootstrap"; // Make sure it's imported
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function FamilyDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportType, setSupportType] = useState(1);
  const [supportContent, setSupportContent] = useState("");
  const [supportImage, setSupportImage] = useState(null);
  const [sending, setSending] = useState(false);

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

  useEffect(() => {
    if (!authToken || !accountID) {
      setError(t("auth.error_auth"));
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const accRes = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers });
        const accData = accRes.data;
        if (!accData?.accountID) throw new Error(t("auth.error_auth"));
        setUserName(accData.name || "...");

        try {
          const walletRes = await axios.get(`${API_BASE_URL}/wallet/getWallet?id=${accountID}`, { headers });
          const walletData = walletRes.data;
          setBalance(walletData?.balance || 0);
        } catch (walletErr) {
          console.warn("Lỗi khi gọi API ví:", walletErr);
        }

        try {
          const jobsRes = await axios.get(`${API_BASE_URL}/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
          const jobsData = jobsRes.data;
          setJobStats({
            activeJobs: jobsData.length || 0,
            applicants: jobsData.totalApplicant || 0,
          });
        } catch (jobErr) {
          console.warn("Lỗi khi gọi API job:", jobErr);
        }

        try {
          const notiRes = await axios.get(
            `${API_BASE_URL}/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=1&pageSize=5`,
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
            `${API_BASE_URL}/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=5`,
            { headers }
          );
          setTransactions(txRes.data || []);
        } catch (txErr) {
          console.warn("Lỗi khi gọi API giao dịch:", txErr);
        }

        setError(null);
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        setError(t("auth.error_auth"));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || error) {
    return (
      <div className="dashboard-container text-center py-5">
        {loading && (
          <>
            <span className="icon-loading" />
            <p>{t("misc.loading_data")}</p>
          </>
        )}
        {error && (
          <>
            <p className="error">❌ {error}</p>
          </>
        )}
      </div>
    );
  }
  
  const submitSupportRequest = async () => {
    setSending(true);
    const formData = new FormData();
    if (supportImage) formData.append("Picture", supportImage);

    const queryParams = new URLSearchParams({
      RequestedBy: accountID,
      Type: supportType,
      Content: supportContent,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/SupportRequest/AddSupportRequest?${queryParams}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Yêu cầu đã được gửi thành công!");
        setShowSupportModal(false);
        setSupportType(1);
        setSupportContent("");
        setSupportImage(null);
      } else {
        toast.error("Gửi yêu cầu thất bại.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box shadow-box">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="dashboard-heading mb-0">
            {t("dashboard.dashboard_welcome_message", { name: userName })}
          </h2>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={() => setShowSupportModal(true)}
          >
            🛠 {t("dashboard.support_requests") || "Yêu cầu hỗ trợ"}
          </button>
        </div>
        <p className="dashboard-subtext">{t("dashboard.dashboard_family_subtext")}</p>

        {/* Thẻ thống kê */}
        <div className="stat-card-container">
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
              <div className="stat-card-value">{formatTotalCurrency(balance, t)}</div>
            </div>
            <button className="deposit-button" onClick={() => navigate("/family/deposit")}>
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
              <li className="text-muted">{t("status.transactionStatus.no_notifications")}</li>
            ) : (
              notifications.map((noti) => (
                <li key={noti.notificationsID} className="dashboard-notification-item">
                  <FaBell className="icon text-warning" />
                  <div>
                    <p className="dashboard-notification-text">{noti.message}</p>
                    <small className="dashboard-notification-time">
                      {new Date(noti.createdDate).toLocaleString("vi-VN")}
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
                transactions.map((tx, index) => {
                  const { statusLabel, statusClass, typeLabel } = getTransactionFormatData(tx.status, tx.transactionType, t);
                  return (
                    <tr key={index}>
                      <td>{new Date(tx.createdDate).toLocaleDateString("vi-VN")}</td>
                      <td>{typeLabel}</td>
                      <td>{tx.receiverName || ""}</td>
                      <td>{tx.amount.toLocaleString("vi-VN")} VNĐ</td>
                      <td className={statusClass}>{statusLabel}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showSupportModal} onHide={() => setShowSupportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Gửi yêu cầu hỗ trợ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Loại hỗ trợ</label>
            <select
              className="form-select"
              value={supportType}
              onChange={(e) => setSupportType(Number(e.target.value))}
            >
              <option value={1}>Tài khoản</option>
              <option value={2}>Công việc</option>
              <option value={3}>Xác minh CMND</option>
              <option value={4}>Giao dịch</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Nội dung</label>
            <textarea
              className="form-control"
              rows={4}
              value={supportContent}
              onChange={(e) => setSupportContent(e.target.value)}
              placeholder="Nhập nội dung hỗ trợ..."
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Hình ảnh (nếu có)</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(e) => setSupportImage(e.target.files[0])}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSupportModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={submitSupportRequest}
            disabled={sending || !supportContent}
          >
            {sending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
          <Button
            variant="outline-info"
            onClick={() => {
              setShowSupportModal(false);
              navigate("/family/support-requests");
            }}
          >
            Xem yêu cầu đã gửi
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default FamilyDashboardPage;
