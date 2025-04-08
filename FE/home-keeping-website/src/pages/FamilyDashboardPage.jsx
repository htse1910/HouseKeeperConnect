import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
    FaBriefcase, FaUsers, FaBell, FaEnvelope, FaUserCheck, FaPlusSquare, FaCalendarAlt
} from "react-icons/fa";
import "../assets/styles/Dashboard.css";

function FamilyDashboardPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

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
            case 1: return t("transactionStatus.pending");
            case 2: return t("transactionStatus.completed");
            case 3: return t("transactionStatus.expired");
            case 4: return t("transactionStatus.cancelled");
            default: return t("transactionStatus.unknown");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 1: return "status-pending";
            case 2: return "status-approved";
            case 3: return "status-expired";
            case 4: return "status-cancelled";
            default: return "status-unknown";
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 1: return t("transactionStatus.deposit");
            case 2: return t("transactionStatus.withdrawal");
            case 3: return t("transactionStatus.payment");
            case 4: return t("transactionStatus.payout");
            default: return t("transaction_unknown");
        }
    };

    useEffect(() => {
        if (isDemo) {
            setUserName("Trần Tường Vi");
            setBalance(2000000);
            setJobStats({ activeJobs: 15, applicants: 8 });
            setLoading(false);
            return;
        }

        if (!authToken || !accountID) {
            setError(t("error_auth"));
            setLoading(false);
            return;
        }

        const headers = {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
        };

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Bước 1: Xác thực account
                const accRes = await axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers });
                const accData = accRes.data;
                if (!accData?.accountID) throw new Error(t("error_auth"));
                setUserName(accData.name || "...");

                // Bước 2: Lấy ví
                try {
                    const walletRes = await axios.get(`http://localhost:5280/api/wallet/getWallet?id=${accountID}`, { headers });
                    const walletData = walletRes.data;
                    setBalance(walletData?.balance || 0);
                } catch (walletErr) {
                    console.warn("Lỗi khi gọi API ví:", walletErr);
                }

                // Bước 3: Lấy danh sách job
                try {
                    const jobsRes = await axios.get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
                    const jobsData = jobsRes.data;
                    setJobStats({
                        activeJobs: jobsData.length || 0,
                        applicants: jobsData.totalApplicant || 0,
                    });
                } catch (jobErr) {
                    console.warn("Lỗi khi gọi API job:", jobErr);
                }

                setError(null);

                // Bước 4: Lấy thông báo
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

                // Bước 5: Lấy giao dịch
                try {
                    const txRes = await axios.get(
                        `http://localhost:5280/api/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=5`,
                        { headers }
                    );
                    setTransactions(txRes.data || []);
                } catch (txErr) {
                    console.warn("Lỗi khi gọi API giao dịch:", txErr);
                }
            } catch (err) {
                console.error("Lỗi xác thực:", err);
                setError(t("error_auth"));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isDemo]);

    if (loading || error) {
        return (
            <div className="dashboard-container text-center py-5">
                {loading && (
                    <>
                        <span className="icon-loading" />
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        {!isDemo && (
                            <button
                                className="btn-secondary"
                                onClick={() => window.location.search = "?demo=true"}
                            >
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Chào mừng */}
            <div className="dashboard-box shadow-box">
                <h2 className="dashboard-heading">
                    {t("dashboard_welcome_message", { name: userName })}
                </h2>
                <p className="dashboard-subtext">{t("dashboard_family_subtext")}</p>

                {/* Thẻ thống kê */}
                <div className="stat-card-container">
                    <div className="stat-card">
                        <div>
                            <div className="stat-card-label">{t("dashboard_active_jobs")}</div>
                            <div className="stat-card-value">{jobStats.activeJobs}</div>
                        </div>
                        <FaBriefcase className="stat-card-icon" />
                    </div>

                    <div className="stat-card">
                        <div>
                            <div className="stat-card-label">{t("dashboard_applicants")}</div>
                            <div className="stat-card-value">{jobStats.applicants}</div>
                        </div>
                        <FaUsers className="stat-card-icon" />
                    </div>

                    <div className="stat-card">
                        <div>
                            <div className="stat-card-label">{t("dashboard_balance")}</div>
                            <div className="stat-card-value">{balance.toLocaleString()}đ</div>
                        </div>
                        <button className="deposit-button" onClick={() => navigate("/family/deposit")}>
                            {t("dashboard_deposit")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Hành động nhanh */}
            <div className="quick-action-container">
                <div className="quick-action-card" onClick={() => navigate("/family/post-job")}>
                    <FaPlusSquare className="quick-action-icon" />
                    <div>
                        <h5 className="quick-action-title">{t("dashboard_post_job")}</h5>
                        <p className="quick-action-desc">{t("dashboard_post_desc")}</p>
                    </div>
                </div>

                <div className="quick-action-card" onClick={() => navigate("/family/transactions")}>
                    <FaCalendarAlt className="quick-action-icon" />
                    <div>
                        <h5 className="quick-action-title">{t("dashboard_transaction_history")}</h5>
                        <p className="quick-action-desc">{t("dashboard_transaction_desc")}</p>
                    </div>
                </div>
            </div>

            {/* Thông báo + Giao dịch */}
            <div className="dashboard-grid">
                <div className="dashboard-box">
                    <h5 className="dashboard-box-title">{t("notifications")}</h5>
                    <ul className="dashboard-notification-list">
                        {notifications.length === 0 ? (
                            <li className="text-muted">{t("no_notifications")}</li>
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
                    <h5 className="dashboard-box-title">{t("dashboard_recent_transactions")}</h5>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>{t("date")}</th>
                                <th>{t("transaction_type")}</th>
                                <th>{t("housekeeper")}</th>
                                <th>{t("amount")}</th>
                                <th>{t("status")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        {t("no_transactions")}
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td>{new Date(tx.createdDate).toLocaleDateString("vi-VN")}</td>
                                        <td>{getTypeLabel(tx.transactionType)}</td>
                                        <td>{tx.receiverName || ""}</td>
                                        <td>{tx.amount.toLocaleString("vi-VN")} VNĐ</td>
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
