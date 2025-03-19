import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UpdateHousekeeperPage() {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const [rating, setRating] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [jobCompleted, setJobCompleted] = useState(0);
  const [jobsApplied, setJobsApplied] = useState(0);
  const [location, setLocation] = useState(""); // New Location Field
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!accountId || !authToken) {
      setMessage("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
      return;
    }

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRating(data.rating || 0);
        setIsVerified(data.isVerified || false);
        setBankAccount(data.bankAccountNumber || "");
        setJobCompleted(data.jobCompleted || 0);
        setJobsApplied(data.jobsApplied || 0);
        setLocation(data.location || ""); // Fetch location data
      })
      .catch((error) => console.error("Error fetching housekeeper details:", error));
  }, [accountId, authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankAccount.trim()) {
      setMessage("Số tài khoản ngân hàng là bắt buộc.");
      return;
    }

    const formData = new FormData();
    formData.append("AccountID", accountId);
    formData.append("Rating", rating);
    formData.append("IsVerified", isVerified);
    formData.append("BankAccountNumber", bankAccount);
    formData.append("JobCompleted", jobCompleted);
    formData.append("JobsApplied", jobsApplied);
    formData.append("Location", location); // ✅ Include Location

    if (frontPhoto) formData.append("FrontPhoto", frontPhoto);
    if (backPhoto) formData.append("BackPhoto", backPhoto);
    if (facePhoto) formData.append("FacePhoto", facePhoto);

    try {
      const response = await fetch("http://localhost:5280/api/HouseKeeper/UpdateHousekeeper", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const textResponse = await response.text();
      if (response.ok) {
        setMessage("Cập nhật thành công!");
        navigate(`/housekeeper/${accountId}`);
      } else {
        setMessage(textResponse || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Error updating housekeeper:", error);
      setMessage("Lỗi khi cập nhật.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cập nhật thông tin người giúp việc</h2>
      {message && <p className="alert alert-info">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Đánh giá:</label>
          <input type="number" className="form-control" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Trạng thái xác minh:</label>
          <select className="form-control" value={isVerified} onChange={(e) => setIsVerified(e.target.value === "true")}>
            <option value="true">Đã xác minh</option>
            <option value="false">Chưa xác minh</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Số tài khoản ngân hàng:</label>
          <input type="text" className="form-control" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Công việc đã hoàn thành:</label>
          <input type="number" className="form-control" value={jobCompleted} onChange={(e) => setJobCompleted(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Công việc đã ứng tuyển:</label>
          <input type="number" className="form-control" value={jobsApplied} onChange={(e) => setJobsApplied(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Địa điểm:</label> {/* ✅ New Location Field */}
          <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh mặt trước CMND:</label>
          <input type="file" className="form-control" onChange={(e) => setFrontPhoto(e.target.files[0])} />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh mặt sau CMND:</label>
          <input type="file" className="form-control" onChange={(e) => setBackPhoto(e.target.files[0])} />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh khuôn mặt:</label>
          <input type="file" className="form-control" onChange={(e) => setFacePhoto(e.target.files[0])} />
        </div>

        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
      </form>
    </div>
  );
}

export default UpdateHousekeeperPage;
