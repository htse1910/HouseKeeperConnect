import React, { useState } from 'react';
import { FaGoogle, FaFacebook, FaLock, FaEnvelope } from 'react-icons/fa';
import FamilyImage from '../components/images/family.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('https://6781283585151f714b099ef9.mockapi.io/users');
      const users = response.data;

      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store role in localStorage
        localStorage.setItem('userRole', user.role);

        // Display role-based Toastify notification
        if (user.role === 'Gia đình') {
          toast.success(`Welcome ${user.fullName}! You are logged in as a Family member.`, {
            position: 'top-center',
            autoClose: 3000,
          });
        } else if (user.role === 'Người giúp việc') {
          toast.success(`Welcome ${user.fullName}! You are logged in as a Helper.`, {
            position: 'top-center',
            autoClose: 3000,
          });
        } else {
          toast.success(`Welcome ${user.fullName}!`, {
            position: 'top-center',
            autoClose: 3000,
          });
        }

        // Redirect to HomePage after a short delay
        setTimeout(() => {
          navigate('/'); // Redirect to HomePage
        }, 3000);
      } else {
        // Clear role in case of failed login
        localStorage.removeItem('userRole');

        toast.error('Invalid email or password.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };
  
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#fff' }}
    >
      <ToastContainer />
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

          <form onSubmit={handleSubmit} className="flex-grow-1">
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
                  value={formData.email}
                  onChange={handleInputChange}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control border-start-0"
                  style={{ borderRadius: '0 5px 5px 0' }}
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input type="checkbox" id="remember" className="form-check-input" />
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
          <p className="fw-bold mt-3">Đăng nhập để tìm được giúp đỡ tốt nhất</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
