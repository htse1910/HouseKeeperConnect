import React, { useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaFileAlt, FaCalendarAlt } from "react-icons/fa";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await axios.post("http://localhost:5280/api/Job/AddJob", formData, {
                headers: { "Content-Type": "application/json" },
            });

            setMessage("Công việc đã được đăng thành công!");
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
            setError("Đã xảy ra lỗi khi đăng công việc. Vui lòng thử lại.");
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
                <div className="job-posting-group">
                    <label><FaFileAlt className="icon" /> Tiêu đề công việc</label>
                    <input type="text" name="JobName" value={formData.JobName} onChange={handleChange} required />
                </div>

                <div className="job-posting-group">
                    <label><FaClock className="icon" /> Tần suất</label>
                    <select name="Frequency" value={formData.Frequency} onChange={handleChange} required>
                        <option value="">Chọn</option>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                    </select>
                </div>

                <div className="job-posting-group">
                    <label><FaMapMarkerAlt className="icon" /> Địa điểm</label>
                    <input type="text" name="Location" value={formData.Location} onChange={handleChange} required />
                </div>

                <div className="job-posting-group">
                    <label><FaMoneyBillWave className="icon" /> Mức lương</label>
                    <input type="number" name="Price" step="0.01" value={formData.Price} onChange={handleChange} required />
                </div>

                <div className="job-posting-group">
                    <label><FaFileAlt className="icon" /> Loại dịch vụ</label>
                    <select name="ServiceID" value={formData.ServiceID} onChange={handleChange} required>
                        <option value="">Chọn</option>
                        <option value="1">Giúp việc theo giờ</option>
                        <option value="2">Giúp việc toàn thời gian</option>
                        <option value="3">Chăm sóc trẻ</option>
                    </select>
                </div>

                <div className="job-posting-group">
                    <label><FaCalendarAlt className="icon" /> Ngày bắt đầu</label>
                    <input type="date" name="StartDate" value={formData.StartDate} onChange={handleChange} required />
                </div>

                <div className="job-posting-group">
                    <label><FaCalendarAlt className="icon" /> Ngày kết thúc</label>
                    <input type="date" name="EndDate" value={formData.EndDate} onChange={handleChange} required />
                </div>

                <div className="job-posting-group">
                    <label><FaFileAlt className="icon" /> Mô tả công việc</label>
                    <textarea name="Description" rows="3" value={formData.Description} onChange={handleChange}></textarea>
                </div>

                <div className="job-posting-row">
                    <div className="job-posting-group">
                        <label><FaClock className="icon" /> Giờ bắt đầu</label>
                        <input type="number" name="StartSlot" min="0" max="24" value={formData.StartSlot} onChange={handleChange} />
                    </div>
                    <div className="job-posting-group">
                        <label><FaClock className="icon" /> Giờ kết thúc</label>
                        <input type="number" name="EndSlot" min="0" max="24" value={formData.EndSlot} onChange={handleChange} />
                    </div>
                </div>

                <button type="submit" className="btn-primary job-posting-submit-btn" disabled={loading}>
                    {loading ? "Đang đăng..." : "Đăng Tin"}
                </button>
            </form>
        </div>
    );
};

export default JobPostingPage;
