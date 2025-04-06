import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaIdCard,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const CertificatesAndDocuments = () => {
  const [realName, setRealName] = useState(null);
  const [idNumber, setIdNumber] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState("...");
  const [verifyID, setVerifyID] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByID?id=${accountID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.verifyID) {
          setVerifyID(data.verifyID);
          localStorage.setItem("verifyID", data.verifyID);

          return fetch(`http://localhost:5280/api/IDVerifications/GetIDVerificationByID?id=${data.verifyID}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
        }
      })
      .then((res) => res?.json())
      .then((verification) => {
        if (verification) {
          if (verification.realName && verification.realName !== "Chưa có") {
            setRealName(verification.realName);
          }
          if (verification.idNumber && verification.idNumber !== "Chưa có") {
            setIdNumber(verification.idNumber);
          }
          if (verification.dateOfBirth) {
            setDateOfBirth(new Date(verification.dateOfBirth).toLocaleDateString("vi-VN"));
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
  }, [accountID, authToken]);

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
            <div className="text-muted small">Họ tên</div>
            <div className="fw-bold hover-gold">
              {realName || "Chưa cập nhật"}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Ngày sinh</div>
            <div className="fw-bold hover-gold">
              {dateOfBirth || "Chưa cập nhật"}
            </div>
          </div>
          <div className="col-sm-6">
            <div className="text-muted small">Số CMND/CCCD</div>
            <div className="fw-bold hover-gold">
              {idNumber || "Chưa cập nhật"}
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
