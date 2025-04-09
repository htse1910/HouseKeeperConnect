import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/Job.css";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { renderWorkingTime } from "../utils/formatData";

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
    const { id: jobID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { createdDate } = location.state || {};

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
        { slotID: 2, time: "9:00 - 10:00" },
        { slotID: 3, time: "10:00 - 11:00" },
        { slotID: 4, time: "11:00 - 12:00" },
        { slotID: 5, time: "12:00 - 13:00" },
        { slotID: 6, time: "13:00 - 14:00" },
        { slotID: 7, time: "14:00 - 15:00" },
        { slotID: 8, time: "15:00 - 16:00" },
        { slotID: 9, time: "16:00 - 17:00" },
        { slotID: 10, time: "17:00 - 18:00" },
        { slotID: 11, time: "18:00 - 19:00" },
        { slotID: 12, time: "19:00 - 20:00" },
    ];

    const getDayPresetLabel = (days) => {
        const sorted = [...days].sort((a, b) => a - b);
        const dayPresets = [
            { label: t("jobDetail.everyDay"), value: [0, 1, 2, 3, 4, 5, 6] },
            { label: "Thứ 2 - Thứ 4 - Thứ 6", value: [1, 3, 5] },
            { label: "Thứ 3 - Thứ 5 - Thứ 7", value: [2, 4, 6] },
            { label: t("jobDetail.weekendSchedule"), value: [6, 0] },
        ];

        for (const preset of dayPresets) {
            const presetSorted = [...preset.value].sort((a, b) => a - b);
            if (JSON.stringify(sorted) === JSON.stringify(presetSorted)) {
                return preset.label;
            }
        }

        return null;
    };

    const applicationStatusMap = {
        1: { text: "Đang chờ", className: "status-pending" },
        2: { text: "Đã chấp nhận", className: "status-accepted" },
        3: { text: "Đã từ chối", className: "status-rejected" },
    };

    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        if (!authToken || !accountID || !jobID) return;

        axios.get(`http://localhost:5280/api/Application/ApplicationListByJob?jobID=${jobID}&pageNumber=1&pageSize=5`, { headers })
            .then((res) => {
                console.log("jobID gọi API:", jobID);
                console.log("Dữ liệu trả về từ ApplicationListByJob:", res.data);
                setApplicants(res.data || []);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách ứng tuyển:", err);
            });
    }, [jobID]);

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

        axios.get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, { headers })
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
    }, [jobID, isDemo]);

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

    const handleAccept = (applicationID) => {
        axios.put(`http://localhost:5280/api/Application/UpdateApplication`, null, {
            params: { AppID: applicationID, status: 2 }, // 2 = Accepted
            headers
        })
            .then(() => {
                alert("Đã chấp nhận ứng viên.");
                window.location.reload();
            })
            .catch((err) => {
                console.error("Lỗi khi chấp nhận ứng viên:", err);
                alert("Không thể chấp nhận ứng viên.");
            });
    };

    const handleReject = (applicationID) => {
        axios.put(`http://localhost:5280/api/Application/UpdateApplication`, null, {
            params: { AppID: applicationID, status: 3 }, // 3 = Denied
            headers
        })
            .then(() => {
                alert("Đã từ chối ứng viên.");
                window.location.reload();
            })
            .catch((err) => {
                console.error("Lỗi khi từ chối ứng viên:", err);
                alert("Không thể từ chối ứng viên.");
            });
    };

    const renderWorkingTime = () => {
        if (
            !Array.isArray(job.dayofWeek) || job.dayofWeek.length === 0 ||
            !Array.isArray(job.slotIDs) || job.slotIDs.length === 0
        ) {
            return t("jobDetail.noSchedule");
        }

        const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const sortedDays = [...job.dayofWeek].sort((a, b) => a - b);
        const sortedSlots = slotList
            .filter(s => job.slotIDs.includes(s.slotID))
            .sort((a, b) => a.slotID - b.slotID);

        // 👉 Phần ngày
        const presetLabel = getDayPresetLabel(sortedDays);
        let dayText = "";

        if (presetLabel) {
            dayText = `Làm việc theo lịch: ${presetLabel}`;
        } else {
            const days = sortedDays.map(d => t(`workingDays.${dayKeys[d]}`));
            if (days.length === 7) {
                dayText = "Làm việc vào thứ 2, thứ 3, thứ 4, thứ 5, thứ 6, thứ 7, và Chủ Nhật";
            } else {
                dayText = `Làm việc vào ${days.join(", ").replace(/, ([^,]*)$/, " và $1")}`;
            }
        }

        // 👉 Gom slot liên tục
        const ranges = [];
        let startSlot = sortedSlots[0];

        for (let i = 1; i <= sortedSlots.length; i++) {
            const curr = sortedSlots[i];
            const prev = sortedSlots[i - 1];
            if (!curr || curr.slotID !== prev.slotID + 1) {
                ranges.push({
                    start: startSlot.time.split(" - ")[0],
                    end: prev.time.split(" - ")[1],
                    ids: sortedSlots.slice(i - (prev.slotID - startSlot.slotID + 1), i).map(s => s.slotID),
                });
                startSlot = curr;
            }
        }

        // 👉 Phân tích ca và nghỉ trưa
        let timeText = "";
        const fullDay = ranges.length === 1 && ranges[0].start === "8:00" && ranges[0].end === "20:00";
        const hasMorning = job.slotIDs.includes(3);
        const hasAfternoon = job.slotIDs.includes(6);
        const hasLunchGap1 = job.slotIDs.includes(3) && job.slotIDs.includes(5); // nghỉ 11:00–12:00
        const hasLunchGap2 = job.slotIDs.includes(4) && job.slotIDs.includes(6); // nghỉ 12:00–13:00

        if (fullDay) {
            timeText = "Thời gian làm việc mỗi ngày từ 8:00 đến 20:00";
        } else if (hasMorning && hasAfternoon) {
            timeText = "Thời gian làm việc theo ca, ca sáng: từ 8:00 đến 11:00, ca chiều: từ 13:00 đến 16:00";
        } else {
            const blocks = ranges.map(r => `từ ${r.start} đến ${r.end}`);
            timeText = `Thời gian làm việc ${blocks.join(" và ")}`;
        }

        if (hasLunchGap1) {
            timeText += ". Được nghỉ trưa 1 tiếng, từ 11:00 đến 12:00";
        } else if (hasLunchGap2) {
            timeText += ". Được nghỉ trưa 1 tiếng, từ 12:00 đến 13:00";
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
                            <FaClock /> {t("misc.created_at")}:{" "}
                            {createdDate
                                ? new Date(createdDate).toLocaleDateString("vi-VN")
                                : t("misc.not_available")}
                        </span>
                        <span><FaMapMarkerAlt /> {job.location || t("misc.not_available")}</span>
                        <span>
                            {t("misc.salary")}:{" "}
                            {job.price != null
                                ? `${job.price.toLocaleString("vi-VN")} VND/giờ`
                                : t("misc.not_available")}
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
                    <div className="job-detail-applicant-list">
                        {applicants.length > 0 ? applicants.map((applicant, index) => {
                            const statusInfo = applicationStatusMap[applicant.status] || {
                                text: "Không rõ", className: "status-unknown"
                            };

                            return (
                                <div key={index} className="job-detail-applicant-card">
                                    <div className="job-detail-applicant-avatar">
                                        <img
                                            src={applicant.googleProfilePicture || applicant.localProfilePicture || "/avatar0.png"}
                                            alt="avatar"
                                        />
                                    </div>

                                    <div className="job-detail-applicant-info">
                                        <div className="job-detail-applicant-header-row">
                                            <h4 className="job-detail-applicant-name">{applicant.nickname}</h4>

                                            <div className="job-detail-applicant-status-and-actions">
                                                <span className={`job-detail-application-status ${statusInfo.className}`}>
                                                    {statusInfo.text}
                                                </span>

                                                {applicant.status === 1 && (
                                                    <div className="job-detail-status-actions-inline">
                                                        <button className="job-detail-btn-primary" onClick={() => handleAccept(applicant.applicationID)}>
                                                            {t("verification.approve")}
                                                        </button>
                                                        <button className="job-detail-btn-cancel" onClick={() => handleReject(applicant.applicationID)}>
                                                            {t("verification.reject")}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="job-detail-applicant-rating">
                                            <div className="job-detail-rating">
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <span
                                                        key={index}
                                                        className={`star-icon ${index < applicant.rating ? "filled" : ""}`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                                {applicant.rating?.toFixed(1) || "5.0"}
                                            </div>
                                        </div>

                                        {Array.isArray(applicant.services) && applicant.services.length > 0 && (
                                            <div className="job-detail-tags">
                                                {applicant.services.map((service, i) => (
                                                    <span key={i} className="tag">{service}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="job-detail-actions">
                                            <button className="job-detail-btn-primary" onClick={() => navigate(`/family/housekeeper/profile/${applicant.accountID}`)}>
                                                {t("misc.view_profile")}
                                            </button>
                                            <button className="job-detail-btn-secondary" onClick={() => navigate(`/family/messages?search=${applicant.nickname}`)}>
                                                {t("misc.send_message")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : <p>Chưa có người ứng tuyển.</p>}
                    </div>
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
                        <a href="#">{t("job.view_detail")}</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyJobDetailsPage;
