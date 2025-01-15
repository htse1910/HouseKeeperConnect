import React from 'react';
import { FaGoogle, FaFacebook, FaLock, FaEnvelope } from 'react-icons/fa';
import FamilyImage from '../components/images/family.png';

function LoginPage() {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#fff' }}
    >
      <div
        className="d-flex justify-content-between align-items-stretch"
        style={{ width: '100%', maxWidth: '1100px', gap: '10px' }}
      >
        {/* Login Form */}
        <div
          className="p-4 shadow rounded d-flex flex-column"
          style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}
        >
          <h2 className="fw-bold" style={{ color: '#FF7F00', marginBottom: '20px' }}>
            ĐĂNG NHẬP
          </h2>

          <form className="flex-grow-1">
            {/* Email Field */}
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
                  placeholder="example@gmail.com"
                  className="form-control border-start-0"
                  style={{ borderRadius: '0 5px 5px 0' }}
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="Nhập mật khẩu"
                  className="form-control border-start-0"
                  style={{ borderRadius: '0 5px 5px 0' }}
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="remember"
                  className="form-check-input"
                />
                <label htmlFor="remember" className="form-check-label">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a href="#" style={{ color: '#FF7F00', textDecoration: 'none' }}>
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-warning text-white fw-bold w-100 mb-3"
              style={{ height: '50px' }}
            >
              Đăng nhập
            </button>

            {/* Divider */}
            <div className="text-center text-muted mb-3">Hoặc</div>

            {/* Social Login Buttons */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-50 me-2"
                style={{ height: '50px' }}
              >
                <FaGoogle className="me-2" /> Google
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-50"
                style={{ height: '50px' }}
              >
                <FaFacebook className="me-2" /> Facebook
              </button>
            </div>
          </form>
        </div>

        {/* Image and Text */}
        <div
          className="p-4 shadow rounded text-center d-flex flex-column justify-content-start align-items-center"
          style={{ width: '100%', maxWidth: '590px', backgroundColor: '#fff' }}
        >
          <img
            src={FamilyImage}
            alt="Family"
            className="img-fluid mb-3"
            style={{ borderRadius: '10px', maxWidth: '72%' }}
          />
          <p className="fw-bold mt-3">
            Đăng nhập để tìm được giúp đỡ tốt nhất
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
