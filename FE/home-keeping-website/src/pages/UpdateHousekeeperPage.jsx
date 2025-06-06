import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "../components/ScrollToTopButton";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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
  const [gender, setGender] = useState(0);
  const [nickname, setNickname] = useState("");
  const [workType, setWorkType] = useState(0);
  const [bankAccountName, setBankAccountName] = useState("");

  useEffect(() => {
    if (!accountId || !authToken) {
      toast.error("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
      return;
    }

    fetch(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByAccountID?id=${accountId}`, {
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
        setGender(data.gender ?? 0);
        setNickname(data.nickname ?? "");
        setWorkType(data.workType ?? 0);
        setBankAccountName(data.bankAccountName || "");
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
    formData.append("Gender", gender);
    formData.append("Nickname", nickname);
    formData.append("WorkType", workType);
    formData.append("BankAccountName", bankAccountName);

    if (localProfilePicture) formData.append("LocalProfilePicture", localProfilePicture);

    try {
      const response = await fetch(`${API_BASE_URL}/HouseKeeper/UpdateHousekeeper`, {
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
            <input
              type="text"
              className="form-control"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
            <small className="text-danger">Bạn phải nhập đúng số tài khoản của bạn để tránh chuyển sai tài khoản</small>
          </div>

          <div className="col-md-6">
            <label className="form-label">Ngân hàng</label>
            <select
              className="form-select"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
            >
              <option value="">Chọn ngân hàng</option>
              <option value="Vietcombank">Vietcombank</option>
              <option value="VietinBank">VietinBank</option>
              <option value="Techcombank">Techcombank</option>
              <option value="BIDV">BIDV</option>
              <option value="MBBank">MBBank</option>
              <option value="VPBank">VPBank</option>
              <option value="ACB">ACB</option>
              <option value="TPBank">TPBank</option>
              <option value="VIB">VIB</option>
              <option value="Agribank">Agribank</option>
            </select>
            <small className="text-danger">Bạn phải chọn đúng tên ngân hàng để giao dịch thành công</small>
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
            <label className="form-label">Giới tính</label>
            <select className="form-select" value={gender} onChange={(e) => setGender(Number(e.target.value))}>
              <option value={1}>Nam</option>
              <option value={2}>Nữ</option>
              <option value={0}>Khác</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Biệt danh</label>
            <input type="text" className="form-control" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Loại công việc</label>
            <select className="form-select" value={workType} onChange={(e) => setWorkType(Number(e.target.value))}>
              <option value={0}>Chọn loại công việc</option>
              <option value={1}>Một lần duy nhất</option>
              <option value={2}>Định kỳ</option>
            </select>
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