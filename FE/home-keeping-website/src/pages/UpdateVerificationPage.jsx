import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateVerificationPage = () => {
  const [realName, setRealName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [verifyID, setVerifyID] = useState(localStorage.getItem("verifyID"));
  const [message, setMessage] = useState("");

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
      .catch((err) => console.error("Lỗi khi tải dữ liệu xác minh:", err));
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
        setMessage("✅ Cập nhật giấy tờ xác minh thành công!");
        setTimeout(() => navigate("/housekeeper/id-verification"), 1500);
      } else {
        setMessage("❌ Lỗi: " + result);
      }
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  return (
    <div className="container my-5">
      <div className="card p-4 shadow-sm">
        <h3 className="mb-4">Cập nhật giấy tờ xác minh</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ tên:</label>
            <input type="text" className="form-control" value={realName} onChange={(e) => setRealName(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Số CMND/CCCD:</label>
            <input type="text" className="form-control" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Ngày sinh:</label>
            <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Ảnh mặt trước CMND:</label>
            <input type="file" className="form-control" onChange={(e) => setFrontPhoto(e.target.files[0])} />
          </div>

          <div className="mb-3">
            <label className="form-label">Ảnh mặt sau CMND:</label>
            <input type="file" className="form-control" onChange={(e) => setBackPhoto(e.target.files[0])} />
          </div>

          <div className="mb-4">
            <label className="form-label">Ảnh khuôn mặt:</label>
            <input type="file" className="form-control" onChange={(e) => setFacePhoto(e.target.files[0])} />
          </div>

          <button type="submit" className="btn btn-primary">Lưu cập nhật</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVerificationPage;
