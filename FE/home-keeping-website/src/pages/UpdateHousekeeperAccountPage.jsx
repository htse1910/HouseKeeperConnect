import React, { useState, useEffect } from "react";

function UpdateHousekeeperAccountPage() {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        phone: "",
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
        fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
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
                    phone: data.phone || "",
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

        try {
            const response = await fetch(
                `http://localhost:5280/api/Account/UpdateAccount?AccountID=${accountID}&Name=${formData.name}&Password=${formData.password}&Phone=${formData.phone}`,
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
            </form>
        </div>
    );
}

export default UpdateHousekeeperAccountPage;
