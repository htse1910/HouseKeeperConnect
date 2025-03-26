import React from "react";
import { Link } from "react-router-dom";
import IDVerificationForm from "../components/IDVerificationForm";

const IDVerificationCreatePage = () => {
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const handleFormSubmit = async (formData) => {
    const body = new FormData();
    body.append("IDNumber", formData.idNumber);
    body.append("RealName", formData.realName);
    body.append("DateOfBirth", new Date(formData.dateOfBirth).toISOString());
    body.append("FrontPhoto", formData.frontPhoto);
    body.append("BackPhoto", formData.backPhoto);
    body.append("FacePhoto", formData.facePhoto);

    try {
      const response = await fetch(
        `http://localhost:5280/api/IDVerifications/CreateIDVerification?housekeeperId=${accountID}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body,
        }
      );
      const result = await response.json();

      if (response.ok) {
        alert("✅ " + (result.message || "Xác minh thành công!"));
      } else {
        alert("⚠️ " + (result.message || "Không thể gửi xác minh."));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Lỗi khi gửi dữ liệu.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Xác minh giấy tờ tùy thân</h3>
        <Link to="/housekeeper/update-verification" className="btn btn-warning">
          Cập nhật giấy tờ xác minh
        </Link>
      </div>

      <p className="text-muted mb-3">Bạn chưa xác minh, vui lòng gửi thông tin giấy tờ bên dưới.</p>
      <IDVerificationForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default IDVerificationCreatePage;
