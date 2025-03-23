import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UpdateHousekeeperPage() {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [location, setLocation] = useState("");
  const [localProfilePicture, setLocalProfilePicture] = useState(null);
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!accountId || !authToken) {
      setMessage("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
      return;
    }

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setIntroduction(data.introduction || "");
        setBankAccount(data.bankAccountNumber || "");
        setLocation(data.address || "");
      })
      .catch((error) => console.error("Error fetching housekeeper details:", error));
  }, [accountId, authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("AccountID", accountId);
    formData.append("Name", name);
    formData.append("Phone", phone);
    formData.append("Email", email);
    formData.append("Introduction", introduction);
    formData.append("BankAccountNumber", bankAccount);
    formData.append("Address", location);

    if (localProfilePicture) formData.append("LocalProfilePicture", localProfilePicture);
    if (frontPhoto) formData.append("FrontPhoto", frontPhoto);
    if (backPhoto) formData.append("BackPhoto", backPhoto);
    if (facePhoto) formData.append("FacePhoto", facePhoto);

    try {
      const response = await fetch("http://localhost:5280/api/HouseKeeper/UpdateHousekeeper", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const text = await response.text();
      if (response.ok) {
        setMessage("Cập nhật thành công!");
        navigate(`/housekeeper/${accountId}`);
      } else {
        setMessage(text || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setMessage("Lỗi khi cập nhật.");
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4">Cập nhật thông tin người giúp việc</h2>
        {message && <p className="alert alert-info">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ tên:</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Số điện thoại:</label>
            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Giới thiệu:</label>
            <textarea className="form-control" rows={3} value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Số tài khoản ngân hàng:</label>
            <input type="text" className="form-control" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Địa chỉ:</label>
            <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Ảnh đại diện:</label>
            <input type="file" className="form-control" onChange={(e) => setLocalProfilePicture(e.target.files[0])} />
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

          <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateHousekeeperPage;
