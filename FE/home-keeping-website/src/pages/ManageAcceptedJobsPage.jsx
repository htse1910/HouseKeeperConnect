import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCheckCircle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/apiConfig";

const ManageAcceptedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Job/JobList?pageNumber=1&pageSize=1000`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        const data = await res.json();
        const acceptedJobs = data.filter(job => job.status === 3);
        setJobs(acceptedJobs);
      } catch (err) {
        toast.error("❌ Không thể tải danh sách công việc.");
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) fetchJobs();
  }, [authToken]);

  const handleAbandonJob = async (jobID) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Job/ForceAbandonJobAndReassign?jobId=${jobID}&abandonDate=${new Date().toISOString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      const message = await response.text();

      if (response.ok) {
        toast.success("✔️ Công việc đã được từ chối và giao lại!");
        setJobs(prev => prev.filter(job => job.jobID !== jobID));
      } else {
        toast.error(message || "❌ Không thể từ chối công việc.");
      }
    } catch (error) {
      toast.error("❌ Lỗi khi từ chối công việc.");
      console.error("Abandon error:", error);
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h4 className="fw-bold text-primary mb-4">
        📋 Công việc đã nhận
      </h4>

      {loading ? (
        <p>⏳ Đang tải công việc...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted">Không có công việc nào đã nhận.</p>
      ) : (
        <div className="row g-3">
          {jobs.map(job => (
            <div className="col-md-6" key={job.jobID}>
              <div className="card p-3 shadow-sm h-100">
                <h6 className="fw-bold">
                  <FaBriefcase className="me-2 text-warning" />
                  {job.jobName}
                </h6>
                <div className="text-muted small mb-1">
                  <FaMapMarkerAlt className="me-1 text-danger" />
                  <strong>Địa điểm:</strong> {job.location}
                </div>
                <div className="text-muted small mb-2">
                  <FaMoneyBillWave className="me-1 text-success" />
                  <strong>Giá:</strong> {job.price?.toLocaleString()} VND
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary px-3 py-2 rounded-pill">
                    <FaCheckCircle className="me-1" />
                    Đã nhận
                  </span>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleAbandonJob(job.jobID)}
                  >
                    ❌ Từ chối & Gán lại
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAcceptedJobsPage;
