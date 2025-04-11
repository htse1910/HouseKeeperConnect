// Fully working FamilyJobDetailsPage with correct slot confirmation logic and layout
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaClock, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    useEffect(() => {
        if (!authToken || !accountID || !jobID) return;
        axios.get(`http://localhost:5280/api/Application/ApplicationListByJob?jobID=${jobID}&pageNumber=1&pageSize=5`, { headers })
            .then(res => setApplicants(res.data || []))
            .catch(err => console.error("Ứng tuyển error:", err));
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

        axios.get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, { headers })
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
                    axios.get(`http://localhost:5280/api/Service/GetServiceByID?id=${id}`, { headers })
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

        const matched = new Date(today);
        matched.setDate(today.getDate() + (dayIndex - currentWeekDay));

        if (matched >= start && matched <= end) {
            const isSameDate = today.toDateString() === matched.toDateString();

            setSelectedDayIndex(dayIndex);
            setMatchedDate(matched);
            setIsToday(isSameDate);
            setDaySlots(job.slotPerDay?.[dayIndex] || []);
            setShowModal(true);
        } else {
            alert("Ngày này không nằm trong phạm vi công việc.");
        }
    };

    const handleConfirmSlot = (slotID) => {
        if (!job?.bookingID) return toast.error("Thiếu thông tin bookingID.");
        axios.post("http://localhost:5280/api/Job/ConfirmSlotWorked", null, {
            params: {
                bookingId: job.bookingID,
                slotId: slotID,
                dayOfWeek: selectedDayIndex
            },
            headers
        })
            .then(() => {
                toast.success(`✅ Đã xác nhận slot ${slotMap[slotID]}`);
                setConfirmedSlots(prev => ({ ...prev, [slotID]: true }));
            })
            .catch(() => toast.error("❌ Không thể xác nhận slot."));
    };

    const handleConfirmJobCompletion = () => {
        axios.post(`http://localhost:5280/api/Job/ConfirmJobCompletion`, null, {
            params: { jobId: jobID, accountID },
            headers
        })
            .then(() => {
                alert("Xác nhận hoàn thành công việc thành công.");
                window.location.reload();
            })
            .catch(() => {
                alert("Xác nhận không thành công.");
            });
    };

    const handleAccept = (applicationID) => {
        axios.put(`http://localhost:5280/api/Application/UpdateApplication`, null, {
            params: { AppID: applicationID, status: 2 }, headers
        })
            .then(() => window.location.reload())
            .catch(() => alert("Không thể chấp nhận ứng viên."));
    };

    const handleReject = (applicationID) => {
        axios.put(`http://localhost:5280/api/Application/UpdateApplication`, null, {
            params: { AppID: applicationID, status: 3 }, headers
        })
            .then(() => window.location.reload())
            .catch(() => alert("Không thể từ chối ứng viên."));
    };

    if (loading || error) {
        return (
            <div className="container text-center py-5">
                {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        );
    }

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-lg-8">
                    {/* Main job info */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title">{job.jobName}</h2>
                            {renderJobStatus(job.status)}
                            <p><FaClock /> {t("misc.created_at")}: {new Date(createdDate).toLocaleDateString("vi-VN")}</p>
                            <p><FaMapMarkerAlt /> {job.location}</p>
                            <p>{t("misc.salary")}: {job.price?.toLocaleString("vi-VN")} VND/giờ</p>
                            {Array.isArray(job.dayofWeek) && job.dayofWeek.length > 0 && (
                                <div className="mb-2">
                                    <strong>📅 Ngày làm việc:</strong>
                                    <ul className="ps-3 mb-0">
                                        {job.dayofWeek.map((dayIdx, i) => (
                                            <li
                                                key={i}
                                                className="text-primary"
                                                style={{ cursor: "pointer", textDecoration: "underline" }}
                                                onClick={() => handleDayClick(dayIdx)}
                                            >
                                                {dayNames[dayIdx] || `Thứ ${dayIdx}`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {job.status === 8 && (
                                <button className="btn btn-success mt-3" onClick={handleConfirmJobCompletion}>
                                    Xác nhận đã hoàn thành công việc
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Job detail card */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h4>Thông tin công việc</h4>
                            <p><strong>Yêu cầu đặc biệt:</strong> {job.specialRequirement}</p>
                            {services.map(service => (
                                <span key={service.serviceID} className="badge bg-info text-dark me-2 mb-2">{service.serviceName}</span>
                            ))}
                        </div>
                    </div>

                    {/* Applicant list */}
                    <div className="card">
                        <div className="card-body">
                            <h4>Danh sách người ứng tuyển</h4>
                            {applicants.length === 0 ? <p>Chưa có người ứng tuyển.</p> : applicants.map(applicant => (
                                <div key={applicant.applicationID} className="card mb-3">
                                    <div className="card-body d-flex">
                                        <img
                                            src={applicant.googleProfilePicture || applicant.localProfilePicture || "/avatar0.png"}
                                            className="rounded img-thumbnail me-3"
                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                            alt="avatar"
                                        />
                                        <div className="flex-grow-1">
                                            <h5>{applicant.nickname}</h5>
                                            <p>Đánh giá: {applicant.rating || "5.0"} <FaStar className="text-warning" /></p>
                                            <div className="mb-2">
                                                {applicant.services?.map((s, i) => <span key={i} className="badge bg-secondary me-1">{s}</span>)}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/family/housekeeper/profile/${applicant.accountID}`)}>Xem hồ sơ</button>
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/family/messages?search=${applicant.nickname}`)}>Nhắn tin</button>
                                            </div>
                                            {applicant.status === 1 && (
                                                <div className="mt-2 d-flex gap-2">
                                                    <button className="btn btn-success btn-sm" onClick={() => handleAccept(applicant.applicationID)}>Chấp nhận</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(applicant.applicationID)}>Từ chối</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    <div className="card mb-4 text-center">
                        <div className="card-body">
                            <img
                                src="/avatar0.png"
                                className="rounded-circle img-thumbnail mb-2"
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                alt="avatar"
                            />
                            <h5>Trần Văn B</h5>
                            <p><FaStar className="text-warning" /> 4.0</p>
                            <div className="mb-2">
                                <span className="badge bg-secondary me-1">Dọn dẹp</span>
                                <span className="badge bg-secondary">Giặt ủi</span>
                            </div>
                            <button className="btn btn-primary btn-sm me-2">Thuê ngay</button>
                            <button className="btn btn-outline-secondary btn-sm">Nhắn tin</button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h5>Công việc tương tự</h5>
                            <p><strong>Dọn dẹp và nấu ăn</strong></p>
                            <p>140,000 VND/giờ</p>
                            <a href="#" className="btn btn-link">{t("job.view_detail")}</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết ca làm</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p><strong>Ngày làm:</strong> {dayNames[selectedDayIndex]}</p>
                    <p><strong>Ngày thực tế trong tuần này:</strong> {matchedDate?.toLocaleDateString("vi-VN")}</p>
                    <hr />
                    <p><strong>Ca làm:</strong></p>

                    {daySlots.length > 0 ? (
                        <ul className="list-unstyled">
                            {daySlots.map((slotID, i) => (
                                <li key={i} className="d-flex justify-content-between align-items-center mb-2">
                                    <span>{slotMap[slotID] || `Slot ${slotID}`}</span>
                                    {isToday ? (
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => handleConfirmSlot(slotID)}
                                            disabled={confirmedSlots[slotID]}
                                        >
                                            {confirmedSlots[slotID] ? "Đã xác nhận" : "Xác nhận"}
                                        </button>
                                    ) : (
                                        <span className="badge bg-light text-muted">Chỉ xác nhận trong ngày</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có ca làm nào cho ngày này.</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default FamilyJobDetailsPage;
