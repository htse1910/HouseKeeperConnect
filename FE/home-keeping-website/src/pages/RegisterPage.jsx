import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '../components/RegisterForm';
import RegisterInfo from '../components/RegisterInfo';
import axios from 'axios';
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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

    // Trimmed values for string validations
    const {
      name,
      nickname,
      email,
      password,
      confirmPassword,
      phone,
      roleID,
      bankAccountNumber,
      genderID,
      introduction,
      address,
      LocalProfilePicture
    } = formData;

    // Required Fields
    if (!roleID) return toast.error("Vui lòng chọn vai trò.");
    if (!name.trim()) return toast.error("Họ và tên không được để trống.");
    if (!nickname.trim()) return toast.error("Nickname không được để trống.");
    if (!email.trim()) return toast.error("Email không được để trống.");
    if (!password) return toast.error("Mật khẩu không được để trống.");
    if (!confirmPassword) return toast.error("Xác nhận mật khẩu không được để trống.");
    if (!phone.trim()) return toast.error("Số điện thoại không được để trống.");
    if (!genderID) return toast.error("Vui lòng chọn giới tính.");
    if (!introduction.trim()) return toast.error("Giới thiệu không được để trống.");
    if (!address.trim()) return toast.error("Địa chỉ không được để trống.");
    if (!LocalProfilePicture) return toast.error("Vui lòng tải lên ảnh đại diện.");

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Địa chỉ email không hợp lệ.");

    // Phone format (Vietnam 10-digit mobile)
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(phone)) return toast.error("Số điện thoại không hợp lệ.");

    // Password strength
    if (password.length < 5) return toast.error("Mật khẩu phải có ít nhất 5 ký tự.");
    if (password !== confirmPassword) return toast.error("Mật khẩu xác nhận không khớp.");

    // Bank account number (optional, but validate format if filled)
    if (bankAccountNumber && !/^\d{8,20}$/.test(bankAccountNumber)) {
      return toast.error("Số tài khoản ngân hàng không hợp lệ.");
    }

    // Passed all validations — continue
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === '') return;
      if (key === 'genderID') formDataToSend.append('Gender', parseInt(value, 10));
      else if (key === 'roleID') formDataToSend.append('RoleID', parseInt(value, 10));
      else formDataToSend.append(key, value);
    });

    try {
      const registerResponse = await axios.post(
        `${API_BASE_URL}/Account/Register`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'text/plain',
          },
        }
      );

      if (registerResponse.status === 200) {
        toast.success('🎉 Đăng ký thành công! Tự động đăng nhập trong vòng 5 giây...');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCountdown(5);
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
      const response = await axios.post(
        `${API_BASE_URL}/Account/Login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
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
