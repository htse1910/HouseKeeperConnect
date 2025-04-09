import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClipboardList
} from "react-icons/fa";

const JobStatusMap = {
  1: { label: "Chờ duyệt", color: "secondary" },
  2: { label: "Đã duyệt", color: "info" },
  3: { label: "Đã nhận", color: "primary" },
  4: { label: "Hoàn tất", color: "success" },
  5: { label: "Hết hạn", color: "dark" },
  6: { label: "Đã hủy", color: "danger" },
  7: { label: "Không được phép", color: "warning" },
  8: { label: "Chờ xác nhận gia đình", color: "secondary" }
};

const JobTypeMap = {
  1: "Toàn thời gian",
  2: "Bán thời gian"
};

const jobStatusTabs = [
  { key: "all", label: "Tất cả", value: null },
  { key: "pending", label: "Chờ duyệt", value: 1 },
  { key: "verified", label: "Đã duyệt", value: 2 },
  { key: "accepted", label: "Đã nhận", value: 3 },
  { key: "completed", label: "Hoàn tất", value: 4 },
  { key: "expired", label: "Hết hạn", value: 5 },
  { key: "canceled", label: "Đã hủy", value: 6 },
  { key: "notPermitted", label: "Không được phép", value: 7 },
  { key: "pendingFamily", label: "Chờ xác nhận gia đình", value: 8 }
];

function JobListOfFamily() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}&pageNumber=1&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      setJobs(res.data || []);
    } catch (err) {
      setError("Không thể tải danh sách công việc.");
    } finally {
      setLoading(false);
    }
  };

  const confirmJobCompletion = async (jobId) => {
    try {
      await axios.post(
        `http://localhost:5280/api/Job/ConfirmJobCompletion`,
        null,
        {
          params: { jobId, accountID },
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      alert("✅ Đã xác nhận hoàn thành!");
      fetchJobs();
    } catch {
      alert("❌ Không thể xác nhận.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const visibleJobs = jobs.filter((job) => {
    const tab = jobStatusTabs.find((t) => t.key === activeTab);
    return !tab?.value || job.status === tab.value;
  });

  return (
    <div className="container my-4">
      <style>{`
        .scroll-shadow {
          overflow-y: auto;
          max-height: 500px;
        }

        .scroll-shadow::-webkit-scrollbar {
          width: 6px;
        }

        .scroll-shadow::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 3px;
        }

        .job-card-1 {
          transition: background-color 0.3s ease;
          border-radius: 1rem;
        }

        .job-card-1:hover {
          background-color: #fffbea;
        }

        .tab-link {
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .tab-link:hover {
          color: #d39e00;
        }

        .giant-card {
          max-width: 900px;
          margin: auto;
        }
      `}</style>

      <div className="card giant-card shadow-sm rounded-4 p-4 border-0">
        {/* Header */}
        <h4 className="fw-bold mb-4 text-warning text-center">
          <FaClipboardList className="me-2" />
          Công việc đã đăng
        </h4>

        {/* Tabs */}
        <div className="d-flex flex-wrap gap-3 justify-content-center small border-bottom pb-2 mb-3">
          {jobStatusTabs.map((tab) => (
            <div
              key={tab.key}
              className={`tab-link ${
                activeTab === tab.key
                  ? "fw-bold text-warning border-bottom border-2 border-warning"
                  : "text-secondary"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Job List */}
        <div className="scroll-shadow">
          {loading ? (
            <div className="text-center text-muted py-4">Đang tải công việc...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : visibleJobs.length === 0 ? (
            <div className="alert alert-info">Không có công việc phù hợp.</div>
          ) : (
            visibleJobs.map((job) => {
              const status = JobStatusMap[job.status] || { label: "Không xác định", color: "secondary" };

              return (
                <div key={job.jobID} className="card job-card-1 mb-3 p-3 shadow-sm border-0">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{job.jobName}</h6>
                    <span className={`badge bg-${status.color}`}>{status.label}</span>
                  </div>

                  <div className="text-muted small mb-2">
                    <div><FaMapMarkerAlt className="me-1 text-primary" size={13} /> {job.location}</div>
                    <div><FaMoneyBillWave className="me-1 text-success" size={13} /> {job.price.toLocaleString()} VNĐ</div>
                    <div><strong>Loại:</strong> {JobTypeMap[job.jobType]}</div>
                    <div><FaCalendarAlt className="me-1" size={13} /> {new Date(job.createdAt).toLocaleDateString("vi-VN")}</div>
                  </div>

                  {job.status === 8 && (
                    <div className="text-end mt-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => confirmJobCompletion(job.jobID)}
                      >
                        ✅ Xác nhận hoàn thành
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default JobListOfFamily;
