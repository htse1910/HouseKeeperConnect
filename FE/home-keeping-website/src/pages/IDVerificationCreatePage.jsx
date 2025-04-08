import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IDVerificationForm from "../components/IDVerificationForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "../components/ScrollToTopButton";

const IDVerificationCreatePage = () => {
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");
  const verifyID = localStorage.getItem("verifyID");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

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
        setTimeout(() => navigate(-1), 800);
      } else {
        toast.warn("⚠️ " + (result.message || "Không thể gửi xác minh."));
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Lỗi khi gửi dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <ScrollToTopButton />
      <ToastContainer />
      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">
            📄 Xác minh giấy tờ tùy thân
          </h4>
          <Link
            to="/housekeeper/update-verification"
            className="btn btn-outline-warning fw-semibold rounded-pill"
          >
            🔁 Cập nhật xác minh
          </Link>
        </div>

        {verifyID && verifyID !== "0" ? (
          <div className="alert alert-info mb-0">
            Bạn đã gửi thông tin xác minh. Nếu cần, vui lòng cập nhật thay vì gửi mới.
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">
              Vui lòng tải lên hình ảnh giấy tờ theo định dạng yêu cầu bên dưới.
            </p>
            <IDVerificationForm onSubmit={handleFormSubmit} disabled={isSubmitting} />
          </>
        )}
      </div>
    </div>
  );
};

export default IDVerificationCreatePage;
