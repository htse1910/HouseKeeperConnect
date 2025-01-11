import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    dob: '',
    gender: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = async () => {
    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        'https://6781283585151f714b099ef9.mockapi.io/users',
        formData
      );
      toast.success('User registered successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      console.log('User created:', response.data); // Debugging: Log the response
      setTimeout(() => {
        navigate('/confirm-account'); // Navigate after success
      }, 3000);
    } catch (error) {
      console.error('Error creating user:', error); // Debugging: Log the error
      toast.error('Failed to register user. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  const nextStep = () => {
    setStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#fff' }}
    >
      <ToastContainer />
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="fw-bold" style={{ color: '#333' }}>Tạo tài khoản</h2>
        <p>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'orange', fontWeight: 'bold' }}>
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      {/* Step Indicator */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', marginRight: s !== 3 ? '8px' : '0' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: s <= step ? 'orange' : '#e0e0e0',
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {s}
            </div>
            {s !== 3 && (
              <div
                style={{
                  flexGrow: 1,
                  height: '2px',
                  backgroundColor: s < step ? 'orange' : '#e0e0e0',
                  marginLeft: '8px',
                  marginRight: '8px',
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Conditional Rendering for Steps */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {step === 1 && (
          <div>
            <label htmlFor="email" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
              Địa chỉ email của bạn là gì?
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
            <button
              className="btn mt-4"
              style={{
                backgroundColor: '#FFC27A',
                border: 'none',
                borderRadius: '25px',
                height: '50px',
                width: '100%',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              onClick={nextStep}
            >
              Kế tiếp
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-4">
              <label htmlFor="fullName" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
                Họ và tên của bạn là gì?
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className="form-control"
                style={{
                  border: '1px solid orange',
                  borderRadius: '5px',
                  height: '46px',
                  padding: '10px',
                }}
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
                Ngày sinh của bạn là bao nhiêu?
              </label>
              <input
                id="dob"
                type="date"
                className="form-control"
                style={{
                  border: '1px solid orange',
                  borderRadius: '5px',
                  height: '46px',
                  padding: '10px',
                }}
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
                Giới tính của bạn là gì?
              </label>
              <div>
                <label className="me-3">
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    className="me-1"
                    onChange={handleGenderChange}
                  />{' '}
                  Nữ
                </label>
                <label className="me-3">
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    className="me-1"
                    onChange={handleGenderChange}
                  />{' '}
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Giữ bí mật"
                    className="me-1"
                    onChange={handleGenderChange}
                  />{' '}
                  Giữ bí mật
                </label>
              </div>
            </div>
            <button
              className="btn mt-4"
              style={{
                backgroundColor: '#FFC27A',
                border: 'none',
                borderRadius: '25px',
                height: '50px',
                width: '100%',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              onClick={nextStep}
            >
              Kế tiếp
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-4">
              <label htmlFor="password" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
                Mật khẩu
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" style={{ display: 'block', color: '#333', marginBottom: '8px' }}>
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu của bạn"
                className="form-control"
                style={{
                  border: '1px solid orange',
                  borderRadius: '5px',
                  height: '46px',
                  padding: '10px',
                }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              className="btn mt-4"
              style={{
                backgroundColor: '#FFC27A',
                border: 'none',
                borderRadius: '25px',
                height: '50px',
                width: '100%',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              onClick={handleSubmit}
            >
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
