import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '../components/RegisterForm';
import RegisterInfo from '../components/RegisterInfo';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
  
    try {
      const queryParams = new URLSearchParams({
        Name: formData.fullName,
        Email: formData.email,
        Password: formData.password,
        Phone: formData.phoneNumber, // No need to parseInt
      }).toString();
  
      const response = await axios.post(
        `http://localhost:5280/api/Account/Register?${queryParams}`,
        null, // No request body, since data is in URL
        { headers: { 'Accept': 'text/plain' } }
      );
  
      if (response.status === 200) {
        toast.success('Registration successful!', {
          position: 'top-center',
          autoClose: 3000,
        });
  
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || 'Registration failed. Please try again.';
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '50px', marginTop: '20px' }}>
      <ToastContainer />
      <div className="d-flex gap-4 align-items-stretch w-100" style={{ maxWidth: '1000px' }}>
        <div className="flex-fill d-flex flex-column h-100">
          <RegisterForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="flex-fill d-flex flex-column h-100">
          <RegisterInfo />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
