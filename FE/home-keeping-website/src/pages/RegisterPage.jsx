import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterForm from '../components/RegisterForm';
import RegisterInfo from '../components/RegisterInfo';
import axios from 'axios';

function RegisterPage() {
  const [role, setRole] = useState('Gia đình');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '', // Added email field
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
  });

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      const payload = {
        role,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email, // Include email field in the payload
        password: formData.password,
        address: formData.address,
        city: formData.city,
      };

      await axios.post('https://6781283585151f714b099ef9.mockapi.io/users', payload);

      toast.success('Registration successful!', {
        position: 'top-center',
        autoClose: 3000,
      });

      // Reset form data after successful submission
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
      });
    } catch (error) {
      toast.error('Registration failed. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '50px', marginTop: '20px' }}
    >
      <ToastContainer />
      <div className="d-flex gap-4 align-items-stretch w-100" style={{ maxWidth: '1000px' }}>
        <div className="flex-fill d-flex flex-column h-100">
          <RegisterForm
            role={role}
            onRoleChange={handleRoleChange}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="flex-fill d-flex flex-column h-100">
          <RegisterInfo role={role} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
