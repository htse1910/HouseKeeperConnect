import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/apiConfig";

const ManageAcceptedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(3); // 3 = accepted, 2 = verified
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const authToken = localStorage.getItem("authToken");
  const jobsPerPage = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const listURL =
          statusFilter === 3
            ? "/Job/JobAcceptedListStaff"
            : "/Job/JobVerifiedListStaff";

        const countURL =
          statusFilter === 3
            ? "/Job/CountAccepteddJobsStaff"
            : "/Job/CountVerifiedJobsStaff";

        const [countRes, listRes] = await Promise.all([
          fetch(`${API_BASE_URL}${countURL}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(
            `${API_BASE_URL}${listURL}?pageNumber=${currentPage}&pageSize=${jobsPerPage}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          ),
        ]);

        const total = await countRes.json();
        const data = await listRes.json();

        setTotalPages(Math.ceil(total / jobsPerPage));

        const filtered = searchId.trim()
          ? data.filter((job) => job.jobID.toString() === searchId.trim())
          : data;

        setJobs(filtered);
      } catch (err) {
        toast.error("❌ Không thể tải danh sách công việc.");
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) fetchJobs();
  }, [authToken, statusFilter, currentPage, searchId]);

  const handleAbandonJob = async (jobID) => {
    const accountID = localStorage.getItem("accountID");
    if (!authToken || !accountID) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/Job/ForceAbandonJobAndReassign?jobId=${jobID}&accountID=${accountID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json(); // ✅ only this

      if (response.ok) {
        toast.success(
          `✔️ ${result.message} (Công việc mới: #${result.newJobId}, Giá: ${result.newPrice?.toLocaleString()} VND)`
        );
        setJobs((prev) => prev.filter((job) => job.jobID !== jobID));
      } else {
        toast.error(result.message || "❌ Không thể từ chối công việc.");
      }
    } catch (error) {
      toast.error("❌ Lỗi khi từ chối công việc.");
      console.error("Abandon error:", error);
    }
  };

  const handleDeleteJobAndRefund = async (jobID) => {
    if (!authToken) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/Job/DeleteJobAndRefund?jobId=${jobID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const message = await response.text();

      if (response.ok) {
        toast.success(message || "✔️ Công việc đã được hủy và hoàn tiền.");
        setJobs((prev) => prev.filter((job) => job.jobID !== jobID));
      } else {
        toast.error(message || "❌ Không thể hủy công việc.");
      }
    } catch (error) {
      toast.error("❌ Lỗi khi hủy công việc.");
      console.error("Delete and refund error:", error);
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h4 className="fw-bold text-primary mb-4">
        📋 Công việc đã nhận / xác minh
      </h4>

      <div className="mb-3 d-flex flex-wrap gap-2">
        {statusFilter !== 3 && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setStatusFilter(3);
              setCurrentPage(1);
            }}
          >
            Hiển thị công việc đã nhận
          </button>
        )}
        {statusFilter !== 2 && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setStatusFilter(2);
              setCurrentPage(1);
            }}
          >
            Hiển thị công việc đã xác minh
          </button>
        )}

        <input
          type="text"
          className="form-control form-control-sm"
          style={{ maxWidth: "200px" }}
          placeholder="Tìm theo Job ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        {searchId && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setSearchId("")}
          >
            ❌ Reset
          </button>
        )}
      </div>

      {loading ? (
        <p>⏳ Đang tải công việc...</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted">Không có công việc nào.</p>
      ) : (
        <>
          <div className="row g-3">
            {jobs.map((job) => (
              <div className="col-md-6" key={job.jobID}>
                <div className="card p-3 shadow-sm h-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-bold mb-0">
                      <FaBriefcase className="me-2 text-warning" />
                      {job.jobName}
                    </h6>
                    <span className="text-muted small">#{job.jobID}</span>
                  </div>
                  <div className="text-muted small mb-1">
                    <FaMapMarkerAlt className="me-1 text-danger" />
                    <strong>Địa điểm:</strong> {job.location}
                  </div>
                  <div className="text-muted small mb-2">
                    <FaMoneyBillWave className="me-1 text-success" />
                    <strong>Giá:</strong> {job.price?.toLocaleString()} VND
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className={`badge px-3 py-2 rounded-pill ${statusFilter === 3 ? "bg-primary" : "bg-success"
                        }`}
                    >
                      <FaCheckCircle className="me-1" />
                      {statusFilter === 3 ? "Đã nhận" : "Đã xác minh"}
                    </span>

                    {statusFilter === 3 && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleAbandonJob(job.jobID)}
                      >
                        ❌ Hủy
                      </button>
                    )}

                    {statusFilter === 2 && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteJobAndRefund(job.jobID)}
                      >
                        🗑 Hủy & Hoàn Tiền
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <FaChevronLeft className="me-1" />
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-outline-primary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Trang sau
              <FaChevronRight className="ms-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAcceptedJobsPage;
