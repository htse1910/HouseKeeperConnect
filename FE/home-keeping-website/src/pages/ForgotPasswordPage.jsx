import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/Account/Request-forgot-password`, email, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Email đặt lại mật khẩu đã được gửi.", { position: "top-center" });
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra.", { position: "top-center" });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <ToastContainer />
      <div className="p-4 shadow bg-white rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center mb-4">Quên mật khẩu</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-warning text-white w-100">Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
