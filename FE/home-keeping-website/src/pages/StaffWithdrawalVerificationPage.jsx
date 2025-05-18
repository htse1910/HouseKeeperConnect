import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config/apiConfig";

const StaffWithdrawalVerificationPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pictures, setPictures] = useState({});

  const token = localStorage.getItem("authToken");
  const WithdrawStatus = {
    WaitingForOTP: 1,
    OTPVerify: 2,
    Success: 3,
    Failed: 4,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Withdraw/WithdrawList?pageNumber=1&pageSize=100`, { headers })
      .then(async (res) => {
        const verifiedList = res.data.filter((w) => w.status === 2);
        const enriched = await Promise.all(
          verifiedList.map(async (w) => {
            try {
              const acc = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${w.accountID}`, { headers });
              return { ...w, account: acc.data };
            } catch {
              return { ...w, account: { name: "Không rõ", email: "N/A" } };
            }
          })
        );
        setWithdrawals(enriched);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePictureChange = (withdrawID, file) => {
    setPictures((prev) => ({ ...prev, [withdrawID]: file }));
  };

  const handleUpdateStatus = async (withdrawID, newStatus) => {
    const formData = new FormData();
    const picture = pictures[withdrawID];
    formData.append("Picture", picture || "");

    try {
      const res = await axios.put(`${API_BASE_URL}/Withdraw/UpdateWithdraw`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        params: {
          WithdrawID: withdrawID,
          Status: newStatus,
        },
        responseType: 'text', // 👈 force plain text response (axios default is JSON)
      });

      setWithdrawals((prev) => prev.filter((w) => w.withdrawID !== withdrawID));

      toast.success(res.data || (
        newStatus === WithdrawStatus.Success
          ? "✅ Phê duyệt yêu cầu rút tiền thành công!"
          : "❌ Từ chối yêu cầu rút tiền thành công!"
      ));
    } catch (err) {
      const message =
        err?.response?.data ||
        "⚠️ Lỗi khi cập nhật trạng thái rút tiền.";
      toast.error(message);
      console.error("Update failed", err);
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="container py-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <h3 className="mb-4">Yêu cầu rút tiền đang chờ duyệt</h3>
      {withdrawals.length === 0 ? (
        <p>Không có yêu cầu nào đang chờ duyệt.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số tiền</th>
                <th>Số tài khoản</th>
                <th>Ngân hàng</th>
                <th>Ngày yêu cầu</th>
                <th>Ảnh giao dịch</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.withdrawID}>
                  <td>{w.withdrawID}</td>
                  <td>{w.account?.name}</td>
                  <td>{w.account?.email}</td>
                  <td>{w.amount.toLocaleString()} VND</td>
                  <td>{w.bankNumber}</td>
                  <td>{w.bankName}</td> {/* ✅ NEW FIELD */}
                  <td>{new Date(w.requestDate).toLocaleString()}</td>
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePictureChange(w.withdrawID, e.target.files[0])}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdateStatus(w.withdrawID, WithdrawStatus.Success)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(w.withdrawID, WithdrawStatus.Failed)}
                    >
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffWithdrawalVerificationPage;
