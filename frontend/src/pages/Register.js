import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../components/UserRoleProvider";
import "../assets/styles/Auth.css";

function Register() {
    const { setUserRole } = useContext(UserRoleContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("family");

    const handleRegister = (e) => {
        e.preventDefault();

        // Giả lập API đăng ký
        localStorage.setItem("userRole", role);
        setUserRole(role);
        navigate(getHomePageByRole(role));
    };

    const getHomePageByRole = (role) => {
        switch (role) {
            case "housekeeper":
                return "/housekeeper/home";
            case "family":
                return "/family/home";
            case "admin":
                return "/admin/dashboard";
            default:
                return "/";
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng Ký</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="family">Tôi là gia đình</option>
                    <option value="housekeeper">Tôi là người giúp việc</option>
                </select>
                <button type="submit" className="auth-button">Đăng Ký</button>
            </form>
            <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
        </div>
    );
}

export default Register;
