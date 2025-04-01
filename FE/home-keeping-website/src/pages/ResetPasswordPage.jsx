import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // ✅ Get token from URL
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn.", { position: "top-center" });
    } else {
      console.log("✅ Token from URL:", token); // 🔍 Debug log
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      token: token,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };

    console.log("🔍 Sending payload:", payload); // 🔍 Debug log

    try {
      await axios.post('http://localhost:5280/api/Account/Reset-password', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Mật khẩu đã được đặt lại thành công.", { position: "top-center" });
    } catch (error) {
      console.error("❌ API Error:", error.response); // 🔍 More detailed error
      toast.error(error.response?.data || "Đặt lại mật khẩu thất bại.", { position: "top-center" });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <ToastContainer />
      <div className="p-4 shadow bg-white rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center mb-4">Đặt lại mật khẩu</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning text-white w-100">Đặt lại mật khẩu</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
