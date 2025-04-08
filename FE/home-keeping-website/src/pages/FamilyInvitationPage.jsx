import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Job.css";

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

const renderWorkingTime = (dayofWeek = [], slotIDs = []) => {
    const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const dayText = dayofWeek.map(d => weekdays[d]).join(", ") || "Không rõ";

    const sortedSlots = slotList.filter(s => slotIDs.includes(s.slotID)).sort((a, b) => a.slotID - b.slotID);
    if (sortedSlots.length === 0) return `Làm vào ${dayText}`;

    const ranges = [];
    let start = sortedSlots[0];
    for (let i = 1; i <= sortedSlots.length; i++) {
        const curr = sortedSlots[i];
        const prev = sortedSlots[i - 1];
        if (!curr || curr.slotID !== prev.slotID + 1) {
            ranges.push({ start: start.time.split(" - ")[0], end: prev.time.split(" - ")[1] });
            start = curr;
        }
    }

    const timeText = ranges.map(r => `từ ${r.start} đến ${r.end}`).join(" và ");
    return `Làm vào ${dayText}, ${timeText}`;
};

const FamilyInvitationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const housekeepers = location.state?.housekeepers || [];

    const [jobID, setJobID] = useState("");
    const [jobDetail, setJobDetail] = useState(null);
    const [services, setServices] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    useEffect(() => {
        axios.get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountID=${accountID}&pageNumber=1&pageSize=10`, { headers })
            .then(res => {
                const list = res.data?.filter(j => !j.isOffered && j.status === 1) || [];
                setJobs(list);
            })
            .catch(() => alert("Lỗi khi tải danh sách công việc"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!jobID) {
            setJobDetail(null);
            setServices([]);
            return;
        }

        axios.get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, { headers })
            .then(res => {
                const job = res.data;
                setJobDetail(job);

                const fetchServices = job.serviceIDs.map(id =>
                    axios.get(`http://localhost:5280/api/Service/GetServiceByID?id=${id}`, { headers })
                        .then(res => res.data)
                        .catch(() => null)
                );

                Promise.all(fetchServices).then(results => {
                    setServices(results.filter(Boolean));
                });
            });
    }, [jobID]);

    const handleInvite = async () => {
        if (!jobID || housekeepers.length === 0) {
            alert("Vui lòng chọn công việc và ít nhất 1 người giúp việc.");
            return;
        }

        const confirmed = window.confirm(`Xác nhận gửi lời mời cho ${housekeepers.length} người?`);
        if (!confirmed) return;

        try {
            for (const hk of housekeepers) {
                await axios.post("http://localhost:5280/api/Application/AddApplication", null, {
                    headers,
                    params: {
                        accountID: hk.accountID,
                        jobID
                    }
                });
            }

            alert("🎉 Gửi lời mời thành công!");
            navigate("/family/find-housekeepers");
        } catch (err) {
            console.error("Lỗi gửi lời mời:", err);
            alert("❌ Có lỗi xảy ra khi gửi lời mời.");
        }
    };

    return (
        <div className="job-posting-container">
            <h2>📨 Gửi lời mời làm việc</h2>
            <p><strong>Người giúp việc được chọn:</strong> {housekeepers.length} người</p>

            <div className="job-detail-card" style={{ margin: "16px 0" }}>
    <h3>👩‍🔧 Danh sách người giúp việc</h3>
    <div className="job-detail-candidate-list">
        {housekeepers.map((hk, index) => (
            <div key={index} className="job-detail-candidate">
                <img src={hk.avatar || "/avatar0.png"} alt="avatar" />
                <div>
                    <p><strong>{hk.name}</strong> ({hk.gender})</p>
                    {hk.skills && hk.skills.length > 0 && (
                        <div className="job-detail-tags">
                            {hk.skills.map((skill, i) => (
                                <span key={i} className="tag">{skill}</span>
                            ))}
                        </div>
                    )}
                    <p>Email: {hk.email}</p>
                </div>
            </div>
        ))}
    </div>
</div>

            {loading ? (
                <p>Đang tải công việc...</p>
            ) : (
                <>
                    {jobs.length === 0 ? (
                        <>
                            <p>Bạn chưa có công việc nào phù hợp.</p>
                            <button className="btn-primary" onClick={() => navigate("/family/post-job")}>
                                ➕ Tạo công việc mới
                            </button>
                        </>
                    ) : (
                        <>
                            <label>Chọn công việc:</label>
                            <select className="job-posting-input" value={jobID} onChange={e => setJobID(e.target.value)}>
                                <option value="">-- Chọn --</option>
                                {jobs.map(j => (
                                    <option key={j.jobID} value={j.jobID}>
                                        {j.jobName} - {j.location}
                                    </option>
                                ))}
                            </select>

                            {jobDetail && (
                                <div className="job-detail-card" style={{ marginTop: "24px" }}>
                                    <h3>📋 Chi tiết công việc</h3>
                                    <p><strong>Tiêu đề:</strong> {jobDetail.jobName}</p>
                                    <p><strong>Địa điểm:</strong> {jobDetail.location}</p>
                                    <p><strong>Lương:</strong> {jobDetail.price?.toLocaleString()} VNĐ/giờ</p>
                                    <p><strong>Lịch làm việc:</strong> {renderWorkingTime(jobDetail.dayofWeek, jobDetail.slotIDs)}</p>
                                    <p><strong>Dịch vụ:</strong></p>
                                    <ul className="job-detail-service-list">
                                        {Object.entries(services.reduce((acc, s) => {
                                            const type = s?.serviceType?.serviceTypeName || "Khác";
                                            if (!acc[type]) acc[type] = [];
                                            acc[type].push(s);
                                            return acc;
                                        }, {})).map(([type, list]) => (
                                            <li key={type}>
                                                <strong>{type}:</strong>
                                                <ul>
                                                    {list.map(s => (
                                                        <li key={s.serviceID} className="job-detail-checked-service-item">
                                                            {s.serviceName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                    {jobDetail.specialRequirement && (
                                        <p><strong>Yêu cầu đặc biệt:</strong> {jobDetail.specialRequirement}</p>
                                    )}
                                </div>
                            )}

                            <label style={{ marginTop: "20px" }}>📝 Ghi chú gửi kèm:</label>
                            <textarea
                                className="job-posting-textarea"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú cho người giúp việc (không gửi qua API, chỉ để bạn lưu ý nội bộ)..."
                                rows={3}
                            />

                            <button className="btn-primary" style={{ marginTop: "20px" }} onClick={handleInvite}>
                                📤 Gửi lời mời
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default FamilyInvitationPage;
