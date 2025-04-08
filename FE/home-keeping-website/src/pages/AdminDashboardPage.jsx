import React, { useEffect, useState } from "react";
import { FaUsers, FaConciergeBell, FaExchangeAlt } from "react-icons/fa";
import ScrollToTopButton from "../components/ScrollToTopButton";

const AdminDashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const authToken = localStorage.getItem("authToken");

  const fetchUserCount = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(
        "http://localhost:5280/api/Account/AccountList?pageNumber=1&pageSize=99999",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setUserCount(data.length);
    } catch (err) {
      console.error("Failed to fetch user list:", err);
      setUserCount(0);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchServiceCount = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch("http://localhost:5280/api/Service/ServiceList", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setServiceCount(data.length);
    } catch (err) {
      console.error("Failed to fetch service list:", err);
      setServiceCount(0);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchTransactionCount = async () => {
    setLoadingTransactions(true);
    try {
      const res = await fetch(
        "http://localhost:5280/api/Transaction/TransactionList?pageNumber=1&pageSize=1000",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setTransactionCount(data.length);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactionCount(0);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchServiceCount();
    fetchTransactionCount();
  }, []);

  return (
    <div className="container py-5">
      <ScrollToTopButton />

      <h1 className="fw-bold text-primary text-center mb-5">
        Bảng Điều Khiển Quản Trị Viên
      </h1>

      <div className="row g-4">
        {/* Users */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center rounded-4">
            <h5 className="fw-bold text-primary mb-3 d-flex justify-content-center align-items-center">
              <FaUsers className="me-2" />
              Tổng số người dùng
            </h5>
            {loadingUsers ? (
              <p className="text-muted">Đang tải...</p>
            ) : (
              <h1 className="display-5">{userCount}</h1>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center rounded-4">
            <h5 className="fw-bold text-success mb-3 d-flex justify-content-center align-items-center">
              <FaConciergeBell className="me-2" />
              Tổng số dịch vụ
            </h5>
            {loadingServices ? (
              <p className="text-muted">Đang tải...</p>
            ) : (
              <h1 className="display-5">{serviceCount}</h1>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center rounded-4">
            <h5 className="fw-bold text-warning mb-3 d-flex justify-content-center align-items-center">
              <FaExchangeAlt className="me-2" />
              Tổng số giao dịch
            </h5>
            {loadingTransactions ? (
              <p className="text-muted">Đang tải...</p>
            ) : (
              <h1 className="display-5">{transactionCount}</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
