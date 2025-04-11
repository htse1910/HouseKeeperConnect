import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import JobOfferedDetailModal from "../components/JobOfferedDetailModal";

function JobsOfferedToMePage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5280/api/Job/GetJobsOfferedByHK?accountId=${accountID}&pageNumber=1&pageSize=100`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch jobs");

                const data = await res.json();
                setJobs(data);
            } catch (err) {
                setError("Không thể tải công việc.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [accountID, authToken]);

    const getStatusLabel = (status) => {
        switch (status) {
            case 1: return "Đang chờ";
            case 2: return "Đã xác nhận";
            case 3: return "Đã chấp nhận";
            case 4: return "Đã hoàn thành";
            case 5: return "Đã hết hạn";
            case 6: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    return (
        <div className="container my-4">
            <style>{`
        .scroll-shadow {
          overflow-y: auto;
          max-height: 550px;
        }
        .scroll-shadow::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-shadow::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 3px;
        }
      `}</style>

            <h4 className="text-warning text-center fw-bold mb-4">Danh sách công việc được mời</h4>

            {loading ? (
                <div className="text-center text-muted py-4">Đang tải công việc...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : jobs.length === 0 ? (
                <div className="alert alert-info small">Không có công việc nào.</div>
            ) : (
                <div className="scroll-shadow px-1">
                    {jobs.map((job) => (
                        <div key={job.jobID} className="card shadow-sm mb-3" onClick={() => setSelectedJob(job)} style={{ cursor: "pointer" }}>
                            <div className="card-body">
                                <h5 className="card-title fw-semibold">{job.jobName}</h5>
                                <div className="text-muted small mb-2">
                                    <div><strong>📍 Địa điểm:</strong> {job.location}</div>
                                    <div><strong>💰 Giá:</strong> {job.price.toLocaleString()} VND</div>
                                    <div><strong>🕒 Tạo lúc:</strong> {new Date(job.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge text-white bg-info">{getStatusLabel(job.status)}</span>
                                    {job.status === 2 && <FaCheckCircle className="text-success" />}
                                    {job.status === 4 && <FaTimesCircle className="text-danger" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedJob && (
                <JobOfferedDetailModal
                    jobID={selectedJob.jobID}
                    familyID={selectedJob.familyID}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </div>
    );
}

export default JobsOfferedToMePage;
