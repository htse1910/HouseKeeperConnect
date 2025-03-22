import React, { useEffect, useState } from "react";
import IDVerificationForm from "../components/IDVerificationForm";

const IDVerificationCreatePage = () => {
  const [existingVerification, setExistingVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const housekeeperID = localStorage.getItem("housekeeperID");
  const verifyID = localStorage.getItem("verifyID");

  useEffect(() => {
    if (!verifyID || !authToken) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5280/api/IDVerifications/GetIDVerificationByID?id=${verifyID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setExistingVerification(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi kiểm tra xác minh:", err);
        setLoading(false);
      });
  }, [verifyID, authToken]);

  const updateVerificationStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5280/api/HouseKeeper/update-verification-status?housekeeperId=${housekeeperID}&isVerified=true`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const result = await response.text();
      if (response.ok) alert("✅ Trạng thái xác minh đã được cập nhật!");
      else alert("⚠️ Không thể cập nhật trạng thái xác minh: " + result);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái xác minh:", error);
      alert("❌ Đã xảy ra lỗi khi cập nhật.");
    }
  };

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
        await updateVerificationStatus();
      } else {
        alert("⚠️ " + (result.message || "Không thể gửi xác minh."));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Lỗi khi gửi dữ liệu.");
    }
  };

  if (loading) return <div className="container py-4">Đang kiểm tra trạng thái xác minh...</div>;

  if (existingVerification) {
    return (
      <div className="container py-4">
        <h3 className="mb-4">Đã xác minh giấy tờ</h3>
        <div className="card p-4 shadow-sm">
          <p><strong>Mã xác minh:</strong> {existingVerification.verifyID}</p>
          <p><strong>Họ tên:</strong> {existingVerification.realName}</p>
          <p><strong>Số CMND/CCCD:</strong> {existingVerification.idNumber ?? "Không có"}</p>
          <p><strong>Ngày sinh:</strong> {new Date(existingVerification.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Trạng thái:</strong> {existingVerification.status === 1 ? "Active" : "Inactive"}</p>
          <p><strong>Tạo lúc:</strong> {new Date(existingVerification.createdAt).toLocaleString()}</p>
          <p><strong>Cập nhật gần nhất:</strong> {new Date(existingVerification.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Xác minh giấy tờ tùy thân</h3>
      <IDVerificationForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default IDVerificationCreatePage;
