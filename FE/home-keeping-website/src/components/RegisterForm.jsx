import React from 'react';
import { FaGoogle, FaFacebook, FaLock, FaPhone, FaEnvelope } from 'react-icons/fa';

function RegisterForm({ role, onRoleChange, formData, onInputChange, onSubmit }) {
  return (
    <div
      className="p-4 shadow rounded"
      style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}
    >
      <h2 className="text-center fw-bold" style={{ color: '#FF7F00', marginBottom: '20px' }}>
        TẠO TÀI KHOẢN
      </h2>

      {/* Role Selection */}
      <div className="d-flex justify-content-center mb-4">
        <div className="form-check me-3">
          <input
            type="radio"
            id="family"
            name="role"
            value="Gia đình"
            className="form-check-input"
            checked={role === 'Gia đình'}
            onChange={onRoleChange}
          />
          <label htmlFor="family" className="form-check-label">
            Gia đình
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="helper"
            name="role"
            value="Người giúp việc"
            className="form-check-input"
            checked={role === 'Người giúp việc'}
            onChange={onRoleChange}
          />
          <label htmlFor="helper" className="form-check-label">
            Người giúp việc
          </label>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="form-label">
            Họ và tên
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={onInputChange}
            className="form-control"
            style={{ border: '1px solid #e0e0e0', borderRadius: '5px' }}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaEnvelope />
            </span>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={onInputChange}
              className="form-control border-start-0"
              style={{ borderRadius: '0 5px 5px 0' }}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="form-label">
            Số điện thoại
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaPhone />
            </span>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={onInputChange}
              className="form-control border-start-0"
              style={{ borderRadius: '0 5px 5px 0' }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Mật khẩu
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaLock />
            </span>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={onInputChange}
              className="form-control border-start-0"
              style={{ borderRadius: '0 5px 5px 0' }}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">
            Xác nhận mật khẩu
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaLock />
            </span>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onInputChange}
              className="form-control border-start-0"
              style={{ borderRadius: '0 5px 5px 0' }}
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="form-label">
            Địa chỉ
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={onInputChange}
            className="form-control"
            style={{ border: '1px solid #e0e0e0', borderRadius: '5px' }}
          />
        </div>

        {/* City Selection */}
        <div className="mb-4">
          <label htmlFor="city" className="form-label">
            Thành phố
          </label>
          <select
            id="city"
            value={formData.city}
            onChange={onInputChange}
            className="form-control"
            style={{ border: '1px solid #e0e0e0', borderRadius: '5px' }}
          >
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-warning text-white fw-bold w-100 mt-4"
          style={{ height: '50px' }}
        >
          Đăng ký ngay
        </button>
      </form>

      {/* Divider */}
      <div className="text-center text-muted mt-3 mb-3">
        <hr />
        Hoặc đăng ký với
      </div>

      {/* Social Login Buttons */}
      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-50 me-2"
          style={{
            height: '50px',
            transition: 'background-color 0.3s, color 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF7F00';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.color = '';
          }}
        >
          <FaGoogle style={{ color: '#DB4437' }} className="me-2" /> Google
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-50"
          style={{
            height: '50px',
            transition: 'background-color 0.3s, color 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF7F00';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.color = '';
          }}
        >
          <FaFacebook style={{ color: '#1877F2' }} className="me-2" /> Facebook
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
