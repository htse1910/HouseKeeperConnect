import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = "389719592750-1bnfd3k1g787t8r8tmvltrfokvm87ur2.apps.googleusercontent.com"; // Replace with actual Client ID

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5280/api/Account/Login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      );

      if (response.status === 200) {
        const loginData = response.data;

        localStorage.setItem('authToken', loginData.token);
        localStorage.setItem('userRoleID', loginData.roleID);
        localStorage.setItem('userName', loginData.name);

        toast.success(`Welcome ${loginData.name}!`, { position: 'top-center', autoClose: 3000 });

        redirectUser(loginData.roleID);
      }
    } catch (error) {
      toast.error('Invalid email or password.', { position: 'top-center', autoClose: 3000 });
    }
  };

  // Handle Google login
  const handleGoogleLoginSuccess = async (googleToken) => {
    console.log("Google Token received:", googleToken); // Debugging step
  
    try {
      const response = await axios.post(
        `http://localhost:5280/api/Account/LoginWithGoogle?GoogleToken=${encodeURIComponent(googleToken)}`, // Send as query param
        null, // No request body
        { headers: { 'Accept': 'application/json' } } // Accept JSON response
      );
  
      if (response.status === 200) {
        const userData = response.data;
  
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userRoleID', userData.roleID);
        localStorage.setItem('userName', userData.name);
        if (userData.profilePicture) {
          localStorage.setItem('userProfilePicture', userData.profilePicture);
        }
  
        toast.success(`Welcome ${userData.name}!`, { position: "top-center", autoClose: 3000 });
  
        redirectUser(userData.roleID);
      }
    } catch (error) {
      toast.error(error.response?.data || "Google login failed.", { position: "top-center" });
    }
  };

  // Redirect user based on role
  const redirectUser = (roleID) => {
    switch (roleID) {
      case 1: navigate("/housekeeper-dashboard"); break;
      case 2: navigate("/family-dashboard"); break;
      case 3: navigate("/staff-dashboard"); break;
      case 4: navigate("/admin-dashboard"); break;
      default: toast.error("Invalid role. Please contact support.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#fff' }}>
        <ToastContainer />
        <div className="p-4 shadow rounded" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff' }}>
          <h2 className="fw-bold text-center" style={{ color: '#FF7F00', marginBottom: '20px' }}>ĐĂNG NHẬP</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaEnvelope /></span>
                <input id="email" type="email" value={formData.email} onChange={handleInputChange} className="form-control border-start-0" required />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                <input id="password" type="password" value={formData.password} onChange={handleInputChange} className="form-control border-start-0" required />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-warning text-white fw-bold w-100 mb-3">Đăng nhập</button>

            <div className="text-center text-muted mb-3">Hoặc đăng nhập với</div>

            {/* Google Login */}
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) {
                  toast.error("Google login failed: No token received.", { position: "top-center" });
                  return;
                }
                handleGoogleLoginSuccess(credentialResponse.credential);
              }}
              onError={() => toast.error("Google login failed.", { position: "top-center" })}
            />
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
