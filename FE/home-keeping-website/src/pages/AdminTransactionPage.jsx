import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const AdminTransactionPage = () => {
  const authToken = localStorage.getItem("authToken");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getEnumLabel = (type, value) => {
    const enums = {
      TransactionType: {
        1: "Nạp tiền",
        2: "Rút tiền",
        3: "Thanh toán",
        4: "Chi trả",
      },
      TransactionStatus: {
        1: "Chờ xử lý",
        2: "Hoàn tất",
        3: "Hết hạn",
        4: "Đã huỷ",
      },
    };
    return enums[type]?.[value] || "Không xác định";
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/Transaction/TransactionList?pageNumber=1&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách giao dịch:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-primary text-center">Quản lý Giao dịch</h2>

      {loading ? (
        <p className="text-muted">⏳ Đang tải danh sách giao dịch...</p>
      ) : transactions.length === 0 ? (
        <div className="alert alert-warning">Không có giao dịch nào.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Loại giao dịch</th>
                <th>Số tài khoản</th>
                <th>ID ví</th>
                <th>Số tiền</th>
                <th>Phí</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transactionID}>
                  <td>{tx.transactionID}</td>
                  <td>{getEnumLabel("TransactionType", tx.transactionType)}</td>
                  <td>{tx.accountID}</td>
                  <td>{tx.walletID}</td>
                  <td>{tx.amount.toLocaleString()} đ</td>
                  <td>{tx.fee.toLocaleString()} đ</td>
                  <td>{tx.description || "—"}</td>
                  <td>{new Date(tx.createdDate).toLocaleString()}</td>
                  <td>{new Date(tx.updatedDate).toLocaleString()}</td>
                  <td>{getEnumLabel("TransactionStatus", tx.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionPage;
