import React from 'react';
import { FaLock, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';

function RegisterForm({ formData, onInputChange, onSubmit }) {
  return (
    <div className="p-4 shadow rounded" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}>
      <h2 className="text-center fw-bold" style={{ color: '#FF7F00', marginBottom: '20px' }}>
        TẠO TÀI KHOẢN
      </h2>

      <form onSubmit={onSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="form-label">Họ và tên</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaUser /></span>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaEnvelope /></span>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaPhone /></span>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Mật khẩu</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock /></span>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaLock /></span>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label htmlFor="roleID" className="form-label">Vai trò</label>
          <select
            id="roleID"
            className="form-select"
            value={formData.roleID}
            onChange={onInputChange}
            required
          >
            <option value="">Chọn vai trò</option>
            <option value="1">Người giúp việc</option>
            <option value="2">Gia đình</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-warning text-white fw-bold w-100 mt-4" style={{ height: '50px' }}>
          Đăng ký ngay
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
