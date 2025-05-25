import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaHome,
  FaBroom,
  FaConciergeBell,
  FaExchangeAlt
} from "react-icons/fa";
import CountUp from "react-countup";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";
import { FaMoneyBillWave } from "react-icons/fa";

const AdminDashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [housekeeperCount, setHousekeeperCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [totalFeeAmount, setTotalFeeAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        const [
          usersRes,
          familiesRes,
          housekeepersRes,
          serviceRes,
          transactionRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/Account/AccountList?pageNumber=1&pageSize=9999999`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/Families/FamilyList?pageNumber=1&pageSize=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/HouseKeeper/HousekeeperDisplay?pageNumber=1&pageSize=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/Service/ServiceList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/Transaction/TransactionList?pageNumber=1&pageSize=9999999`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserCount((await usersRes.json()).length);
        setFamilyCount((await familiesRes.json()).length);
        setHousekeeperCount((await housekeepersRes.json()).length);
        setServiceCount((await serviceRes.json()).length);
        setTransactionCount((await transactionRes.json()).length);

        const totalFeeRes = await fetch(`${API_BASE_URL}/Transaction/GetTotalFeeAmount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalFee = await totalFeeRes.json();
        setTotalFeeAmount(totalFee);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const renderCard = (title, count, color, bgColor, Icon, delay = 0) => (
    <div className="col-md-2 col-sm-6 col-12">
      <div
        className="card text-dark text-center p-4 rounded-4 shadow-sm"
        style={{
          height: "200px",
          backgroundColor: bgColor,
          borderBottom: `4px solid ${color}`,
          cursor: "pointer",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          animation: `fadeIn 0.6s ease ${delay}s forwards`,
          opacity: 0,
          transform: "translateY(20px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
          <Icon />
          <h6 className="fw-semibold mb-1">{title}</h6>
          {loading ? (
            <p className="text-muted mb-0">Đang tải...</p>
          ) : (
            <h2 className="fw-bold mb-0">
              {typeof count === "number" ? (
                <CountUp end={count} duration={1.4} />
              ) : (
                count
              )}
            </h2>
          )}
        </div>
      </div>
    </div>
  );

  const VNDIcon = () => (
    <div style={{
      fontSize: "28px",
      fontWeight: "bold",
      color: "#6f42c1",
      marginBottom: "8px"
    }}>₫</div>
  );

  return (
    <div className="container-fluid">
      <style>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 py-5">
          <div className="row g-4 justify-content-center">
            {renderCard("Tổng số người dùng", userCount, "#0d6efd", "#e7f1ff", () => <FaUsers size={28} className="mb-2" style={{ color: "#0d6efd" }} />, 0.1)}
            {renderCard("Tài khoản gia đình", familyCount, "#198754", "#eaf6f0", () => <FaHome size={28} className="mb-2" style={{ color: "#198754" }} />, 0.2)}
            {renderCard("Người giúp việc", housekeeperCount, "#0dcaf0", "#e6fafd", () => <FaBroom size={28} className="mb-2" style={{ color: "#0dcaf0" }} />, 0.3)}
            {renderCard("Tổng số dịch vụ", serviceCount, "#ffc107", "#fff8e5", () => <FaConciergeBell size={28} className="mb-2" style={{ color: "#ffc107" }} />, 0.4)}
            {renderCard("Tổng số giao dịch", transactionCount, "#dc3545", "#fde8ea", () => <FaExchangeAlt size={28} className="mb-2" style={{ color: "#dc3545" }} />, 0.5)}
            {renderCard(
              "Tổng thu nhập của nền tảng",
              totalFeeAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
              "#6f42c1",
              "#f5f0ff",
              () => <FaMoneyBillWave size={28} className="mb-2" style={{ color: "#6f42c1" }} />,
              0.6
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
