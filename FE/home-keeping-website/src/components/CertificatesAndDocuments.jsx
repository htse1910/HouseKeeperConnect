import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
            setDateOfBirth(new Date(verification.dateOfBirth).toLocaleDateString());
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
      <div className="card p-4 shadow-sm w-100 h-100">
        <h5 className="fw-bold mb-3">Giấy tờ</h5>
        <ul className="list-unstyled">
          {realName && <li><strong>Họ tên:</strong> {realName}</li>}
          {idNumber && <li><strong>Số CMND/CCCD:</strong> {idNumber}</li>}
          {dateOfBirth && <li><strong>Ngày sinh:</strong> {dateOfBirth}</li>}
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
