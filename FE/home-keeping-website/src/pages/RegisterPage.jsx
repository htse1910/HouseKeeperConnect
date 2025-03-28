import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '../components/RegisterForm';
import RegisterInfo from '../components/RegisterInfo';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    roleID: '',
    bankAccountNumber: '',
    genderID: '',
    introduction: '',
    address: '',
    LocalProfilePicture: null
  });

  const [countdown, setCountdown] = useState(null);
  const [shouldAutoLogin, setShouldAutoLogin] = useState(false);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'LocalProfilePicture') {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!formData.LocalProfilePicture) {
      toast.error('Please upload a profile picture!');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === '') return;
    
      // Fix keys that must match backend exactly (case-sensitive)
      if (key === 'genderID') {
        formDataToSend.append('Gender', parseInt(value, 10));
      } else if (key === 'roleID') {
        formDataToSend.append('RoleID', parseInt(value, 10));
      } else {
        formDataToSend.append(key, value);
      }
    });
    
    try {
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }      
      const registerResponse = await axios.post(
        `http://localhost:5280/api/Account/Register`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'text/plain',
          },
        }
      );

      if (registerResponse.status === 200) {
        toast.success('🎉 Registration successful! Auto-login in 10 seconds...');
        // 👇 Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCountdown(10);
        setShouldAutoLogin(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Something went wrong.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    }
  };

  const autoLoginAfterRegister = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5280/api/Account/Login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      );

      if (response.status === 200) {
        const loginData = response.data;

        localStorage.setItem('authToken', loginData.token);
        localStorage.setItem('userRoleID', loginData.roleID);
        localStorage.setItem('userName', loginData.name);
        localStorage.setItem('userRole', loginData.roleName);
        localStorage.setItem('accountID', loginData.accountID);

        if (loginData.profilePicture) {
          localStorage.setItem('userProfilePicture', loginData.profilePicture);
        }

        // Optional: setUserRole(loginData.roleName); // if using context

        // Redirect based on role
        switch (loginData.roleID) {
          case 1: window.location.href = "/housekeeper/dashboard"; break;
          case 2: window.location.href = "/family-dashboard"; break;
          case 3: window.location.href = "/staff-dashboard"; break;
          case 4: window.location.href = "/admin-dashboard"; break;
          default: toast.error("Unknown role. Please contact support.");
        }
      }
    } catch (error) {
      toast.error("Auto-login failed after registration.");
      console.error("Auto-login error:", error);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (!shouldAutoLogin || countdown === null) return;

    if (countdown === 0) {
      autoLoginAfterRegister();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, shouldAutoLogin]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '50px', marginTop: '20px' }}>
      <ToastContainer />
      <div className="d-flex flex-column align-items-center w-100" style={{ maxWidth: '1000px' }}>
        {countdown !== null && (
          <div className="alert alert-warning text-center w-100 mb-3 fw-bold">
            🔒 Đang đăng nhập tự động trong {countdown} giây...
          </div>
        )}

        <div className="d-flex gap-4 align-items-stretch w-100">
          <div className="flex-fill d-flex flex-column h-100">
            <RegisterForm formData={formData} onInputChange={handleInputChange} onSubmit={handleSubmit} />
          </div>
          <div className="flex-fill d-flex flex-column h-100">
            <RegisterInfo role={formData.roleID === '1' ? 'Housekeeper' : 'Family'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
