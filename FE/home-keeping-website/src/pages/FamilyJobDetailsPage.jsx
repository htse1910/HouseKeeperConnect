// Fully working FamilyJobDetailsPage with correct slot confirmation logic and layout
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const slotMap = {
    1: "8H - 9H",
    2: "9H - 10H",
    3: "10H - 11H",
    4: "11H - 12H",
    5: "12H - 13H",
    6: "13H - 14H",
    7: "14H - 15H",
    8: "15H - 16H",
    9: "16H - 17H",
    10: "17H - 18H",
    11: "18H - 19H",
    12: "19H - 20H" // 👈 include this!
};


const renderJobStatus = (status) => {
    const statusMap = {
        1: { text: "Chờ duyệt", className: "bg-warning text-dark" },
        2: { text: "Đã xác minh", className: "bg-info text-dark" },
        3: { text: "Đã có người nhận", className: "bg-primary" },
        4: { text: "Đã hoàn thành", className: "bg-success" },
        5: { text: "Hết hạn", className: "bg-secondary" },
        6: { text: "Đã hủy", className: "bg-danger" },
        7: { text: "Không được phép", className: "bg-dark" },
        8: { text: "Chờ gia đình xác nhận", className: "bg-warning text-dark" },
    };
    const statusInfo = statusMap[status] || { text: "Không rõ", className: "bg-secondary" };
    return <span className={`badge ${statusInfo.className}`}>{statusInfo.text}</span>;
};

const FamilyJobDetailsPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { id: jobID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { createdDate } = location.state || {};
    const [isToday, setIsToday] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [matchedDate, setMatchedDate] = useState(null);
    const [daySlots, setDaySlots] = useState([]);
    const [confirmedSlots, setConfirmedSlots] = useState({});

    const isDemo = searchParams.get("demo") === "true";
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${authToken}` };

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [services, setServices] = useState([]);

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingScore, setRatingScore] = useState(5);
    const [ratingComment, setRatingComment] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const applicantsPerPage = 5;
    const totalPages = Math.ceil(applicants.length / applicantsPerPage);
    const paginatedApplicants = applicants.slice(currentPage * applicantsPerPage, (currentPage + 1) * applicantsPerPage);

    useEffect(() => {
        if (!authToken || !accountID || !jobID) return;

        axios.get(`${API_BASE_URL}/Application/ApplicationListByJob?jobID=${jobID}&pageNumber=1&pageSize=5`, { headers })
            .then(async (res) => {
                const applicantsData = res.data || [];

                const enrichedApplicants = await Promise.all(
                    applicantsData.map(async (applicant) => {
                        try {
                            const accRes = await axios.get(`${API_BASE_URL}/Account/GetAccount`, {
                                params: { id: applicant.accountID },
                                headers
                            });
                            return {
                                ...applicant,
                                name: accRes.data.name, // attach the real full name
                            };
                        } catch (err) {
                            console.error("Failed to fetch account for applicant:", applicant.accountID, err);
                            return applicant; // fallback: still return basic info
                        }
                    })
                );

                setApplicants(enrichedApplicants);
            })
            .catch((err) => console.error("Ứng tuyển error:", err));
    }, [jobID]);

    useEffect(() => {
        if (isDemo) {
            setJob({
                jobName: "Dọn dẹp nhà cuối tuần",
                location: "Quận 1, TP.HCM",
                price: 120000,
                createdDate: new Date().toISOString(),
                jobScope: "Dọn nhà, lau sàn, giặt quần áo",
                workingTime: "Thứ 7 - Chủ nhật, 9:00 - 15:00",
                specialRequirement: "Không có thú cưng",
                status: 8,
                startDate: "01/04/2025",
                endDate: "30/04/2025",
                serviceIDs: [],
                applicants: [],
                bookingID: 1,
                dayofWeek: [6, 0],
                slotPerDay: {
                    6: [2, 3],
                    0: [4, 5]
                }
            });
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/Job/GetJobDetailByID?id=${jobID}`, { headers })
            .then(res => {
                const jobData = res.data;

                // ✅ Patch slotPerDay dynamically if it's missing
                if (!jobData.slotPerDay && Array.isArray(jobData.dayofWeek) && Array.isArray(jobData.slotIDs)) {
                    const slotPerDay = {};
                    jobData.dayofWeek.forEach(day => {
                        slotPerDay[day] = [...jobData.slotIDs];
                    });
                    jobData.slotPerDay = slotPerDay;
                }

                setJob(jobData);
            })
            .catch(err => setError(t("error_loading")))
            .finally(() => setLoading(false));
    }, [jobID, isDemo]);

    useEffect(() => {
        if (!job?.serviceIDs || job.serviceIDs.length === 0) return;
        const fetchServiceDetails = async () => {
            const results = await Promise.all(
                job.serviceIDs.map(id =>
                    axios.get(`${API_BASE_URL}/Service/GetServiceByID?id=${id}`, { headers })
                        .then(res => res.data)
                        .catch(() => null)
                )
            );
            setServices(results.filter(Boolean));
        };
        fetchServiceDetails();
    }, [job]);

    const handleDayClick = (dayIndex) => {
        const start = new Date(job.startDate?.split("/").reverse().join("-"));
        const end = new Date(job.endDate?.split("/").reverse().join("-"));
        const today = new Date();
        const currentWeekDay = today.getDay();

        let matched;
        if (currentWeekDay === dayIndex) {
            matched = new Date(today);
        } else {
            matched = new Date(today);
            matched.setDate(today.getDate() + ((dayIndex + 7 - currentWeekDay) % 7));
        }

        const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const matchedNorm = normalize(matched);
        const startNorm = normalize(start);
        const endNorm = normalize(end);

        if (matchedNorm >= startNorm && matchedNorm <= endNorm) {
            const isSameDate = matched.toDateString() === today.toDateString();

            setSelectedDayIndex(dayIndex);
            setMatchedDate(matched);
            setIsToday(isSameDate);
            setDaySlots(job.slotPerDay?.[dayIndex] || []);
            setShowModal(true);
        } else {
            alert("Ngày này không nằm trong phạm vi công việc.");
        }
    };

    const handleConfirmSlot = () => {
        if (!job?.bookingID) return toast.error("Thiếu thông tin bookingID.");
        axios.post(`${API_BASE_URL}/Job/ConfirmSlotWorked`, null, {
            params: {
                bookingId: job.bookingID,
                dayOfWeek: selectedDayIndex
            },
            headers
        })
            .then(() => {
                toast.success("✅ Đã check-in cho ngày hôm nay!");
                setConfirmedSlots(prev => ({ ...prev, [selectedDayIndex]: true }));
            })
            .catch(() => toast.error("❌ Không thể xác nhận ca làm."));
    };


    const handleConfirmJobCompletion = () => {
        axios.post(`${API_BASE_URL}/Job/ConfirmJobCompletion`, null, {
            params: { jobId: jobID, accountID },
            headers
        })
            .then(() => {
                toast.success("🎉 Công việc đã được xác nhận hoàn thành!");
                setShowRatingModal(true);
            })
            .catch(() => {
                toast.error("❌ Không thể xác nhận hoàn thành công việc.");
            });
    };

    const handleAccept = (applicationID) => {
        axios.put(`${API_BASE_URL}/Application/UpdateApplication`, null, {
            params: { AppID: applicationID, status: 2 }, headers
        })
            .then(() => {
                toast.success("✅ Đã chấp nhận ứng viên!");
                setTimeout(() => window.location.reload(), 1500); // give user time to see the toast
            })
            .catch(() => toast.error("❌ Không thể chấp nhận ứng viên."));
    };

    const handleReject = (applicationID) => {
        axios.put(`${API_BASE_URL}/Application/UpdateApplication`, null, {
            params: { AppID: applicationID, status: 3 }, headers
        })
            .then(() => {
                toast.success("🚫 Đã từ chối ứng viên.");
                setTimeout(() => window.location.reload(), 1500); // optional delay for clarity
            })
            .catch(() => toast.error("❌ Không thể từ chối ứng viên."));
    };

    if (loading || error) {
        return (
            <div className="container text-center py-5">
                {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        );
    }

    const submitRating = async () => {
        if (!ratingScore || ratingScore < 1 || ratingScore > 5) {
            toast.error("Vui lòng chọn điểm từ 1 đến 5.");
            return;
        }

        try {
            const housekeeperID = job.housekeeperID;
            const hkRes = await axios.get(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByID?id=${housekeeperID}`, { headers });
            const revieweeAccountID = hkRes.data.accountID;

            await axios.post(`${API_BASE_URL}/Rating/AddRating`, null, {
                params: {
                    Reviewer: parseInt(accountID),
                    Reviewee: revieweeAccountID,
                    Score: ratingScore,
                    Content: ratingComment
                },
                headers
            });

            toast.success("✅ Gửi đánh giá thành công!");
            setShowRatingModal(false);
            window.location.reload();

        } catch (error) {
            console.error("Rating failed", error);
            toast.error("❌ Không thể gửi đánh giá.");
        }
    };

    return (
        <div className="container py-5" style={{ fontSize: "1.15rem" }}>
            {/* Job Header */}
            <div className="card mb-4 shadow rounded-4 border-primary-subtle" style={{ padding: "2rem", backgroundColor: "#fff9e6" }}>
                <h2 className="fw-bold" style={{ color: "#0d6efd", fontSize: "1.75rem" }}>{job.jobName}</h2>
                <div className="mt-3 mb-3">{renderJobStatus(job.status)}</div>
                <p><FaClock className="me-2" /> <strong style={{ color: "#333" }}>Ngày tạo:</strong> <span style={{ color: "#000" }}>{new Date(createdDate).toLocaleDateString("vi-VN")}</span></p>
                <p><FaMapMarkerAlt className="me-2" /> <strong style={{ color: "#333" }}>Địa điểm:</strong> <span style={{ color: "#000" }}>{job.location}{job.detailLocation && ` - ${job.detailLocation}`}</span></p>
                <p><strong style={{ color: "#333" }}>Mức lương:</strong> <span style={{ color: "#000" }}>{job.price > 0 ? `${job.price.toLocaleString("vi-VN")} VNĐ` : "Thỏa thuận"}</span></p>
                {job.status === 8 && (
                    <button className="btn btn-success mt-3">✅ Xác nhận đã hoàn thành công việc</button>
                )}
            </div>

            {/* Job Details */}
            <div className="card mb-4 shadow rounded-4 border-secondary-subtle" style={{ padding: "2rem", backgroundColor: "#fff9e6" }}>
                <h5 className="fw-bold mb-4" style={{ color: "#0a58ca" }}>📝 Chi tiết công việc</h5>
                <p><strong style={{ color: "#333" }}>📍 Địa điểm:</strong> <span style={{ color: "#000" }}>{job.location}{job.detailLocation && ` - ${job.detailLocation}`}</span></p>
                <p><strong style={{ color: "#333" }}>📅 Ngày làm:</strong> <span style={{ color: "#000" }}>{new Date(job.startDate).toLocaleDateString("vi-VN")} → {new Date(job.endDate).toLocaleDateString("vi-VN")}</span></p>
                <p><strong style={{ color: "#333" }}>📄 Mô tả:</strong> <span style={{ color: "#000" }}>{job.description || "Không có mô tả."}</span></p>
                <p><strong style={{ color: "#333" }}>📆 Ngày trong tuần:</strong> <span style={{ color: "#000" }}>{job.dayofWeek?.map(d => dayNames[d]).join(", ") || "Không rõ"}</span></p>
                <p><strong style={{ color: "#333" }}>⏰ Ca làm:</strong> <span style={{ color: "#000" }}>{(job.slotIDs || []).map(id => slotMap[id] || `Slot ${id}`).join(", ") || "Không có"}</span></p>
            </div>

            {/* Services */}
            <div className="card mb-4 shadow rounded-4 border-info-subtle" style={{ padding: "2rem", backgroundColor: "#fff9e6" }}>
                <h5 className="fw-bold mb-4" style={{ color: "#0c5460" }}>📌 Các dịch vụ bao gồm</h5>
                <div className="d-flex flex-wrap gap-2">
                    {services.length > 0 ? (
                        services.map(service => (
                            <span key={service.serviceID} className="badge bg-info text-dark me-2 mb-2">{service.serviceName}</span>
                        ))
                    ) : (
                        <span className="text-muted">Không có dịch vụ cụ thể</span>
                    )}
                </div>
            </div>

            {/* Applicants */}
            <div className="card mb-5 shadow rounded-4 border-warning-subtle" style={{ padding: "2rem", backgroundColor: "#fff9e6" }}>
                <h5 className="fw-bold mb-4" style={{ color: "#b8860b", fontSize: "1.5rem" }}>👤 Ứng viên</h5>
                {applicants.length === 0 ? (
                    <p className="text-muted fs-5">Chưa có người ứng tuyển.</p>
                ) : (
                    <>
                        {paginatedApplicants.map((applicant) => (
                            <div key={applicant.applicationID} className="card mb-3 shadow-sm">
                                <div className="card-body d-flex" style={{ fontSize: "1.1rem" }}>
                                    <img
                                        src={applicant.googleProfilePicture || applicant.localProfilePicture || "/avatar0.png"}
                                        alt="avatar"
                                        className="rounded-circle border border-2 border-primary me-3"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold text-primary" style={{ fontSize: "1.25rem" }}>{applicant.nickname}</h5>
                                        <p className="text-muted mb-1">
                                            Đánh giá: {applicant.rating || "5.0"} <FaStar className="text-warning" />
                                        </p>
                                        <div className="mb-2">
                                            {applicant.services?.map((s, i) => (
                                                <span key={i} className="badge bg-secondary me-1">{s}</span>
                                            ))}
                                        </div>
                                        <div className="d-flex gap-2 mb-2">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() =>
                                                    navigate(`/family/housekeeper/profile/${applicant.accountID}`, {
                                                        state: { applicantIDs: applicants.map(a => a.accountID) },
                                                    })
                                                }
                                            >
                                                Xem hồ sơ
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => {
                                                    if (applicant.name) {
                                                        window.location.href = `/messages?search=${encodeURIComponent(applicant.name)}`;
                                                    }
                                                }}
                                                disabled={!applicant.name}
                                            >
                                                Nhắn tin
                                            </button>
                                        </div>
                                        {applicant.status === 1 && (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-success btn-sm" onClick={() => handleAccept(applicant.applicationID)}>Chấp nhận</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleReject(applicant.applicationID)}>Từ chối</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination Controls */}
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <button
                                className="btn btn-outline-secondary"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                ⬅ Trang trước
                            </button>
                            <span className="text-muted">Trang {currentPage + 1} / {totalPages}</span>
                            <button
                                className="btn btn-outline-primary"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Trang tiếp ➡
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Slot Check-in Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết ca làm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Ngày làm:</strong> {dayNames[selectedDayIndex]}</p>
                    <p><strong>Ngày thực tế:</strong> {matchedDate?.toLocaleDateString("vi-VN")}</p>
                    <hr />
                    {daySlots.length > 0 ? (
                        <>
                            <ul className="list-unstyled">
                                {daySlots.map((slotID, i) => (
                                    <li key={i} className="d-flex justify-content-between align-items-center mb-2">
                                        <span>{slotMap[slotID] || `Slot ${slotID}`}</span>
                                    </li>
                                ))}
                            </ul>
                            {isToday ? (
                                <div className="text-center mt-4">
                                    <button className="btn btn-success" onClick={handleConfirmSlot}>
                                        ✅ Check-in
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center mt-4">
                                    <span className="badge bg-light text-muted">Chỉ xác nhận trong ngày</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Không có ca làm nào cho ngày này.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
                </Modal.Footer>
            </Modal>

            {/* Rating Modal */}
            <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá người giúp việc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Điểm đánh giá (1 - 5):</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={ratingScore}
                            onChange={(e) => setRatingScore(Number(e.target.value))}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nội dung đánh giá (tùy chọn):</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                            placeholder="Nhập nhận xét của bạn..."
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>Hủy</button>
                    <button className="btn btn-primary" onClick={submitRating}>Gửi đánh giá</button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default FamilyJobDetailsPage;
