import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/Profile.css";
import defaultAvatar from "../assets/images/avatar0.png";
import axios from "axios";

const FamilyProfilePage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const [accountInfo, setAccountInfo] = useState(null);
    const [family, setFamily] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shouldShowLoadingOrError = loading || error;

    const mapJobStatus = (status) => {
        switch (status) {
            case 1: return "Chờ duyệt";
            case 2: return "Đã duyệt";
            case 3: return "Đã nhận";
            case 4: return "Hoàn thành";
            case 5: return "Hết hạn";
            case 6: return "Đã hủy";
            default: return "Không xác định";
        }
    };
    
    useEffect(() => {
        if (isDemo) {
            setAccountInfo({
                accountID: 1,
                name: "Trần Tường Vi",
                email: "tranvi@example.com",
                phone: "0909 123 456",
                profilePicture: defaultAvatar
            });

            setFamily({
                nickname: "Tường Vi",
                gender: 2,
                address: "Quận 1, TP.HCM",
                rating: 4.5,
                introduction: "Chúng tôi là một gia đình nhỏ ở TP.HCM, cần tìm người giúp việc hỗ trợ dọn dẹp và chăm sóc trẻ nhỏ.",
                skills: ["Dọn dẹp nhà cửa", "Giặt ủi", "Nấu ăn", "Chăm sóc trẻ em"]
            });

            setJobs([
                { title: "Dọn dẹp nhà cửa", date: "Tháng 1, 2025", status: "Hoàn thành" },
                { title: "Nấu ăn hàng ngày", date: "Tháng 12, 2024", status: "Đang chờ" }
            ]);

            setReviews([
                { worker: "Nguyễn Văn A", date: "05/03/2025", rating: 5, comment: "Gia đình rất tốt, trả lương đúng hạn!" },
                { worker: "Trần Thị B", date: "15/02/2025", rating: 4, comment: "Công việc rõ ràng, nhưng đôi khi khá bận." }
            ]);

            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        if (!authToken) {
            setError(t("error_auth"));
            setLoading(false);
            return;
        }

        if (!accountID) {
            setError(t("error_account"));
            setLoading(false);
            return;
        }

        // Gọi API để lấy thông tin tài khoản
        axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((accountResponse) => {
                const account = accountResponse.data;
                if (!account || !account.accountID) throw new Error(t("error_auth"));
                setAccountInfo(account);

                return axios.get(`http://localhost:5280/api/Families/GetFamilyByAccountID?id=${accountID}`, { headers });
            })
            .then((familyResponse) => {
                const familyData = familyResponse.data;
                if (!familyData) throw new Error(t("error_loading"));
                setFamily(familyData);

                return axios.get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
            })
            .then((jobResponse) => {
                const jobList = jobResponse.data;
                if (!Array.isArray(jobList)) {
                    console.warn("API Job không trả về danh sách hợp lệ.");
                    setJobs([]);
                    return;
                }

                const jobDetailPromises = jobList.map(job =>
                    axios.get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${job.jobID}`, { headers })
                        .then(response => response.data)
                        .catch(err => {
                            console.warn(`Không thể lấy chi tiết job ID ${job.jobID}`, err);
                            return null;
                        })
                );

                return Promise.all(jobDetailPromises)
                    .then((detailedJobs) => {
                        const validJobs = detailedJobs.filter(job => job !== null);
                        const formattedJobs = validJobs.map(job => ({
                            jobID: job.jobID,
                            title: job.jobName,
                            startDate: new Date(job.startDate).toLocaleDateString("vi-VN"),
                            endDate: new Date(job.endDate).toLocaleDateString("vi-VN"),
                            status: mapJobStatus(job.status),
                            salary: job.price,
                            location: job.location,
                            description: job.description,
                            serviceIDs: job.serviceIDs,
                        }));
                        setJobs(formattedJobs);
                    });
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    console.warn("Không có công việc nào được đăng (404 - No records).");
                    setJobs([]);
                } else {
                    console.error("API Error:", err);
                    setError(t("error_loading"));
                    setLoading(false);
                }
            })
            .finally(() => {
                setLoading(false);
            });

    }, [isDemo]);

    const mapGender = (genderID) => {
        switch (genderID) {
            case 1: return t("male");
            case 2: return t("female");
            default: return "Không rõ";
        }
    };

    if (shouldShowLoadingOrError) {
        return (
            <div className="profile-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <img src={family?.localProfilePicture || family?.googleProfilePicture || defaultAvatar}
                            crossOrigin="anonymous"
                            alt="Avatar" />
                    </div>
                    <h2 className="profile-name">{family?.name || "Chưa có thông tin"}</h2>
                </div>
                {/* Thông tin cá nhân */}
                <div className="profile-details">
                    <h1 className="profile-title">Thông tin cá nhân ✏️</h1>
                    {family?.rating ? (
                        <div className="profile-rating">
                            {Array.from({ length: 5 }, (_, index) => (
                                <span key={index} className={`star-icon ${index < Math.round(family.rating) ? "filled" : ""}`}>
                                    ★
                                </span>
                            ))}
                            <span className="rating-score">({family.rating.toFixed(1)})</span>
                        </div>
                    ) : null}
                    <p className="profile-label"><strong>Tên thường gọi:</strong> {family?.nickname || "Không xác định"}</p>
                    <p className="profile-label"><strong>Giới tính:</strong> {mapGender(family?.gender)}</p>
                    <p className="profile-label"><strong>Địa chỉ thường trú:</strong> {family?.address || "Chưa có địa chỉ"}</p>
                    <p className="profile-label"><strong>Email:</strong> {family?.email || "Không có email"}</p>
                    <p className="profile-label"><strong>Số điện thoại:</strong> {family?.phone || "Không có số điện thoại"}</p>
                </div>
            </div>

            <div className="profile-content-family">
                {/* Cột trái - Thông tin cá nhân, Giới thiệu */}
                <div className="profile-left">
                    {/* Giới thiệu về gia đình */}
                    <div className="profile-section">
                        <h2 className="section-title">Giới thiệu về gia đình</h2>
                        <p className="profile-introduction">{family?.introduction || "Không có thông tin giới thiệu."}</p>
                    </div>

                    {/* Các kỹ năng gia đình tìm kiếm */}
                    <div className="profile-section">
                        <h2 className="section-title">Các kỹ năng gia đình đang tìm kiếm</h2>
                        {family.skills && family.skills.length > 0 ? (
                            <div className="skills-list">
                                {family.skills.map((skill, index) => (
                                    <span key={index} className="skill-item">{skill}</span>
                                ))}
                            </div>
                        ) : (
                            <p>Không có kỹ năng nào được yêu cầu.</p>
                        )}
                    </div>
                </div>

                {/* Cột phải - Kỹ năng, Lịch sử làm việc, Đánh giá, Liên hệ */}
                <div className="profile-right">
                    {/* Lịch sử làm việc của gia đình */}
                    <div className="profile-section">
                        <h2 className="section-title">Lịch sử làm việc của gia đình</h2>
                        {jobs.length === 0 ? <p>Chưa có công việc nào được đăng.</p> : jobs.map((job, index) => (
                            <div key={index} className="schedule-item">
                                <div className="schedule-info">
                                    <span className="schedule-title">{job.title}</span>
                                    <span className="schedule-date">{job.startDate} - {job.endDate}</span>
                                    {job.salary && <span className="schedule-date">Lương: {job.salary.toLocaleString()} VNĐ</span>}
                                    {/* {job.location && <span className="schedule-date">Địa điểm: {job.location}</span>} */}
                                    {job.description && <p className="schedule-date">{job.description}</p>}
                                </div>
                                <span className="schedule-status">{job.status}</span>
                            </div>
                        ))}
                    </div>

                    {/* Đánh giá từ người giúp việc */}
                    <div className="profile-section">
                        <h2 className="section-title">Đánh giá từ người giúp việc</h2>
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
                            ) : (<p>Chưa có đánh giá nào.</p>)}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FamilyProfilePage;
