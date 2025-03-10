import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../components/UserRoleProvider";

// Mock users
const mockUsers = [
  {
    username: "housekeeper01",
    password: "password123",
    role: "housekeeper",
  },
  {
    username: "family01",
    password: "password456",
    role: "family",
  },
];

function Login() {
  const { setUserRole } = useContext(UserRoleContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const foundUser = mockUsers.find(
      (user) =>
        user.username === credentials.username && user.password === credentials.password
    );

    if (foundUser) {
      setUserRole(foundUser.role);
      localStorage.setItem("userRole", foundUser.role);
      navigate(getHomePageByRole(foundUser.role));
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  const getHomePageByRole = (role) => {
    switch (role) {
      case "housekeeper":
        return "/housekeeper/home";
      case "family":
        return "/family/home";
      default:
        return "/";
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
