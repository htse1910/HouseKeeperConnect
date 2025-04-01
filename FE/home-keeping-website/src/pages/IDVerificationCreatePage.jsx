import React from "react";
import { Link } from "react-router-dom";
import IDVerificationForm from "../components/IDVerificationForm";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const IDVerificationCreatePage = () => {
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  const handleFormSubmit = async (formData) => {
    const body = new FormData();
    body.append("FrontPhoto", formData.frontPhoto);
    body.append("BackPhoto", formData.backPhoto);
    body.append("FacePhoto", formData.facePhoto);

    try {
      const response = await fetch(
        `http://localhost:5280/api/IDVerifications/CreateIDVerification?housekeeperId=${housekeeperID}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ " + (result.message || "Xác minh thành công!"));
      } else {
        toast.warn("⚠️ " + (result.message || "Không thể gửi xác minh."));
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Lỗi khi gửi dữ liệu.");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Xác minh giấy tờ tùy thân</h3>
        <Link to="/housekeeper/update-verification" className="btn btn-warning">
          Cập nhật giấy tờ xác minh
        </Link>
      </div>

      <p className="text-muted mb-3">Vui lòng gửi ảnh chụp giấy tờ theo yêu cầu bên dưới.</p>
      <IDVerificationForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default IDVerificationCreatePage;
