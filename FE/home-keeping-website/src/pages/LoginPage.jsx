import React, { useState, useContext } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { UserRoleContext } from "../components/UserRoleProvider";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const GOOGLE_CLIENT_ID = "389719592750-1bnfd3k1g787t8r8tmvltrfokvm87ur2.apps.googleusercontent.com";

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRoleID, setSelectedRoleID] = useState(null);
  const [googleCredential, setGoogleCredential] = useState(null);
  const navigate = useNavigate();
  const { setUserRole } = useContext(UserRoleContext);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Account/Login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      );

      if (response.status === 200) {
        const loginData = response.data;

        localStorage.setItem('authToken', loginData.token);
        localStorage.setItem('userRoleID', loginData.roleID);
        localStorage.setItem('userName', loginData.name);
        localStorage.setItem('userRole', loginData.roleName);
        localStorage.setItem('accountID', loginData.accountID);

        setUserRole(loginData.roleName);
        toast.success(`Welcome ${loginData.name}!`, { position: 'top-center', autoClose: 3000 });

        redirectUser(loginData.roleID);
      }
    } catch (error) {
      toast.error('Invalid email or password.', { position: 'top-center', autoClose: 3000 });
    }
  };

  const startGoogleLogin = (roleID) => {
    setSelectedRoleID(roleID);
  };

  const handleGoogleLoginSuccess = async (credential) => {
    if (!credential || !selectedRoleID) {
      toast.error("Please select a role before logging in with Google.", { position: "top-center" });
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Account/LoginWithGoogle`,
        null,
        {
          params: {
            GoogleToken: credential,
            RoleID: selectedRoleID
          },
          headers: { 'Accept': 'application/json' }
        }
      );
  
      if (response.status === 200) {
        const userData = response.data;
  
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userRoleID', userData.roleID);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.roleName);
        localStorage.setItem('accountID', userData.accountID);
  
        if (userData.profilePicture) {
          localStorage.setItem('userProfilePicture', userData.profilePicture);
        }
  
        setUserRole(userData.roleName);
        toast.success(`Welcome ${userData.name}!`, { position: "top-center", autoClose: 3000 });
  
        redirectUser(userData.roleID); // FE always trusts BE roleID
      }
    } catch (error) {
      const message = error.response?.data || "Google login failed.";
      toast.error(message, { position: "top-center", autoClose: 3000 });
    }
  };
  

  const redirectUser = (roleID) => {
    switch (roleID) {
      case 1: navigate("/housekeeper/dashboard"); break;
      case 2: navigate("/family-dashboard"); break;
      case 3: navigate("/staff-dashboard"); break;
      case 4: navigate("/admin/dashboard"); break;
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
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaEnvelope /></span>
                <input id="email" type="email" value={formData.email} onChange={handleInputChange} className="form-control border-start-0" required />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaLock /></span>
                <input id="password" type="password" value={formData.password} onChange={handleInputChange} className="form-control border-start-0" required />
              </div>
            </div>

            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/forgot-password')}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="btn btn-warning text-white fw-bold w-100 mb-3">Đăng nhập</button>
          </form>

          <div className="text-center text-muted mb-2">Hoặc đăng nhập với</div>

          <div className="d-flex justify-content-around mb-3">
            <button
              onClick={() => startGoogleLogin(1)}
              className={`btn ${selectedRoleID === 1 ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
            >
              Người giúp việc
            </button>
            <button
              onClick={() => startGoogleLogin(2)}
              className={`btn ${selectedRoleID === 2 ? 'btn-success' : 'btn-outline-success'} btn-sm`}
            >
              Gia đình
            </button>
          </div>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const credential = credentialResponse?.credential;
              handleGoogleLoginSuccess(credential);
            }}
            onError={() => toast.error("Google login failed.", { position: "top-center" })}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
