import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '../components/RegisterForm';
import RegisterInfo from '../components/RegisterInfo';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    roleID: '',
    bankAccountNumber: '',
    genderID: '',
    introduction: '',
    address: '',
    localProfilePicture: null
  });

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'localProfilePicture') {
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
  
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('roleID', formData.roleID);
    formDataToSend.append('bankAccountNumber', formData.bankAccountNumber);
    formDataToSend.append('genderID', formData.genderID);
    formDataToSend.append('introduction', formData.introduction);
    formDataToSend.append('address', formData.address);
  
    if (formData.localProfilePicture) {
      formDataToSend.append('localProfilePicture', formData.localProfilePicture);
    } else {
      toast.error('Please upload a profile picture!');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5280/api/Account/Register`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'text/plain',
          },
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data || 'Registration successful!');
        setFormData({
          name: '', email: '', password: '', confirmPassword: '', phone: '',
          roleID: '', bankAccountNumber: '', genderID: '', introduction: '',
          address: '', localProfilePicture: null
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Something went wrong on the server.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
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
