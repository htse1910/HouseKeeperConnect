import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaIdCard,
  FaIdBadge,
  FaUser,
  FaCalendarAlt,
  FaCheck,
  FaUpload,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const UpdateVerificationPage = () => {
  const [realName, setRealName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [verifyID] = useState(localStorage.getItem("verifyID"));

  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!verifyID || !authToken) return;

    fetch(`http://localhost:5280/api/IDVerifications/GetIDVerificationByID?id=${verifyID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRealName(data.realName || "");
        setIdNumber(data.idNumber || "");
        setDateOfBirth(data.dateOfBirth?.split("T")[0] || "");
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu xác minh:", err);
        toast.error("Không thể tải dữ liệu xác minh.");
      });
  }, [verifyID, authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("VerifyID", verifyID);
    formData.append("RealName", realName);
    formData.append("IDNumber", idNumber);
    formData.append("DateOfBirth", new Date(dateOfBirth).toISOString());
    if (frontPhoto) formData.append("FrontPhoto", frontPhoto);
    if (backPhoto) formData.append("BackPhoto", backPhoto);
    if (facePhoto) formData.append("FacePhoto", facePhoto);

    try {
      const res = await fetch("http://localhost:5280/api/IDVerifications/UpdateIDVerification", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const result = await res.text();

      if (res.ok) {
        toast.success("✅ Cập nhật giấy tờ xác minh thành công!");
        setTimeout(() => navigate(-1), 2000);
      } else {
        toast.error("❌ Lỗi: " + result);
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("❌ Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-4">
          <FaIdCard className="me-2 text-primary" />
          Cập nhật giấy tờ xác minh
        </h4>

        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="form-label text-muted small">
              <FaUser className="me-2 text-danger" />
              Họ tên
            </label>
            <input
              type="text"
              className="form-control fw-semibold"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small">
              <FaIdBadge className="me-2 text-danger" />
              Số CMND/CCCD
            </label>
            <input
              type="text"
              className="form-control fw-semibold"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label text-muted small">
              <FaCalendarAlt className="me-2 text-danger" />
              Ngày sinh
            </label>
            <input
              type="date"
              className="form-control fw-semibold"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Ảnh mặt trước CMND</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFrontPhoto(e.target.files[0])}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Ảnh mặt sau CMND</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setBackPhoto(e.target.files[0])}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Ảnh khuôn mặt</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFacePhoto(e.target.files[0])}
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary px-4 rounded-pill fw-semibold">
              <FaUpload className="me-2" />
              Lưu cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVerificationPage;
