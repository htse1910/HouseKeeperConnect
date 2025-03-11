import React, { useState } from "react";

function AddIdentificationPicturePage() {
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event, setPhoto) => {
    setPhoto(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!frontPhoto || !backPhoto || !facePhoto) {
      setError("Vui lòng tải lên tất cả ảnh.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append("AccountID", accountID);
    formData.append("FrontPhoto", frontPhoto);
    formData.append("BackPhoto", backPhoto);
    formData.append("FacePhoto", facePhoto);

    try {
      const response = await fetch(`http://localhost:5280/api/HouseKeeper/AddHousekeeper?AccountID=${accountID}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`, // Send authorization token if required
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Không thể tải ảnh lên. Vui lòng thử lại.");
      }

      setMessage("Ảnh đã được tải lên thành công!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Thêm Ảnh Xác Minh Danh Tính</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Account ID (Read-only) */}
        <div className="mb-3">
          <label className="form-label fw-bold">Mã Tài Khoản:</label>
          <input
            type="text"
            className="form-control"
            value={accountID}
            readOnly
          />
        </div>

        {/* Front Photo */}
        <div className="mb-3">
          <label className="form-label fw-bold">Ảnh mặt trước CMND/CCCD:</label>
          <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setFrontPhoto)} required />
        </div>

        {/* Back Photo */}
        <div className="mb-3">
          <label className="form-label fw-bold">Ảnh mặt sau CMND/CCCD:</label>
          <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setBackPhoto)} required />
        </div>

        {/* Face Photo */}
        <div className="mb-3">
          <label className="form-label fw-bold">Ảnh khuôn mặt:</label>
          <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setFacePhoto)} required />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang tải..." : "Tải lên ảnh"}
        </button>
      </form>
    </div>
  );
}

export default AddIdentificationPicturePage;
