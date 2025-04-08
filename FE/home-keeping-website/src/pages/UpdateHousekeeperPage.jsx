import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "../components/ScrollToTopButton";

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

  useEffect(() => {
    if (!accountId || !authToken) {
      toast.error("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
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
      .catch((error) => {
        console.error("Error fetching housekeeper details:", error);
        toast.error("Lỗi khi tải thông tin.");
      });
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
        toast.success("✅ Cập nhật thành công!");
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error(text || "❌ Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("❌ Lỗi khi cập nhật.");
    }
  };

  return (
    <div className="container my-5">
      <ScrollToTopButton />
      <ToastContainer />
      <div className="card shadow-sm p-4 border-0">
        <h4 className="fw-bold mb-4 text-primary">Cập nhật thông tin người giúp việc</h4>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Họ tên</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Số điện thoại</label>
            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Số tài khoản ngân hàng</label>
            <input type="text" className="form-control" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
          </div>

          <div className="col-12">
            <label className="form-label">Giới thiệu</label>
            <textarea className="form-control" rows={3} value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
          </div>

          <div className="col-12">
            <label className="form-label">Địa chỉ</label>
            <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Ảnh đại diện</label>
            <input type="file" className="form-control" onChange={(e) => setLocalProfilePicture(e.target.files[0])} />
          </div>

          <div className="col-12 text-end mt-4">
            <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateHousekeeperPage;