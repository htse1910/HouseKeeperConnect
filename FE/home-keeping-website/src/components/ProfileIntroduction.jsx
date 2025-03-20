import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCreditCard, FaIdCard, FaSyncAlt } from "react-icons/fa";

const ProfileIntroduction = () => {
  const [createdAt, setCreatedAt] = useState("...");
  const [updatedAt, setUpdatedAt] = useState("...");
  const [bankAccount, setBankAccount] = useState("...");
  const [status, setStatus] = useState("...");
  const [loading, setLoading] = useState(false);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCreatedAt(data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A");
        setUpdatedAt(data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A");
        setBankAccount(data.bankAccountNumber || "Chưa cập nhật");
        setStatus(data.status === 1 ? "Active" : "Inactive");
      })
      .catch((error) => console.error("Lỗi khi lấy thông tin hồ sơ:", error));
  }, [accountID, authToken]);

  const handleStatusChange = () => {
    if (!accountID || !authToken) return;

    setLoading(true);
    fetch(`http://localhost:5280/api/Account/ChangeStatus?id=${accountID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.text()) // API returns text message
      .then((message) => {
        alert(message); // Show response message
        setStatus((prevStatus) => (prevStatus === "Active" ? "Inactive" : "Active"));
      })
      .catch((error) => console.error("Lỗi khi cập nhật trạng thái:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="card p-4 shadow-sm mt-3 position-relative">
      {/* Status Change Button */}
      <button 
        className="btn btn-sm btn-primary position-absolute top-0 end-0 m-3 d-flex align-items-center"
        onClick={handleStatusChange}
        disabled={loading}
      >
        <FaSyncAlt className="me-2" /> {loading ? "Đang cập nhật..." : "Cập nhật trạng thái"}
      </button>

      <h5 className="fw-bold">Giới thiệu</h5>
      <p><FaIdCard className="text-danger me-2" /> Trạng thái: {status}</p>
      <p><FaCreditCard className="text-danger me-2" /> Số tài khoản ngân hàng: {bankAccount}</p>
      <p><FaCalendarAlt className="text-danger me-2" /> Tài khoản được tạo vào: {createdAt}</p>
      <p><FaCalendarAlt className="text-danger me-2" /> Cập nhật lần cuối: {updatedAt}</p>
    </div>
  );
};

export default ProfileIntroduction;
