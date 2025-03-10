import React from "react";
import { FaPlus, FaUserCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../assets/styles/Dashboard.css";

const postedJobs = [
    {
        title: "Giúp việc nhà theo giờ",
        date: "15/03/2025",
        status: "Đang mở",
        applicants: 8,
        salary: "100K/h",
    },
    {
        title: "Dọn dẹp nhà cửa",
        date: "12/03/2025",
        status: "Đã đóng",
        applicants: 5,
        salary: "500K/ngày",
    }
];

const candidates = [
    {
        name: "Trần Việt Tú",
        avatar: "/assets/images/avatar1.png",
        job: "Giúp việc theo giờ",
    },
    {
        name: "Nguyễn Minh Anh",
        avatar: "/assets/images/avatar2.png",
        job: "Dọn dẹp nhà cửa",
    }
];

function FamilyDashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-content">
                <h1 className="welcome-message">Chào mừng trở lại, Anh Tuấn!</h1>

                {/* Thống kê */}
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <span className="dashboard-card-title">Công việc đã đăng</span>
                        <div className="dashboard-card-value">12</div>
                    </div>
                    <div className="dashboard-card">
                        <span className="dashboard-card-title">Người giúp việc đã thuê</span>
                        <div className="dashboard-card-value">
                            8 <FaUserCheck className="star-icon" />
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <span className="dashboard-card-title">Số đơn ứng tuyển</span>
                        <div className="dashboard-card-value">32</div>
                    </div>
                </div>

                {/* Việc đang tuyển (Bảng) */}
                <div className="available-jobs">
                    <div className="available-jobs-header">
                        <h2>Việc đang tuyển</h2>
                        <button className="add-job-btn">
                            <FaPlus /> Đăng việc mới
                        </button>
                    </div>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Tên công việc</th>
                                <th>Ngày đăng</th>
                                <th>Trạng thái</th>
                                <th>Số ứng viên</th>
                                <th>Mức lương</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postedJobs.map((job, index) => (
                                <tr key={index}>
                                    <td>{job.title}</td>
                                    <td>{job.date}</td>
                                    <td>
                                        <span className={`status-badge ${job.status === "Đang mở" ? "open" : "closed"}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>{job.applicants}</td>
                                    <td>{job.salary}</td>
                                    <td>
                                        <button className="link-btn view-candidates">Xem ứng viên</button> |
                                        <button className="link-btn">Chỉnh sửa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Ứng viên mới & Thanh toán */}
                <div className="dashboard-grid">
                    <div className="candidate-section">
                        <h2>Ứng viên mới</h2>
                        {candidates.map((candidate, index) => (
                            <div key={index} className="candidate-card">
                                <img src={candidate.avatar} alt={candidate.name} className="candidate-avatar" />
                                <div className="candidate-info">
                                    <h3>{candidate.name}</h3>
                                    <p>{candidate.job}</p>
                                </div>
                                <div className="candidate-actions">
                                    <button className="accept-btn">Chấp nhận</button>
                                    <button className="reject-btn">Từ chối</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="payment-info">
                        <h2>Thanh toán</h2>
                        <div className="payment-details">
                            <div className="payment-row">
                                <span>Tổng số tiền đã thanh toán</span>
                                <span>15.6M đ</span>
                            </div>
                            <div className="payment-row">
                                <span>Đang chờ xử lý</span>
                                <span>1.2M đ</span>
                            </div>
                            <div className="payment-row">
                                <span>Đã xác nhận</span>
                                <span className="green-text">14.4M đ</span>
                            </div>
                        </div>
                        <button className="withdraw-btn">Xem chi tiết thanh toán</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FamilyDashboard;
