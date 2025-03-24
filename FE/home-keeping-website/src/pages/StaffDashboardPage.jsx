import React, { useState, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    FaUserTie, FaUsers, FaBriefcase, FaMoneyBillWave, FaLifeRing,
    FaStar, FaExclamationTriangle, FaBook
} from "react-icons/fa";
import "../assets/styles/Dashboard.css";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const StaffDashboardPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [accountInfo, setAccountInfo] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState("");

    const shouldShowLoadingOrError = loading || error;

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
                totalHousekeepers: 120,
                totalFamilies: 85,
                newAccounts7Days: 11,
                totalJobs: 200,
                completedJobs: 155,
                completedJobs7Days: 29,
                successfulTransactions: 540,
                successfulTransactions7Days: 25,
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
                if (account.roleID != "3") throw new Error(t("error_auth") + " Role authen");
                setAccountInfo(account);

                // Gọi API đúng để lấy dữ liệu thống kê
                return Promise.all([
                    axios.get(`http://localhost:5280/api/Account/TotalAccount`, { headers }), // API thống kê tài khoản
                    axios.get(`http://localhost:5280/api/Account/NewAccounts`, { headers }),
                    //axios.get(`http://localhost:5280/api/Job/Stats`, { headers }), // API thống kê công việc
                    //axios.get(`http://localhost:5280/api/Transaction/Stats`, { headers }) // API thống kê giao dịch
                ]);
            })
            .then(([accountsRes, newAccountRes/*, jobRes, transactionRes*/]) => {
                const accountsData = accountsRes.data;
                const newAccountsData = newAccountRes.data;
                //const jobData = jobRes.data;
                //const transactionData = transactionRes.data;

                if (!accountsData || !newAccountsData /*|| !jobData || !transactionData*/) {
                    throw new Error(t("error_loading"));
                }
                setStatsData({
                    totalHousekeepers: accountsData.totalHousekeepers || 0,
                    totalFamilies: accountsData.totalFamilies || 0,
                    newAccounts7Days: newAccountsData.newAccounts7Days || 0,
                    /*totalJobs: jobData.totalJobs || 0,
                    completedJobs: jobData.completedJobs || 0,
                    completedJobs7Days: jobData.completedJobs7Days || 0,
                    successfulTransactions: transactionData.successfulTransactions || 0,
                    successfulTransactions7Days: transactionData.successfulTransactions7Days || 0,*/
                });
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(t("error_loading"));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="staff-tooltip">
                    {payload.map((item, index) => (
                        <p key={index} style={{ color: item.color }}>
                            {item.name}: <strong>{item.value}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (shouldShowLoadingOrError) {
        return (
            <div className="dashboard-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
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
                        <div className="staff-dashboard-stat-card">
                            <FaUserTie className="staff-dashboard-stat-icon" />
                            <p className="staff-dashboard-stat-number">{statsData.totalHousekeepers}</p>
                            <p className="staff-dashboard-stat-label">{t("total_housekeepers")}</p>
                        </div>
                        <div className="staff-dashboard-stat-card">
                            <FaUsers className="staff-dashboard-stat-icon" />
                            <p className="staff-dashboard-stat-number">{statsData.totalFamilies}</p>
                            <p className="staff-dashboard-stat-label">{t("total_families")}</p>
                        </div>
                        <div className="staff-dashboard-stat-card">
                            <FaBriefcase className="staff-dashboard-stat-icon" />
                            <p className="staff-dashboard-stat-number">{statsData.totalJobs}</p>
                            <p className="staff-dashboard-stat-label">{t("total_jobs")}</p>
                        </div>
                        <div className="staff-dashboard-stat-card">
                            <FaMoneyBillWave className="staff-dashboard-stat-icon" />
                            <p className="staff-dashboard-stat-number">{statsData.successfulTransactions}</p>
                            <p className="staff-dashboard-stat-label">{t("total_transactions")}</p>
                        </div>
                    </div>

                    <div className="staff-stats-container">
                        {/* Biểu đồ Người Dùng */}
                        <div className="staff-stats-chart">
                            <h2>Thống kê Người Dùng</h2>
                            <BarChart width={250} height={150} data={[statsData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" hide />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="totalHousekeepers" fill="#0074D9" name="Tổng Housekeepers" />
                                <Bar dataKey="totalFamilies" fill="#2ECC40" name="Tổng Families" />
                                <Bar dataKey="newAccounts7Days" fill="#FBAE17" name="Tài khoản mới (7 ngày)" />
                            </BarChart>
                        </div>

                        {/* Biểu đồ Công Việc */}
                        <div className="staff-stats-chart">
                            <h2>Thống kê Công Việc</h2>
                            <BarChart width={250} height={150} data={[statsData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" hide />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="totalJobs" fill="#0074D9" name="Tổng Công việc" />
                                <Bar dataKey="completedJobs" fill="#FF9500" name="Công việc hoàn thành" />
                                <Bar dataKey="completedJobs7Days" fill="#FF4136" name="Công việc hoàn thành (7 ngày)" />
                            </BarChart>
                        </div>

                        {/* Biểu đồ Giao Dịch */}
                        <div className="staff-stats-chart">
                            <h2>Thống kê Giao Dịch</h2>
                            <BarChart width={250} height={150} data={[statsData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" hide />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="successfulTransactions" fill="#2ECC40" name="Giao dịch thành công" />
                                <Bar dataKey="successfulTransactions7Days" fill="#FFC107" name="Giao dịch thành công (7 ngày)" />
                            </BarChart>
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
