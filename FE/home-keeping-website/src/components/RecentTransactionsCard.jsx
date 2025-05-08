import React, { useEffect, useState } from "react";
import { FaMoneyBillWave, FaWallet, FaInfoCircle, FaClock } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig";
import "../assets/styles/HousekeeperReviewList.css";

const RecentTransactionsCard = () => {
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return "Đang chờ";
      case 2: return "Hoàn tất";
      case 3: return "Hết hạn";
      case 4: return "Đã hủy";
      default: return "Không rõ";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1: return "text-warning";
      case 2: return "text-success";
      case 3: return "text-muted";
      case 4: return "text-danger";
      default: return "text-secondary";
    }
  };

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`${API_BASE_URL}/Wallet/getWallet?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => setWallet(data))
      .catch((err) => console.error("Lỗi khi lấy ví:", err));

    fetch(`${API_BASE_URL}/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=5`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy giao dịch:", err);
        setLoading(false);
      });
  }, [accountID, authToken]);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return `${d.toLocaleTimeString("vi-VN")} ${d.toLocaleDateString("vi-VN")}`;
  };

  return (
    <div className="card shadow-sm border-0 p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          <FaMoneyBillWave className="text-success me-2" />
          Giao dịch gần đây
        </h5>
      </div>

      {/* Wallet summary */}
      {wallet && (
        <div className="bg-light rounded shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold mb-1">
                <FaWallet className="me-2 text-primary" />
                Ví hiện tại
              </div>
              <small className="text-muted">
                Cập nhật: {new Date(wallet.updatedAt).toLocaleString("vi-VN")}
              </small>
            </div>
            <div className="text-end">
              <div className="fw-bold text-success fs-5">
                {wallet.balance.toLocaleString("vi-VN")}₫
              </div>
              <small className="text-muted">
                Đang giữ: {wallet.onHold.toLocaleString("vi-VN")}₫
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Transactions list */}
      <div className="review-scroll-area p-1">
        {loading ? (
          <p className="text-muted text-center mb-0">Đang tải...</p>
        ) : transactions.length === 0 ? (
          <p className="text-muted text-center mb-0">Không có giao dịch nào gần đây.</p>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={index}
              className="d-flex align-items-start mb-3 p-3 rounded shadow-sm bg-light"
            >
              <div className="me-3 mt-1">
                <FaMoneyBillWave className="text-success" />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-dark text-break">
                    {tx.description || "Giao dịch"}
                  </span>
                  <span className={`ms-2 d-flex align-items-center ${getStatusClass(tx.status)}`}>
                    <FaInfoCircle className="me-1" />
                    {getStatusLabel(tx.status)}
                  </span>
                </div>
                <small className="text-muted d-flex align-items-center mb-1">
                  <FaClock className="me-1" />
                  {formatDate(tx.createdDate)}
                </small>
                <div className="fw-bold text-success">{tx.amount.toLocaleString("vi-VN")}₫</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
