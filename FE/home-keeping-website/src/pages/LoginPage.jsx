import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mock API endpoint for users
      const response = await axios.get('https://6781283585151f714b099ef9.mockapi.io/users');
      const users = response.data;

      // Check if the user exists and the password matches
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate('/'); // Redirect to the home page after login
        }, 3000);
      } else {
        toast.error('Invalid email or password', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Error during login:', err);
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#fff' }}
    >
      <ToastContainer /> {/* Toastify container for notifications */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="fw-bold" style={{ color: '#333' }}>Đăng nhập</h2>
        <p>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'orange', fontWeight: 'bold' }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <form style={{ width: '100%', maxWidth: '400px' }} onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Nhập địa chỉ email của bạn"
            className="form-control"
            style={{
              border: '1px solid orange',
              borderRadius: '5px',
              height: '46px',
              padding: '10px',
            }}
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu của bạn"
            className="form-control"
            style={{
              border: '1px solid orange',
              borderRadius: '5px',
              height: '46px',
              padding: '10px',
            }}
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        {/* Error Message */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

        {/* Submit Button */}
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: '#FFC27A',
              border: 'none',
              borderRadius: '25px',
              height: '50px',
              width: '100%',
              maxWidth: '400px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
