import React from 'react';
import { FaLock, FaPhone, FaEnvelope, FaUser, FaCreditCard } from 'react-icons/fa';

function RegisterForm({ formData, onInputChange, onSubmit }) {
  return (
    <div className="p-4 shadow rounded" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}>
      <h2 className="text-center fw-bold" style={{ color: '#FF7F00', marginBottom: '20px' }}>
        TẠO TÀI KHOẢN
      </h2>

      <form onSubmit={onSubmit}>
        {/* Role Selection - Tick Option Style */}
        {/* Role Selection - Exclusive Checkboxes */}
        <div className="mb-4">
          <label className="form-label d-block">Vai trò</label>
          <div className="d-flex border rounded overflow-hidden">

            {/* Gia đình */}
            <label
              htmlFor="role-family"
              className={`flex-fill text-center py-2 m-0 d-flex align-items-center justify-content-center border-end ${formData.roleID === '2' ? 'bg-warning text-white fw-bold' : ''
                }`}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                id="role-family"
                checked={formData.roleID === '2'}
                onChange={() =>
                  onInputChange({ target: { id: 'roleID', value: formData.roleID === '2' ? '' : '2' } })
                }
                className="me-2 d-none"
              />
              Gia đình
            </label>

            {/* Người giúp việc */}
            <label
              htmlFor="role-helper"
              className={`flex-fill text-center py-2 m-0 d-flex align-items-center justify-content-center ${formData.roleID === '1' ? 'bg-warning text-white fw-bold' : ''
                }`}
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                id="role-helper"
                checked={formData.roleID === '1'}
                onChange={() =>
                  onInputChange({ target: { id: 'roleID', value: formData.roleID === '1' ? '' : '1' } })
                }
                className="me-2 d-none"
              />
              Người giúp việc
            </label>

          </div>
        </div>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="name" className="form-label">Họ và tên</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaUser /></span>
            <input
              id="name"
              type="text"
              value={formData.name}
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
          <label htmlFor="phone" className="form-label">Số điện thoại</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaPhone /></span>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
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
          <label htmlFor="bankAccountNumber" className="form-label">Số tài khoản ngân hàng</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaCreditCard /></span>
            <input
              id="bankAccountNumber"
              type="text"
              value={formData.bankAccountNumber}
              onChange={onInputChange}
              className="form-control border-start-0"
              required
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="mb-4">
          <label htmlFor="genderID" className="form-label">Giới tính</label>
          <select
            id="genderID"
            className="form-select"
            value={formData.genderID}
            onChange={onInputChange}
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="1">Nam</option>
            <option value="2">Nữ</option>
          </select>
        </div>

        {/* Introduction */}
        <div className="mb-4">
          <label htmlFor="introduction" className="form-label">Giới thiệu</label>
          <textarea
            id="introduction"
            className="form-control"
            value={formData.introduction}
            onChange={onInputChange}
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="form-label">Địa chỉ</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={onInputChange}
            className="form-control"
            required
          />
        </div>

        {/* Profile Picture Upload */}
        <div className="mb-4">
          <label htmlFor="localProfilePicture" className="form-label">Ảnh đại diện</label>
          <input
            id="localProfilePicture"
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="form-control"
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
