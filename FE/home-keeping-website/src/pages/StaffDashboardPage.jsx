import React, { useState, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUserTie, FaUsers, FaBriefcase, FaMoneyBillWave, FaLifeRing,
  FaStar, FaBook
} from "react-icons/fa";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import API_BASE_URL from "../config/apiConfig";

const StaffDashboardPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || t("staff", "Staff");
    setUserName(storedName);
  }, [t]);

  useEffect(() => {
    if (isDemo) {
      setStatsData({
        totalHousekeepers: 120,
        totalFamilies: 85,
        newAccounts7Days: 11,
        totalJobs: 1,
        completedJobs: 0,
        completedJobs7Days: 0,
        successfulTransactions: 540,
        successfulTransactions7Days: 25,
      });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError(t("error_auth", "Authentication error."));
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    Promise.allSettled([
      axios.get(`${API_BASE_URL}/Account/TotalAccount`, { headers }),
      axios.get(`${API_BASE_URL}/Account/NewAccounts`, { headers }),
      axios.get(`${API_BASE_URL}/Transaction/GetTotalTransactions`, { headers }),
      axios.get(`${API_BASE_URL}/Transaction/TransactionInPastWeek`, { headers }),
      axios.get(`${API_BASE_URL}/Job/CountVerifiedJobsStaff`, { headers }),
    ])
      .then((results) => {
        const [accStats, newAccs, txTotal, txWeek, jobCount] = results;

        const totalHousekeepers = accStats.status === "fulfilled" ? accStats.value.data.totalHousekeepers : 0;
        const totalFamilies = accStats.status === "fulfilled" ? accStats.value.data.totalFamilies : 0;
        const newAccounts7Days = newAccs.status === "fulfilled" ? newAccs.value.data.newAccounts7Days : 0;
        const successfulTransactions = txTotal.status === "fulfilled" ? txTotal.value.data : 0;
        const successfulTransactions7Days = txWeek.status === "fulfilled" ? txWeek.value.data.length : 0;
        const totalJobs = jobCount.status === "fulfilled" ? jobCount.value.data : 0;

        setStatsData({
          totalHousekeepers,
          totalFamilies,
          newAccounts7Days,
          totalJobs,
          completedJobs: 0,
          completedJobs7Days: 0,
          successfulTransactions,
          successfulTransactions7Days,
        });
      })
      .catch(() => setError(t("error_loading", "Failed to load data.")))
      .finally(() => setLoading(false));
  }, [isDemo, t]);

  const CustomTooltip = ({ active, payload }) =>
    active && payload?.length ? (
      <div className="bg-white p-2 border rounded shadow-sm">
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.color, margin: 0 }}>
            {item.name}: <strong>{item.value}</strong>
          </p>
        ))}
      </div>
    ) : null;

  if (loading || error) {
    return (
      <div className="container py-5 text-center">
        {loading && (
          <>
            <div className="spinner-border text-primary mb-3" role="status" />
            <p>{t("loading_data", "Loading data, please wait...")}</p>
          </>
        )}
        {error && (
          <>
            <p className="text-danger fs-5">❌ {error}</p>
            {!isDemo && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => (window.location.search = "?demo=true")}
              >
                {t("view_demo", "View Demo")}
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  const menuItems = [
    { name: t("user.account_verification", "Account Verification"), icon: <FaUserTie />, path: "/dashboard/users" },
    { name: t("uncategorized.jobs", "Jobs"), icon: <FaBriefcase />, path: "/dashboard/jobs" },
    { name: t("transaction.transactions", "Transactions"), icon: <FaMoneyBillWave />, path: "/dashboard/transactions" },
    { name: t("uncategorized.reviews", "Reviews"), icon: <FaStar />, path: "/dashboard/reviews" },
    { name: t("uncategorized.faqs_policies", "FAQs & Policies"), icon: <FaBook />, path: "/dashboard/faqs-policies" },
    { name: t("uncategorized.withdrawal_verification", "Xác nhận rút tiền"), icon: <FaMoneyBillWave />, path: "/dashboard/withdrawals" },
    { name: t("uncategorized.staff_support", "Technical Support Requests"), icon: <FaLifeRing />, path: "/dashboard/support" },
    { name: t("uncategorized.manage_accepted_jobs", "Quản lý công việc đã được chấp nhận"), icon: <FaBriefcase />, path: "/dashboard/accepted-jobs" },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="fw-bold mb-3">{t("navigation.dashboard", "Dashboard")}</h5>
            <ul className="nav flex-column">
              {menuItems.map((item, idx) => (
                <li className="nav-item mb-2" key={idx}>
                  <NavLink className="nav-link d-flex align-items-center gap-2" to={item.path}>
                    {item.icon}
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-9">
          <div className="mb-4">
            <h3>{t("dashboard.dashboard_welcome_message", { name: userName }) || `Welcome back, ${userName}`}</h3>
            <p className="text-muted">{t("misc.select_category", "Choose a category to manage")}</p>
          </div>

          <div className="row g-3">
            <StatCard icon={<FaUserTie />} value={statsData.totalHousekeepers} label={t("misc.total_housekeepers", "Total Housekeepers")} />
            <StatCard icon={<FaUsers />} value={statsData.totalFamilies} label={t("misc.total_families", "Total Families")} />
            <StatCard icon={<FaBriefcase />} value={statsData.totalJobs} label={t("misc.total_jobs", "Total Jobs")} />
            <StatCard icon={<FaMoneyBillWave />} value={statsData.successfulTransactions} label={t("misc.total_transactions", "Total Transactions")} />
          </div>

          <div className="row mt-4">
            <ChartSection title={t("misc.stats_title", "Account Stats")} data={statsData} bars={[
              { key: "totalHousekeepers", fill: "#0074D9", name: t("misc.total_housekeepers", "Total Housekeepers") },
              { key: "totalFamilies", fill: "#2ECC40", name: t("misc.total_families", "Total Families") },
              { key: "newAccounts7Days", fill: "#FBAE17", name: `${t("misc.created_date", "Created")} (7 ${t("misc.date", "days")})` },
            ]} />
            <ChartSection title={t("misc.total_jobs", "Job Stats")} data={statsData} bars={[
              { key: "totalJobs", fill: "#0074D9", name: t("misc.total_jobs", "Total Jobs") },
              { key: "completedJobs", fill: "#FF9500", name: t("misc.completed", "Completed") },
              { key: "completedJobs7Days", fill: "#FF4136", name: `${t("misc.completed", "Completed")} (7 ${t("misc.date", "days")})` },
            ]} />
            <ChartSection title={t("transaction.transaction_payment", "Transactions")} data={statsData} bars={[
              { key: "successfulTransactions", fill: "#2ECC40", name: t("transaction.transactionStatus.completed", "Completed") },
              { key: "successfulTransactions7Days", fill: "#FFC107", name: `${t("transaction.transactionStatus.completed", "Completed")} (7 ${t("misc.date", "days")})` },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="col-sm-6 col-lg-3">
    <div className="card text-center p-3 shadow-sm h-100">
      <div className="fs-4 mb-2">{icon}</div>
      <h5 className="mb-0">{value}</h5>
      <small className="text-muted">{label}</small>
    </div>
  </div>
);

const ChartSection = ({ title, data, bars }) => (
  <div className="col-md-4 mb-4">
    <div className="card p-3 shadow-sm h-100">
      <h6 className="mb-3 fw-semibold">{title}</h6>
      <BarChart width={250} height={150} data={[data]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" hide />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        {bars.map((bar, idx) => (
          <Bar key={idx} dataKey={bar.key} fill={bar.fill} name={bar.name} />
        ))}
      </BarChart>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div className="bg-white p-2 border rounded shadow-sm">
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color, margin: 0 }}>
          {item.name}: <strong>{item.value}</strong>
        </p>
      ))}
    </div>
  ) : null;

export default StaffDashboardPage;
