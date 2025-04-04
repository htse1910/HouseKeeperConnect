import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/Job.css";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";

const renderJobStatus = (status) => {
    const statusMap = {
        1: { text: "Chờ duyệt", className: "status-1" },
        2: { text: "Đang mở tuyển", className: "status-2" },
        3: { text: "Đã có người nhận", className: "status-3" },
        4: { text: "Đã hoàn thành", className: "status-4" },
        5: { text: "Hết hạn", className: "status-5" },
        6: { text: "Đã hủy", className: "status-6" },
    };

    const statusInfo = statusMap[status] || { text: "Không rõ", className: "status-0" };

    return (
        <span className={`job-management-status-badge ${statusInfo.className}`}>
            {statusInfo.text}
        </span>
    );
};

const FamilyJobDetailsPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { id: jobId } = useParams();
    const navigate = useNavigate();

    const isDemo = searchParams.get("demo") === "true";
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const shouldShowLoadingOrError = loading || error;

    const slotList = [
        { slotID: 1, time: "8:00 - 9:00" },
        { slotID: 2, time: "10:00 - 11:00" },
        { slotID: 3, time: "11:00 - 12:00" },
        { slotID: 4, time: "12:00 - 13:00" },
        { slotID: 5, time: "13:00 - 14:00" },
        { slotID: 6, time: "14:00 - 15:00" },
        { slotID: 7, time: "15:00 - 16:00" },
        { slotID: 8, time: "16:00 - 17:00" },
        { slotID: 9, time: "17:00 - 18:00" },
        { slotID: 10, time: "18:00 - 19:00" },
        { slotID: 11, time: "19:00 - 20:00" },
        { slotID: 12, time: "20:00 - 21:00" },
    ];

    useEffect(() => {
        if (isDemo) {
            setJob({
                jobName: "Dọn dẹp nhà cuối tuần",
                address: "Quận 1, TP.HCM",
                salary: 120000,
                createdDate: new Date().toISOString(),
                jobScope: "Dọn nhà, lau sàn, giặt quần áo",
                workingTime: "Thứ 7 - Chủ nhật, 9:00 - 15:00",
                specialRequirement: "Không có thú cưng",
                status: 2,
                applicants: []
            });
            setLoading(false);
            setError(null);
            return;
        }

        if (!authToken || !accountID) {
            setError(t("error_auth"));
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobId}`, { headers })
            .then((res) => {
                setJob(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Lỗi API:", err);
                setError(t("error_loading"));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [jobId, isDemo]);

    const [services, setServices] = useState([]);

    useEffect(() => {
        if (!job?.serviceIDs || job.serviceIDs.length === 0) return;

        const fetchServiceDetails = async () => {
            try {
                const servicePromises = job.serviceIDs.map(id =>
                    axios.get(`http://localhost:5280/api/Service/GetServiceByID?id=${id}`, { headers })
                        .then(res => res.data)
                        .catch((err) => {
                            console.warn(`Không thể lấy serviceID ${id}`, err);
                            return null;
                        })
                );

                const results = await Promise.all(servicePromises);
                setServices(results.filter(Boolean));
            } catch (err) {
                console.error("Lỗi khi lấy dịch vụ:", err);
            }
        };

        fetchServiceDetails();
    }, [job]);

    const renderWorkingTime = () => {
        if (
            !Array.isArray(job.dayofWeek) ||
            !Array.isArray(job.slotIDs) ||
            job.dayofWeek.length === 0 ||
            job.slotIDs.length === 0
        ) {
            return t("jobDetail.noSchedule");
        }

        const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const sortedDays = [...job.dayofWeek].sort((a, b) => a - b);

        // 👉 Hiển thị phần ngày
        let dayText = "";
        if (sortedDays.length === 2 && sortedDays.includes(0) && sortedDays.includes(6)) {
            dayText = t("jobDetail.weekendSchedule"); // → "Làm việc vào cuối tuần"
        } else if (isContinuousDays(sortedDays)) {
            const first = t(`workingDays.${dayKeys[sortedDays[0]]}`);
            const last = t(`workingDays.${dayKeys[sortedDays[sortedDays.length - 1]]}`);
            dayText = t("jobDetail.rangeSchedule", { first, last }); // → "Làm việc từ {first} đến {last}"
        } else {
            const days = sortedDays.map(d => t(`workingDays.${dayKeys[d]}`));
            dayText = t("jobDetail.listSchedule", { days: days.join(", ") }); // → "Làm việc vào {days}"
        }

        // 👉 Phân tích thời gian
        const sortedSlots = slotList
            .filter(s => job.slotIDs.includes(s.slotID))
            .sort((a, b) => a.slotID - b.slotID);

        const ranges = [];
        let start = sortedSlots[0];
        for (let i = 1; i <= sortedSlots.length; i++) {
            const curr = sortedSlots[i];
            const prev = sortedSlots[i - 1];
            if (!curr || curr.slotID !== prev.slotID + 1) {
                ranges.push({
                    start: start.time.split(" - ")[0],
                    end: prev.time.split(" - ")[1],
                });
                start = curr;
            }
        }

        let timeText = "";
        if (ranges.length === 1) {
            timeText = t("jobDetail.fullTime", { start: ranges[0].start, end: ranges[0].end });
        } else {
            timeText = t("jobDetail.splitTime", {
                blocks: ranges.map(r => `từ ${r.start} đến ${r.end}`).join(" và ")
            });
        }

        // 👉 Kiểm tra nghỉ trưa
        if (ranges.length === 2) {
            const gapStart = sortedSlots.find((s, idx, arr) => {
                if (idx === 0) return false;
                return s.slotID !== arr[idx - 1].slotID + 1;
            });
            if (gapStart) {
                const prev = slotList.find(s => s.slotID === gapStart.slotID - 1);
                if (prev && (prev.slotID === 2 || prev.slotID === 3)) {
                    return `${dayText}. ${t("jobDetail.fullTime", {
                        start: ranges[0].start,
                        end: ranges[1].end
                    })}. ${t("jobDetail.lunchBreak", {
                        start: prev.time.split(" - ")[1],
                        end: gapStart.time.split(" - ")[0]
                    })}`;
                }
            }
        }

        return `${dayText}. ${timeText}.`;
    };

    if (shouldShowLoadingOrError) {
        return (
            <div className="job-detail-container text-center py-5">
                {loading && (
                    <>
                        <span className="icon-loading" />
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="job-posting-alert job-posting-error">❌ {error}</p>
                        {!isDemo && (
                            <button
                                className="btn-secondary"
                                onClick={() => window.location.search = "?demo=true"}
                            >
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="job-detail-container">
            {/* Cột trái: Nội dung chính */}
            <div className="job-detail-main">
                <div className="job-detail-card">
                    <div className="job-detail-header">
                        <h2 className="job-detail-title">{job.jobName || "Tiêu đề công việc"}</h2>
                        {renderJobStatus(job.status)}
                    </div>

                    <div className="job-detail-meta">
                        <span>
                            <FaClock /> {t("created_at")}:{" "}
                            {job.createdDate
                                ? new Date(job.createdDate).toLocaleDateString("vi-VN")
                                : t("not_available")}
                        </span>
                        <span><FaMapMarkerAlt /> {job.location || t("not_available")}</span>
                        <span>
                            {t("salary")}:{" "}
                            {job.price != null
                                ? `${job.price.toLocaleString("vi-VN")} VND/giờ`
                                : t("not_available")}
                        </span>
                    </div>
                </div>

                <div className="job-detail-card">
                    <h3 className="job-detail-section-title">Thông tin công việc</h3>
                    <p><strong>Phạm vi công việc:</strong></p>
                    <div className="job-posting-service-group">
                        {Object.entries(
                            services.reduce((acc, service) => {
                                const type = service?.serviceType?.serviceTypeName || "Unknown";
                                if (!acc[type]) acc[type] = [];
                                acc[type].push(service);
                                return acc;
                            }, {})
                        ).map(([type, items]) => (
                            <div key={type} className="job-posting-service-type">
                                <details open>
                                    <summary>{t(`serviceTypeName.${type}`, type)}</summary>
                                    <ul className="job-detail-service-list">
                                        {items.map((service) => {
                                            const name = service?.serviceName;
                                            return (
                                                <li key={service.serviceID} className="job-detail-checked-service-item">
                                                    {t(`serviceName.${type}.${name}`, service.description || name)}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </details>
                            </div>
                        ))}
                    </div>
                    <p><strong>Lịch làm việc:</strong> {renderWorkingTime()}</p>
                    <p><strong>Yêu cầu đặc biệt:</strong> {job.specialRequirement || "Không có yêu cầu"}</p>
                </div>

                <div className="job-detail-card">
                    <h3 className="job-detail-section-title">Danh sách người ứng tuyển</h3>
                    {job.applicants && job.applicants.length > 0 ? (
                        job.applicants.map((applicant, index) => (
                            <div key={index} className="job-detail-candidate">
                                <img src={applicant.avatar || "/avatar0.png"} alt="avatar" />
                                <div>
                                    <p><strong>{applicant.fullName}</strong></p>
                                    <p className="job-detail-rating">
                                        {[...Array(Math.floor(applicant.rating || 0))].map((_, i) => (
                                            <FaStar key={i} className="star-icon filled" />
                                        ))}
                                        &nbsp;{applicant.rating?.toFixed(1) || "0.0"}
                                    </p>
                                    <div className="job-detail-tags">
                                        {applicant.skills?.map((skill, i) => (
                                            <span key={i} className="tag">{skill}</span>
                                        ))}
                                    </div>
                                    <div className="job-detail-actions">
                                        <button className="btn-primary">Xem hồ sơ</button>
                                        <button className="btn-secondary" onClick={() => navigate(`/messages?search=${applicant.fullName}`)}>Nhắn tin</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Chưa có người ứng tuyển.</p>
                    )}
                </div>
            </div>

            {/* Cột phải: Ứng viên nổi bật + công việc tương tự */}
            <div className="job-detail-sidebar">
                <div className="job-detail-card">
                    <h4 className="job-detail-sidebar-title">Ứng viên nổi bật</h4>
                    <div className="job-detail-candidate">
                        <img src="/avatar0.png" alt="avatar" />
                        <div>
                            <p><strong>Trần Văn B</strong></p>
                            <p className="job-detail-rating">
                                {[...Array(4)].map((_, i) => <FaStar key={i} className="star-icon filled" />)} 4.0
                            </p>
                            <div className="job-detail-tags">
                                <span className="tag">Dọn dẹp</span>
                                <span className="tag">Giặt ủi</span>
                            </div>
                            <div className="job-detail-actions">
                                <button className="btn-primary">Thuê ngay</button>
                                <button className="btn-secondary">Nhắn tin</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="job-detail-card">
                    <h4 className="job-detail-sidebar-title">Công việc tương tự</h4>
                    <div className="job-detail-similar">
                        <p><strong>Dọn dẹp và nấu ăn</strong></p>
                        <span>140,000 VND/giờ</span>
                        <a href="#">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyJobDetailsPage;
