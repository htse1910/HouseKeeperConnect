import React, { useState, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUserTie, FaUsers, FaBriefcase, FaMoneyBillWave, FaLifeRing, 
    FaStar, FaExclamationTriangle, FaBook } from "react-icons/fa";
import "../assets/styles/Dashboard.css";
import axios from "axios";

const StaffDashboardPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [accountInfo, setAccountInfo] = useState(null);
    const [stats, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedName = localStorage.getItem("userName") || t("staff");
        setUserName(storedName);
    }, []);

    const menuItems = [
        { name: t("account_verification"), icon: <FaUserTie />, path: "/dashboard/user" },
        { name: t("jobs"), icon: <FaBriefcase />, path: "/dashboard/jobs" },
        { name: t("transactions"), icon: <FaMoneyBillWave />, path: "/dashboard/transactions" },
        { name: t("staff_support"), icon: <FaLifeRing />, path: "/dashboard/support" },
        { name: t("reviews"), icon: <FaStar />, path: "/dashboard/reviews" },
        { name: t("disputes"), icon: <FaExclamationTriangle />, path: "/dashboard/disputes" },
        { name: t("faqs_policies"), icon: <FaBook />, path: "/dashboard/faqs-policies" },
    ];

    useEffect(() => {
        if (isDemo) {
            setStatsData({
                housekeepers: 120,
                families: 85,
                jobs: 200,
                transactions: 540
            });

            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const accountID = localStorage.getItem("accountID");

        if (!token) {
            setError(t("error_auth"));
            setLoading(false);
            return;
        }

        if (!accountID) {
            setError(t("error_account"));
            setLoading(false);
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        // Gọi API để lấy thông tin tài khoản
        axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((accountResponse) => {
                const account = accountResponse.data;
                if (!account || !account.accountID) throw new Error(t("error_auth"));
                setAccountInfo(account);

                // Gọi API đúng để lấy dữ liệu thống kê
                return axios.get(`http://localhost:5280/api/Stats/GetStats`, { headers });
            })
            .then((statsResponse) => {
                const statsData = statsResponse.data;
                if (!statsData) throw new Error(t("error_loading"));
                setStatsData(statsData);
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(t("error_loading"));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    if (loading) {
        return (
            <div className="dashboard-container">
                <span className="loading"></span>
                <p>{t("loading_data")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p className="error">❌ {error}</p>
                <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                    {t("view_demo")}
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="staff-dashboard-layout">
                {/* Sidebar */}
                <div className="dashboard-sidebar staff-sidebar">
                    <h2 className="dashboard-title">Staff Dashboard</h2>
                    <nav>
                        {menuItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={({ isActive }) =>
                                    `dashboard-menu-item ${isActive ? "active" : ""}`
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Stats Content */}
                <div className="dashboard-content staff-dashboard-stats-content">
                    <div className="staff-dashboard-stats">
                        <div className="stat-card">
                            <FaUserTie className="stat-icon" />
                            <p className="stat-number">{stats.housekeepers}</p>
                            <p className="stat-label">{t("total_housekeepers")}</p>
                        </div>
                        <div className="stat-card">
                            <FaUsers className="stat-icon" />
                            <p className="stat-number">{stats.families}</p>
                            <p className="stat-label">{t("total_families")}</p>
                        </div>
                        <div className="stat-card">
                            <FaBriefcase className="stat-icon" />
                            <p className="stat-number">{stats.jobs}</p>
                            <p className="stat-label">{t("total_jobs")}</p>
                        </div>
                        <div className="stat-card">
                            <FaMoneyBillWave className="stat-icon" />
                            <p className="stat-number">{stats.transactions}</p>
                            <p className="stat-label">{t("total_transactions")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content staff-dashboard-content">
                <h1 className="dashboard-heading">{t("dashboard_welcome_message", { name: userName || "..." })}</h1>
                <p className="dashboard-text">{t("select_category")}</p>
            </div>
        </div>
    );
};

export default StaffDashboardPage;
