import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaIdCard,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const CertificatesAndDocuments = () => {
  const [createdAt, setCreatedAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState("...");

  useEffect(() => {
    const verifyID = localStorage.getItem("verifyID");
    const token = localStorage.getItem("authToken");

    if (!verifyID || !token) return;

    fetch(`${API_BASE_URL}/IDVerifications/GetIDVerificationByID?id=${verifyID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((verification) => {
        if (verification) {
          if (verification.createdAt) {
            setCreatedAt(new Date(verification.createdAt).toLocaleString("vi-VN"));
          }
          if (verification.updatedAt) {
            setUpdatedAt(new Date(verification.updatedAt).toLocaleString("vi-VN"));
          }

          switch (verification.status) {
            case 1:
              setVerifyStatus("Đang chờ");
              break;
            case 2:
              setVerifyStatus("Đã xác minh");
              break;
            default:
              setVerifyStatus("Không rõ");
          }
        }
      })
      .catch((err) => console.error("Lỗi khi lấy thông tin giấy tờ:", err));
  }, []);

  return (
    <div className="col-md-6 d-flex">
      <div className="card shadow-sm border-0 p-4 w-100 h-100">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
            style={{ width: 40, height: 40 }}
          >
            <FaIdCard className="text-primary" />
          </div>
          <h5 className="fw-bold mb-0">Giấy tờ tùy thân</h5>
        </div>

        {/* 2-Column Info */}
        <div className="row g-3">
          <div className="col-sm-6">
            <div className="text-muted small">Ngày tạo hồ sơ</div>
            <div className="fw-bold hover-gold">
              {createdAt || "Chưa có"}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Cập nhật gần nhất</div>
            <div className="fw-bold hover-gold">
              {updatedAt || "Chưa có"}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Trạng thái</div>
            <div className="fw-bold">
              {verifyStatus === "Đã xác minh" ? (
                <span className="text-success">
                  <FaCheckCircle className="me-1" />
                  {verifyStatus}
                </span>
              ) : (
                <span className="text-warning">
                  <FaClock className="me-1" />
                  {verifyStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-4 text-end">
          <Link
            to="/housekeeper/upload-id"
            className="btn btn-sm px-3 py-2 rounded-pill border-0 fw-semibold"
            style={{
              backgroundColor: "#e3f2fd",
              color: "#0d6efd",
            }}
          >
            📎 Xem / Cập nhật giấy tờ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CertificatesAndDocuments;