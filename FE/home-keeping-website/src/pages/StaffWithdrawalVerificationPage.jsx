import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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
        const verifiedList = res.data.filter((w) => w.status === 2); // Only OTP Verified
        const enriched = await Promise.all(
          verifiedList.map(async (w) => {
            try {
              const acc = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${w.accountID}`, { headers });
              return { ...w, account: acc.data };
            } catch {
              return { ...w, account: { name: "Unknown", email: "N/A" } };
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
    if (picture) formData.append("Picture", picture);
    else formData.append("Picture", "");

    try {
      await axios.put(`${API_BASE_URL}/Withdraw/UpdateWithdraw`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        params: {
          WithdrawID: withdrawID,
          Status: newStatus,
        },
      });

      setWithdrawals((prev) => prev.filter((w) => w.withdrawID !== withdrawID));
      toast.success(
        newStatus === WithdrawStatus.Success
          ? "✅ Phê duyệt yêu cầu rút tiền thành công!"
          : "❌ Từ chối yêu cầu rút tiền thành công!"
      );
    } catch (err) {
      console.error("Update failed", err);
      toast.error("⚠️ Lỗi khi cập nhật trạng thái rút tiền.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container py-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <h3 className="mb-4">Pending Withdrawal Requests</h3>
      {withdrawals.length === 0 ? (
        <p>No pending withdrawals found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Withdraw ID</th>
                <th>Account Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Bank Number</th>
                <th>Requested On</th>
                <th>Upload Picture</th>
                <th>Action</th>
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
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(w.withdrawID, WithdrawStatus.Failed)}
                    >
                      Reject
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
