import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateHousekeeperPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleID: 1, // Default to Housekeeper
    status: 1, // Default to Active
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("Bạn cần đăng nhập lại.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải dữ liệu.");
        return response.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: "",
          roleID: data.roleID,
          status: data.status,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải thông tin tài khoản.");
        setLoading(false);
      });
  }, [accountId]);

  const handleUpdate = () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Bạn cần đăng nhập lại!");
      return;
    }

    const url = new URL("http://localhost:5280/api/Account/UpdateAccount");
    url.searchParams.append("AccountID", accountId);
    url.searchParams.append("Name", formData.name);
    url.searchParams.append("Email", formData.email);
    url.searchParams.append("Password", formData.password || ""); 
    url.searchParams.append("RoleID", formData.roleID);
    url.searchParams.append("Phone", formData.phone);
    url.searchParams.append("Status", formData.status);

    fetch(url, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${authToken}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Cập nhật thất bại.");
        return response.text();
      })
      .then((message) => {
        alert("Cập nhật thành công!");
        navigate(`/housekeeper/${accountId}`);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật:", error);
        alert("Không thể cập nhật tài khoản.");
      });
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h3 className="fw-bold">Cập nhật thông tin</h3>

        <label>Họ và tên:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-control mb-2"
        />

        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-control mb-2"
        />

        <label>Số điện thoại:</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-control mb-2"
        />

        <label>Mật khẩu (để trống nếu không thay đổi):</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="form-control mb-2"
        />

        <label>Vai trò:</label>
        <select
          className="form-control mb-2"
          value={formData.roleID}
          onChange={(e) => setFormData({ ...formData, roleID: Number(e.target.value) })}
        >
          <option value={1}>Người giúp việc</option>
          <option value={2}>Gia đình</option>
        </select>

        <label>Trạng thái:</label>
        <select
          className="form-control mb-2"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
        >
          <option value={1}>Hoạt động</option>
          <option value={0}>Không hoạt động</option>
        </select>

        <div className="d-flex gap-3 mt-3">
          <button className="btn btn-danger" onClick={() => navigate(`/housekeeper/${accountId}`)}>Hủy</button>
          <button className="btn btn-success" onClick={handleUpdate}>Cập nhật</button>
        </div>
      </div>
    </div>
  );
}

export default UpdateHousekeeperPage;
