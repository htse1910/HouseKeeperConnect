import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CertificatesAndDocuments = () => {
  const [realName, setRealName] = useState("...");
  const [idNumber, setIdNumber] = useState("Chưa có");
  const [dateOfBirth, setDateOfBirth] = useState("...");
  const [verifyStatus, setVerifyStatus] = useState("...");
  const [verifyID, setVerifyID] = useState(null);

  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!housekeeperID || !authToken) return;

    // Step 1: Get verifyID
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByID?id=${housekeeperID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.verifyID) {
          setVerifyID(data.verifyID);

          // Step 2: Use verifyID to fetch ID verification data
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
          setRealName(verification.realName || "Chưa có");
          setIdNumber(verification.idNumber || "Chưa có");
          setDateOfBirth(
            verification.dateOfBirth
              ? new Date(verification.dateOfBirth).toLocaleDateString()
              : "Chưa có"
          );
          setVerifyStatus(
            verification.status === 1 ? "Đã xác minh" : "Chưa xác minh"
          );
        }
      })
      .catch((err) => console.error("Lỗi khi lấy thông tin giấy tờ:", err));
  }, [housekeeperID, authToken]);

  return (
    <div className="col-md-6 d-flex">
      <div className="card p-4 shadow-sm w-100 h-100">
        <h5 className="fw-bold mb-3">Giấy tờ</h5>
        <ul className="list-unstyled">
          <li><strong>Họ tên:</strong> {realName}</li>
          <li><strong>Số CMND/CCCD:</strong> {idNumber}</li>
          <li><strong>Ngày sinh:</strong> {dateOfBirth}</li>
          <li><strong>Trạng thái:</strong> {verifyStatus}</li>
        </ul>
        <Link to="/housekeeper/upload-id" className="btn btn-outline-primary mt-2">
          Xem / Cập nhật giấy tờ
        </Link>
      </div>
    </div>
  );
};

export default CertificatesAndDocuments;
