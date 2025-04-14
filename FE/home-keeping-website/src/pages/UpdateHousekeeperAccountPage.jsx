import React, { useState, useEffect } from "react";
import ScrollToTopButton from "../components/ScrollToTopButton";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

function UpdateHousekeeperAccountPage() {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        phone: "",
        bankAccountNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        if (!accountID || !authToken) {
            setError("Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.");
            return;
        }

        // Fetch existing housekeeper data
        fetch(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Không thể lấy dữ liệu tài khoản.");
                return response.json();
            })
            .then((data) => {
                setFormData({
                    name: data.name || "",
                    password: "", // Do not pre-fill passwords
                    confirmPassword: "",
                    phone: data.phone || "",
                    bankAccountNumber: data.bankAccountNumber || "",
                });
            })
            .catch((err) => setError(err.message));
    }, [accountID, authToken]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/Account/UpdateAccount?AccountID=${accountID}&Name=${formData.name}&Password=${formData.password}&Phone=${formData.phone}&BankAccountNumber=${formData.bankAccountNumber}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                }
            );

            const result = await response.text(); // Handle plain text response

            if (!response.ok) {
                throw new Error(result); // Display error from API
            }

            setSuccess(result); // Show success message
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <ScrollToTopButton />
            <h2 className="fw-bold">Cập nhật tài khoản</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded">
                <div className="mb-3">
                    <label className="form-label">Tên</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Số tài khoản ngân hàng</label>
                    <input
                        type="text"
                        className="form-control"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
            </form>
        </div>
    );
}

export default UpdateHousekeeperAccountPage;
