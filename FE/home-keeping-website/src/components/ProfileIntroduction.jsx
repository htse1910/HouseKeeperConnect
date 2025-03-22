import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCreditCard, FaIdCard, FaSyncAlt } from "react-icons/fa";

const ProfileIntroduction = () => {
  const [createdAt, setCreatedAt] = useState("...");
  const [updatedAt, setUpdatedAt] = useState("...");
  const [bankAccount, setBankAccount] = useState("...");
  const [status, setStatus] = useState("...");
  const [loading, setLoading] = useState(false);
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const housekeeperID = localStorage.getItem("housekeeperID");

  useEffect(() => {
    if (!accountID || !authToken) return;

    // Get account info
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
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

    // Get ID photos from pending list
    fetch(`http://localhost:5280/api/HouseKeeper/ListHousekeeperPending`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const hk = data.find((item) => item.housekeeperID === parseInt(housekeeperID));
        if (hk) {
          if (hk.frontPhoto) setFrontPhoto(`data:image/png;base64,${hk.frontPhoto}`);
          if (hk.backPhoto) setBackPhoto(`data:image/png;base64,${hk.backPhoto}`);

          if (hk.verifyID) {
            localStorage.setItem("verifyID", hk.verifyID); // ✅ Store verifyID
          }
        }
      })
      .catch((error) => console.error("Lỗi khi lấy ảnh giấy tờ:", error));
  }, [accountID, authToken, housekeeperID]);

  const handleStatusChange = () => {
    if (!accountID || !authToken) return;

    setLoading(true);
    fetch(`http://localhost:5280/api/Account/ChangeStatus?id=${accountID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
        setStatus((prev) => (prev === "Active" ? "Inactive" : "Active"));
      })
      .catch((error) => console.error("Lỗi khi cập nhật trạng thái:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="card p-4 shadow-sm mt-3 position-relative">
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

      {/* ID Images */}
      {/* ID Images */}
      {(frontPhoto || backPhoto) && (
        <div className="mt-4">
          <h6 className="fw-bold">Giấy tờ xác minh</h6>
          <div className="d-flex gap-3 flex-wrap">
            {frontPhoto && (
              <div>
                <p className="mb-1">Mặt trước</p>
                <img
                  src={frontPhoto}
                  alt="Front ID"
                  style={{ width: "150px", height: "auto" }}
                  className="rounded border"
                />
              </div>
            )}
            {backPhoto && (
              <div>
                <p className="mb-1">Mặt sau</p>
                <img
                  src={backPhoto}
                  alt="Back ID"
                  style={{ width: "150px", height: "auto" }}
                  className="rounded border"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIntroduction;
