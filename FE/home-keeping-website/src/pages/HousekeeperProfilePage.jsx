import "../assets/styles/Profile.css";
import {
    housekeeperInfo,
    skills,
    documents,
    schedule,
    pricing,
    contact,
    reviews,
    statistics
} from "../data/HousekeeperProfileData";
import { FaStar, FaCheckCircle, FaCamera, FaPencilAlt } from "react-icons/fa";

const HousekeeperProfilePage = () => {
    return (
        <div className="profile-container">
            {/* Phần tiêu đề */}
            <div className="profile-header">
                {/* Avatar + Tên */}
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <img src={housekeeperInfo.avatar} alt={housekeeperInfo.name} />
                        <button className="avatar-edit-btn">
                            <FaCamera className="camera-icon" />
                        </button>
                    </div>
                    <h1 className="profile-name">{housekeeperInfo.name}</h1>
                </div>

                {/* Thông tin cá nhân */}
                <div className="profile-details">
                    <div className="profile-title-container">
                        <h2 className="profile-title">Thông tin cá nhân</h2>
                        <FaPencilAlt className="edit-icon" />
                    </div>

                    {/* Rating */}
                    <div className="profile-rating">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <FaStar key={index} className={index < Math.round(housekeeperInfo.rating) ? "star-icon filled" : "star-icon"} />
                        ))}
                        <span className="rating-score">({housekeeperInfo.rating})</span>
                    </div>

                    {/* Thông tin cá nhân */}
                    <p className="profile-label"><strong>Tên thường gọi:</strong> {housekeeperInfo.nickname}</p>
                    <p className="profile-label"><strong>Giới tính:</strong> {housekeeperInfo.gender.value}</p>
                    <p className="profile-label"><strong>Khu vực làm việc:</strong> {housekeeperInfo.workArea}</p>
                </div>
            </div>

            {/* Phần chính của hồ sơ */}
            <div className=".profile-content-housekeeper">
                {/* Cột trái: Giới thiệu, kỹ năng, giá cả, chứng chỉ */}
                <div className="profile-left">
                    <div className="profile-section">
                        <h2 className="section-title">Giới thiệu</h2>
                        <p className="profile-introduction">
                            {housekeeperInfo.introduction.value}
                        </p>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">Kỹ năng</h2>
                        <div className="skills-list">
                            {skills.map((skill, index) => (
                                <span key={index} className="skill-item">
                                    {skill.value}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">Mức giá</h2>
                        <table className="pricing-table">
                            <thead>
                                <tr>
                                    <th>Dịch vụ</th>
                                    <th>Giá (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricing.map((price, index) => (
                                    <tr key={index}>
                                        <td>{price.label}</td>
                                        <td>{price.value.toLocaleString()} VNĐ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">Chứng chỉ & Giấy tờ</h2>
                        <div className="documents-list">
                            {documents.map((doc, index) => (
                                <div key={index} className="document-item">
                                    <span className="document-icon">📄</span>
                                    <span className="document-name">{doc.value}</span>
                                    <button className="document-view-btn">Xem</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Lịch làm việc, liên hệ, đánh giá */}
                <div className="profile-right">
                    <div className="profile-section">
                        <h2 className="section-title">Lịch làm việc</h2>
                        <div className="schedule-list">
                            {schedule.map((shift, index) => (
                                <div key={index} className="schedule-item">
                                    <div className="schedule-info">
                                        <span className="schedule-title">{shift.title}</span>
                                        <span className="schedule-date">{shift.time[0]}</span>
                                        <span className="schedule-time">{shift.time[1]}</span>
                                    </div>
                                    <span className={`schedule-status ${shift.status.key === "schedule.status_confirmed" ? "confirmed" : "pending"}`}>
                                        {shift.status.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">Thông tin liên hệ</h2>
                        <p>📞 {contact[0].value}</p>
                        <p>📧 {contact[1].value}</p>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">Đánh giá từ khách hàng</h2>
                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="review-item">
                                        <div className="review-header">
                                            <span className="review-name">{review.reviewer}</span>
                                            <span className="review-date">{review.date}</span>
                                        </div>
                                        <div className="review-rating">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                                            ))}
                                        </div>
                                        <p className="review-text">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">Chưa có đánh giá nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HousekeeperProfilePage;

