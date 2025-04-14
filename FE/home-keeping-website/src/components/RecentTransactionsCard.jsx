import React, { useEffect, useState } from "react";
import { FaMoneyBillWave, FaWallet, FaInfoCircle, FaClock } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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

  return (
    <div className="card shadow-sm border-0 p-4 h-100">
      <h5 className="fw-bold mb-3 d-flex align-items-center">
        <FaMoneyBillWave className="text-success me-2" />
        Giao dịch gần đây
      </h5>

      {/* Wallet Summary */}
      {wallet && (
        <div className="card bg-light border-0 shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold mb-1">
                <FaWallet className="me-2 text-primary" />
                Ví hiện tại
              </div>
              <small className="text-muted">Cập nhật: {new Date(wallet.updatedAt).toLocaleString("vi-VN")}</small>
            </div>
            <div className="text-end">
              <div className="fw-bold text-success fs-5">
                {wallet.balance.toLocaleString("vi-VN")}₫
              </div>
              <small className="text-muted">Đang giữ: {wallet.onHold.toLocaleString("vi-VN")}₫</small>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      {loading ? (
        <p className="text-muted text-center">Đang tải...</p>
      ) : transactions.length === 0 ? (
        <p className="text-muted text-center">Không có giao dịch nào gần đây.</p>
      ) : (
        <div style={{ maxHeight: "240px", overflowY: "auto" }}>
          <ul className="list-group list-group-flush small">
            {transactions.map((tx, index) => (
              <li key={index} className="list-group-item rounded shadow-sm mb-2 border-0 px-3 py-3 bg-light">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2 mt-1">
                    <FaMoneyBillWave className="text-success" />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-break">{tx.description || "Giao dịch"}</span>
                      <span className={`ms-2 ${getStatusClass(tx.status)} d-flex align-items-center`}>
                        <FaInfoCircle className="me-1" />
                        {getStatusLabel(tx.status)}
                      </span>
                    </div>
                    <small className="text-muted d-flex align-items-center mb-1">
                      <FaClock className="me-1" />
                      {new Date(tx.createdDate).toLocaleString("vi-VN")}
                    </small>
                    <div className="fw-bold text-success">{tx.amount.toLocaleString("vi-VN")}₫</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsCard;
