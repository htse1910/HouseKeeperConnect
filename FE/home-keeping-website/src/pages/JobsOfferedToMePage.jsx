import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import JobOfferedDetailModal from "../components/JobOfferedDetailModal";
import API_BASE_URL from "../config/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function JobsOfferedToMePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const [selectedJob, setSelectedJob] = useState(null);

  const handleAcceptJob = async (jobId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/AcceptJob?jobId=${jobId}&accountID=${accountID}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!res.ok) throw new Error("Failed to accept job");

      toast.success("✅ Đã chấp nhận công việc!");
      setSelectedJob(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi chấp nhận công việc.");
    }
  };

  const handleDenyJob = async (jobId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/DenyJob?jobId=${jobId}&accountID=${accountID}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (!res.ok) throw new Error("Failed to deny job");

      toast.info("⛔ Đã từ chối công việc.");
      setSelectedJob(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi từ chối công việc.");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/Job/GetJobsOfferedByHK?accountId=${accountID}&pageNumber=1&pageSize=100`,
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
      case 1: return "Đang chờ";                        // Pending
      case 2: return "Đã xác thực";                     // Verified
      case 3: return "Đã chấp nhận";                    // Accepted
      case 4: return "Đã hoàn thành";                   // Completed
      case 5: return "Đã hết hạn";                      // Expired
      case 6: return "Đã hủy";                          // Canceled
      case 7: return "Không được phép";                 // NotPermitted
      case 8: return "Chờ gia đình xác nhận";           // PendingFamilyConfirmation
      case 9: return "Người giúp việc đã bỏ việc";      // HousekeeperQuitJob
      default: return "Không xác định";
    }
  };  

  return (
    <div className="container my-4">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <h4 className="text-warning text-center fw-bold mb-4">Danh sách công việc được mời</h4>

      {loading ? (
        <div className="text-center text-muted py-4">Đang tải công việc...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="alert alert-info small">Không có công việc nào.</div>
      ) : (
        <div className="scroll-shadow px-1" style={{ maxHeight: 550, overflowY: "auto" }}>
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
          onAccept={() => handleAcceptJob(selectedJob.jobID)}
          onDeny={() => handleDenyJob(selectedJob.jobID)}
        />
      )}
    </div>
  );
}

export default JobsOfferedToMePage;
