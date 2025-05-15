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

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const [totalJobs, setTotalJobs] = useState(0);

  const totalPages = Math.ceil(totalJobs / pageSize);

  const handleAcceptJob = async (jobId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/AcceptJob?jobId=${jobId}&accountID=${accountID}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const data = await res.text();
      if (!res.ok) throw new Error(data);

      toast.success(data || "✅ Đã chấp nhận công việc!");
      setSelectedJob(null);
      fetchJobs(); // Refresh list
      fetchTotalCount();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "❌ Lỗi khi chấp nhận công việc.");
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
      fetchJobs();
      fetchTotalCount();
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi từ chối công việc.");
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/Job/GetJobsOfferedByHK?accountId=${accountID}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
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

  const fetchTotalCount = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/CountJobsOfferedByAccountID?accountID=${accountID}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const count = await res.json();
      setTotalJobs(count);
    } catch (err) {
      console.error("Failed to fetch count", err);
    }
  };

  useEffect(() => {
    if (accountID && authToken) {
      fetchJobs();
      fetchTotalCount();
    }
  }, [accountID, authToken, pageNumber]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return "Đang chờ";
      case 2: return "Đã xác thực";
      case 3: return "Đã chấp nhận";
      case 4: return "Đã hoàn thành";
      case 5: return "Đã hết hạn";
      case 6: return "Đã hủy";
      case 7: return "Không được phép";
      case 8: return "Chờ gia đình xác nhận";
      case 9: return "Người giúp việc đã bỏ việc";
      case 10: return "Công việc được tạo lại";
      default: return "Không xác định";
    }
  };

  return (
    <div className="container my-4">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <h4 className="text-warning text-center fw-bold mb-4">Danh sách công việc được mời</h4>
      <div className="text-end text-muted small mt-2">
        Tổng số công việc: {totalJobs}
      </div>

      {loading ? (
        <div className="text-center text-muted py-4">Đang tải công việc...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="alert alert-info small">Không có công việc nào.</div>
      ) : (
        <>
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

          {/* Pagination UI */}
          {totalJobs > pageSize && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                disabled={pageNumber === 1}
              >
                ⬅️ Trước
              </button>

              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value, 10);
                  if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    setPageNumber(page);
                  }
                }}
                className="form-control form-control-sm text-center"
                style={{ width: "60px" }}
              />

              <span className="small">/ {totalPages}</span>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setPageNumber(p => Math.min(p + 1, totalPages))}
                disabled={pageNumber === totalPages}
              >
                Sau ➡️
              </button>
            </div>
          )}
        </>
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
