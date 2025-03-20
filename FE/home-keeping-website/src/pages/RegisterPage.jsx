import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '../components/RegisterForm';
import RegisterInfo from '../components/RegisterInfo';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    roleID: '',
    BankAccountNumber: '',
    GenderID: '',
    Introduction: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', { position: 'top-center', autoClose: 3000 });
      return;
    }
  
    if (!formData.roleID || !formData.GenderID) {
      toast.error('Please select a role and gender!', { position: 'top-center', autoClose: 3000 });
      return;
    }
  
    try {
      // Convert form data to query string format
      const queryParams = new URLSearchParams({
        Name: formData.Name,
        Email: formData.email,
        Password: formData.password,
        Phone: formData.phoneNumber,
        RoleID: formData.roleID,
        BankAccountNumber: formData.BankAccountNumber,
        GenderID: formData.GenderID,
        Introduction: formData.Introduction,
      }).toString();
  
      const response = await axios.post(
        `http://localhost:5280/api/Account/Register?${queryParams}`,
        null,
        { headers: { 'Accept': 'text/plain' } }
      );
  
      if (response.status === 200) {
        toast.success('Registration successful!', { position: 'top-center', autoClose: 3000 });
        setFormData({ 
          Name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', 
          roleID: '', BankAccountNumber: '', GenderID: '', Introduction: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Registration failed. Please try again.';
      toast.error(errorMessage, { position: 'top-center', autoClose: 3000 });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '50px', marginTop: '20px' }}>
      <ToastContainer />
      <div className="d-flex gap-4 align-items-stretch w-100" style={{ maxWidth: '1000px' }}>
        <div className="flex-fill d-flex flex-column h-100">
          <RegisterForm formData={formData} onInputChange={handleInputChange} onSubmit={handleSubmit} />
        </div>
        <div className="flex-fill d-flex flex-column h-100">
          <RegisterInfo role={formData.roleID === '1' ? 'Housekeeper' : 'Family'} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
