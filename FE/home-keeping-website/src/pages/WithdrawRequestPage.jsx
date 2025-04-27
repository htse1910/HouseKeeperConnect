import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { FaMoneyBillWave, FaCalendarAlt, FaImage } from "react-icons/fa";

const WithdrawRequestPage = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  useEffect(() => {
    if (!accountID) {
      setError("Missing accountID.");
      setLoading(false);
      return;
    }

    axios.get(`${API_BASE_URL}/Withdraw/GetWithdrawByUserID`, {
      headers,
      params: {
        id: accountID,
        pageNumber: 1,
        pageSize: 100,
      }
    })
    .then(res => {
      setWithdraws(res.data || []);
    })
    .catch(() => {
      setError("Failed to fetch withdraw requests.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [accountID]);

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return <span className="badge bg-warning text-dark">Chờ xác nhận OTP</span>;
      case 2:
        return <span className="badge bg-primary">Đã xác nhận OTP</span>;
      case 3:
        return <span className="badge bg-success">Thành công</span>;
      case 4:
        return <span className="badge bg-danger">Thất bại</span>;
      default:
        return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5">
        {error}
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Lịch sử rút tiền</h2>

      {withdraws.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa có yêu cầu rút tiền nào.
        </div>
      ) : (
        <div className="list-group">
          {withdraws.map((w) => (
            <div key={w.withdrawID} className="list-group-item mb-4 shadow-sm rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>
                  <FaMoneyBillWave className="me-2" />
                  {w.amount.toLocaleString("vi-VN")} VND
                </h5>
                {renderStatus(w.status)}
              </div>

              <p>
                <FaCalendarAlt className="me-2" />
                Ngày yêu cầu: {new Date(w.requestDate).toLocaleString("vi-VN")}
              </p>

              <p>
                <strong>Ngân hàng:</strong> {w.bankName} ({w.bankNumber})
              </p>

              {w.picture && (
                <div className="mt-3">
                  <p className="fw-semibold mb-1">
                    <FaImage className="me-2" />
                    Ảnh xác nhận:
                  </p>
                  <img
                    src={w.picture}
                    alt="Ảnh giao dịch"
                    className="img-fluid rounded"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WithdrawRequestPage;
