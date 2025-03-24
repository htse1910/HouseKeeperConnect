import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/Job.css";

const JobPostingPage = () => {
    const [formData, setFormData] = useState({
        AccountID: "",
        JobName: "",
        Frequency: "",
        Location: "",
        Price: "",
        ServiceID: "",
        StartDate: "",
        EndDate: "",
        Description: "",
        StartSlot: "",
        EndSlot: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (data) => {
        if (!data.AccountID || !data.JobName || !data.Frequency || !data.Location ||
            !data.ServiceID || !data.StartDate || !data.EndDate ||
            !data.StartSlot || !data.EndSlot || data.Price < 0) {
            return "Vui lòng điền đầy đủ thông tin hợp lệ.";
        }
    
        if (data.JobName.length > 255 || data.Frequency.length > 100 || data.Location.length > 255) {
            return "Một số trường vượt quá giới hạn ký tự cho phép.";
        }
    
        if (data.Description && data.Description.length > 500) {
            return "Mô tả công việc không được vượt quá 500 ký tự.";
        }
    
        if (new Date(data.StartDate) > new Date(data.EndDate)) {
            return "Ngày bắt đầu không thể lớn hơn ngày kết thúc.";
        }
    
        if (parseInt(data.StartSlot) >= parseInt(data.EndSlot)) {
            return "Giờ bắt đầu phải nhỏ hơn giờ kết thúc.";
        }
    
        return null;
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const authToken = localStorage.getItem("authToken");
        const accountID = localStorage.getItem("accountID");

        if (!authToken || !accountID) {
            setError("Bạn cần đăng nhập để tiếp tục.");
            setLoading(false);
            return;
        }

        const dataToSubmit = {
            ...formData,
            AccountID: parseInt(accountID),
            ServiceID: parseInt(formData.ServiceID),
            StartSlot: parseInt(formData.StartSlot),
            EndSlot: parseInt(formData.EndSlot),
            Price: parseFloat(formData.Price),
            StartDate: new Date(formData.StartDate).toISOString(),
            EndDate: new Date(formData.EndDate).toISOString(),
        };

        const validationError = validateForm(dataToSubmit);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            console.log("Data gửi lên:", dataToSubmit);
            await axios.post("http://localhost:5280/api/Job/AddJob", dataToSubmit, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
            });

            setMessage("🎉 Công việc đã được đăng thành công!");
            setFormData({
                AccountID: "",
                JobName: "",
                Frequency: "",
                Location: "",
                Price: "",
                ServiceID: "",
                StartDate: "",
                EndDate: "",
                Description: "",
                StartSlot: "",
                EndSlot: "",
            });
        } catch (err) {
            console.error("Lỗi khi đăng công việc:", err);
            const serverMsg = err?.response?.data?.message || "Đã xảy ra lỗi khi đăng công việc.";
            setError(`❌ ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="job-posting-container">
            <h1 className="job-posting-title">Đăng Tin Tuyển Dụng</h1>

            {message && <p className="job-posting-alert job-posting-success">{message}</p>}
            {error && <p className="job-posting-alert job-posting-error">{error}</p>}

            <form onSubmit={handleSubmit} className="job-posting-form">
                {/* Tiêu đề công việc */}
                <div className="job-posting-group job-posting-full-width">
                    <label>Tiêu đề công việc</label>
                    <input type="text" name="JobName" className="job-posting-input" value={formData.JobName} onChange={handleChange} required />
                </div>

                {/* Địa điểm */}
                <div className="job-posting-group job-posting-full-width">
                    <label>Địa điểm</label>
                    <input type="text" name="Location" className="job-posting-input" value={formData.Location} onChange={handleChange} required />
                </div>

                {/* Loại công việc & Tần suất */}
                <div className="job-posting-row">
                    <div className="job-posting-group">
                        <label>Loại công việc</label>
                        <select name="ServiceID" className="job-posting-select" value={formData.ServiceID} onChange={handleChange} required>
                            <option value="">Chọn</option>
                            <option value="1">Giúp việc theo giờ</option>
                            <option value="2">Giúp việc toàn thời gian</option>
                            <option value="3">Chăm sóc trẻ</option>
                        </select>
                    </div>
                    <div className="job-posting-group">
                        <label>Tần suất</label>
                        <select name="Frequency" className="job-posting-select" value={formData.Frequency} onChange={handleChange} required>
                            <option value="">Chọn</option>
                            <option value="daily">Hàng ngày</option>
                            <option value="weekly">Hàng tuần</option>
                            <option value="monthly">Hàng tháng</option>
                        </select>
                    </div>
                </div>

                {/* Mức lương & Thời gian làm việc */}
                <div className="job-posting-row">
                    <div className="job-posting-group">
                        <label>Mức lương</label>
                        <input type="number" name="Price" className="job-posting-input" step="0.01" value={formData.Price} onChange={handleChange} required />
                    </div>
                    <div className="job-posting-group">
                        <label>Thời gian làm việc</label>
                        <div className="job-posting-time-inputs">
                            <input type="number" name="StartSlot" className="job-posting-input" min="1" value={formData.StartSlot} onChange={handleChange} placeholder="Bắt đầu" />
                            <span>-</span>
                            <input type="number" name="EndSlot" className="job-posting-input" min="1" value={formData.EndSlot} onChange={handleChange} placeholder="Kết thúc" />
                        </div>
                    </div>
                </div>

                {/* Ngày bắt đầu & Ngày kết thúc */}
                <div className="job-posting-row">
                    <div className="job-posting-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" name="StartDate" className="job-posting-input" value={formData.StartDate} onChange={handleChange} required />
                    </div>
                    <div className="job-posting-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" name="EndDate" className="job-posting-input" value={formData.EndDate} onChange={handleChange} required />
                    </div>
                </div>

                {/* Mô tả công việc */}
                <div className="job-posting-group job-posting-full-width">
                    <label>Mô tả công việc</label>
                    <textarea name="Description" className="job-posting-textarea" rows="3" value={formData.Description} onChange={handleChange}></textarea>
                </div>

                <button type="submit" className="job-posting-submit-btn btn-primary" disabled={loading}>
                    {loading ? "Đang đăng..." : "Đăng Tin"}
                </button>
            </form>
        </div>
    );
};

export default JobPostingPage;
