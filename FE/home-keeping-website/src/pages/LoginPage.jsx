import React, { useState } from 'react';
import { FaGoogle, FaFacebook, FaLock, FaEnvelope } from 'react-icons/fa';
import FamilyImage from '../components/images/family.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send login request to the backend
      const response = await axios.get(
        `http://localhost:5280/api/Account/Login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      );
  
      if (response.status === 200) {
        const loginData = response.data;
  
        // Store authentication data
        localStorage.setItem('authToken', loginData.token);
        localStorage.setItem('userRoleID', loginData.roleID); // Store RoleID
        localStorage.setItem('userName', loginData.name);
  
        // Show success message
        toast.success(`Welcome ${loginData.name}!`, {
          position: 'top-center',
          autoClose: 3000,
        });
  
        // Redirect based on RoleID
        switch (loginData.roleID) {
          case 1: // Housekeeper
            navigate('/housekeeper-dashboard');
            break;
          case 2: // Family
            navigate('/family-dashboard');
            break;
          case 3: // Staff (Add dashboard if needed)
            navigate('/staff-dashboard');
            break;
          case 4: // Admin (Add dashboard if needed)
            navigate('/admin-dashboard');
            break;
          default:
            toast.error('Invalid role. Please contact support.', {
              position: 'top-center',
              autoClose: 3000,
            });
        }
      }
    } catch (error) {
      toast.error('Invalid email or password.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };
  
  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#fff' }}>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-stretch" style={{ width: '100%', maxWidth: '1100px', gap: '10px' }}>
        {/* Login Form */}
        <div className="p-4 shadow rounded d-flex flex-column" style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff' }}>
          <h2 className="fw-bold" style={{ color: '#FF7F00', marginBottom: '20px' }}>
            ĐĂNG NHẬP
          </h2>

          <form onSubmit={handleSubmit} className="flex-grow-1">
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaEnvelope /></span>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control border-start-0"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                <input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control border-start-0"
                  required
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input type="checkbox" id="remember" className="form-check-input" />
                <label htmlFor="remember" className="form-check-label">Ghi nhớ đăng nhập</label>
              </div>
              <a href="#" style={{ color: '#FF7F00', textDecoration: 'none' }}>Quên mật khẩu?</a>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-warning text-white fw-bold w-100 mb-3" style={{ height: '50px' }}>
              Đăng nhập
            </button>

            {/* Divider */}
            <div className="text-center text-muted mb-3">Hoặc</div>

            {/* Social Login Buttons */}
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-50 me-2" style={{ height: '50px' }}>
                <FaGoogle className="me-2" /> Google
              </button>
              <button type="button" className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-50" style={{ height: '50px' }}>
                <FaFacebook className="me-2" /> Facebook
              </button>
            </div>
          </form>
        </div>

        {/* Image and Text */}
        <div className="p-4 shadow rounded text-center d-flex flex-column justify-content-start align-items-center" style={{ width: '100%', maxWidth: '590px', backgroundColor: '#fff' }}>
          <img src={FamilyImage} alt="Family" className="img-fluid mb-3" style={{ borderRadius: '10px', maxWidth: '72%' }} />
          <p className="fw-bold mt-3">Đăng nhập để tìm được giúp đỡ tốt nhất</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
