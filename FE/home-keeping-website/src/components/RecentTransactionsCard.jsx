import React, { useEffect, useState } from "react";
import { FaMoneyBillWave, FaWallet, FaInfoCircle, FaClock } from "react-icons/fa";

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

    // Fetch wallet
    fetch(`http://localhost:5280/api/Wallet/getWallet?id=${accountID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setWallet(data))
      .catch((err) => console.error("Lỗi khi lấy ví:", err));

    // Fetch transactions (max 5)
    fetch(`http://localhost:5280/api/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=5`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
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
    <div className="card p-4 shadow-sm h-100">
      <h5 className="fw-semibold mb-3">Giao dịch gần đây</h5>

      {wallet && (
        <div className="card mb-3 bg-light border shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">
                <FaWallet className="me-2 text-primary" />
                Ví hiện tại
              </h6>
              <small className="text-muted">Cập nhật: {new Date(wallet.updatedAt).toLocaleString()}</small>
            </div>
            <div className="text-end">
              <span className="fw-bold text-success" style={{ fontSize: "1.2rem" }}>
                {wallet.balance.toLocaleString("vi-VN")}₫
              </span>
              <br />
              <small className="text-muted">Đang giữ: {wallet.onHold.toLocaleString("vi-VN")}₫</small>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted text-center">Đang tải...</p>
      ) : transactions.length === 0 ? (
        <p className="text-muted text-center">Không có giao dịch nào gần đây.</p>
      ) : (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <ul className="list-group list-group-flush small">
            {transactions.map((tx, index) => (
              <li
                key={index}
                className="list-group-item px-2 py-2"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2">
                    <FaMoneyBillWave className="text-success me-2" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span className="text-break fw-semibold">{tx.description || "Giao dịch"}</span>
                      <span className={`ms-2 ${getStatusClass(tx.status)}`}>
                        <FaInfoCircle className="me-1" />
                        {getStatusLabel(tx.status)}
                      </span>
                    </div>
                    <small className="text-muted d-flex align-items-center mt-1">
                      <FaClock className="me-1" />
                      {new Date(tx.createdDate).toLocaleString()}
                    </small>
                    <div className="fw-bold text-success mt-1">
                      {tx.amount.toLocaleString("vi-VN")}₫
                    </div>
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
