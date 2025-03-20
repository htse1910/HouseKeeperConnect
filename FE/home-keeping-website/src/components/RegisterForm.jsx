import React from 'react';
import { FaLock, FaPhone, FaEnvelope, FaUser, FaCreditCard, FaInfoCircle, FaUserTie } from 'react-icons/fa';

function RegisterForm({ formData, onInputChange, onSubmit }) {
  return (
    <div className="p-4 shadow rounded" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}>
      <h2 className="text-center fw-bold" style={{ color: '#FF7F00', marginBottom: '20px' }}>
        TẠO TÀI KHOẢN
      </h2>

      <form onSubmit={onSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="Name" className="form-label">Họ và tên</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaUser /></span>
            <input
              id="Name"
              type="text"
              value={formData.Name}
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

        {/* Bank Account Number */}
        <div className="mb-4">
          <label htmlFor="BankAccountNumber" className="form-label">Số tài khoản ngân hàng</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaCreditCard /></span>
            <input
              id="BankAccountNumber"
              type="text"
              value={formData.BankAccountNumber}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="mb-4">
          <label htmlFor="GenderID" className="form-label">Giới tính</label>
          <select
            id="GenderID"
            className="form-select"
            value={formData.GenderID}
            onChange={onInputChange}
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="1">Nam</option>
            <option value="2">Nữ</option>
          </select>
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

        {/* Introduction */}
        <div className="mb-4">
          <label htmlFor="Introduction" className="form-label">Giới thiệu</label>
          <textarea
            id="Introduction"
            className="form-control"
            value={formData.Introduction}
            onChange={onInputChange}
            required
          />
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
