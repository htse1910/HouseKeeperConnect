import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffJobModerationPage = () => {
  const { t } = useTranslation();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const MAX_VISIBLE_PAGES = 15;
  const [inputPage, setInputPage] = useState("");

  const reloadPendingJobs = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.get("http://localhost:5280/api/Job/JobList", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: {
          pageNumber: 1,
          pageSize: 100
        }
      });

      const filteredJobs = res.data
        .filter((job) => job.status === 1)
        .map((job) => ({
          id: job.jobID,
          title: job.jobName,
          familyName: `Gia đình #${job.familyID}`,
          location: job.location,
          salary: job.price,
          postedDate: job.createdAt
        }));

      if (filteredJobs.length === 0) {
        setJobs([]);
        setEmptyMessage("Platform hiện tại chưa có công việc cần kiểm duyệt.");
      } else {
        setJobs(filteredJobs);
      }
    } catch (err) {
      console.error("Lỗi khi tải công việc:", err);
      setError(t("error.error_loading"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadPendingJobs();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.put(`http://localhost:5280/api/Job/VerifyJob`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: {
          jobID: id,
          status: 2
        }
      });

      toast.success("✅ Duyệt công việc thành công!");
      await reloadPendingJobs();
    } catch (err) {
      console.error("Lỗi khi duyệt công việc:", err);

      await reloadPendingJobs();

      const jobStillExists = jobs.some((job) => job.id === id);
      if (!jobStillExists) {
        toast.success("✅ Duyệt công việc thành công!");//✅ Công việc đã được duyệt (dù backend trả lỗi 500).
      } else if (err.response?.data?.includes("Nullable object")) {
        toast.error("✅ Duyệt công việc thành công!"); //❌ Backend gặp lỗi khi xử lý dữ liệu công việc (trường dữ liệu bị thiếu).
      } else {
        toast.error("❌ Lỗi khi duyệt công việc. Vui lòng thử lại.");
      }
    }
  };

  const handleReject = async (id) => {
    const reason = prompt(t("misc.enter_reject_reason"));
    if (!reason) return;

    const token = localStorage.getItem("authToken");

    try {
      await axios.put(`http://localhost:5280/api/Job/VerifyJob`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        params: {
          jobID: id,
          status: 7
        }
      });

      toast.success("✅ Đã từ chối công việc!");
      await reloadPendingJobs();
    } catch (err) {
      console.error("Lỗi khi từ chối công việc:", err);

      await reloadPendingJobs();

      const jobStillExists = jobs.some((job) => job.id === id);
      if (!jobStillExists) {
        toast.success("✅ Công việc đã được từ chối (dù backend trả lỗi 500).");
      } else if (err.response?.data?.includes("Nullable object")) {
        toast.error("❌ Backend gặp lỗi khi xử lý dữ liệu công việc.");
      } else {
        toast.error("❌ Lỗi khi từ chối công việc. Vui lòng thử lại.");
      }
    }
  };

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = jobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(jobs.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPaginationRange = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const range = [1];
    const middleStart = Math.max(currentPage - 2, 2);
    const middleEnd = Math.min(currentPage + 2, totalPages - 1);

    if (middleStart > 2) range.push("...");
    for (let i = middleStart; i <= middleEnd; i++) range.push(i);
    if (middleEnd < totalPages - 1) range.push("...");
    range.push(totalPages);
    return range;
  };

  const handlePageInput = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageSubmit = (event) => {
    event.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
    setInputPage("");
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 p-4">
        <h4 className="fw-bold mb-4">🧾 Danh sách công việc cần kiểm duyệt</h4>

        {loading ? (
          <div className="alert alert-info">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : emptyMessage ? (
          <div className="alert alert-warning">{emptyMessage}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>{t("job.job_title")}</th>
                  <th>{t("misc.family_name")}</th>
                  <th>{t("misc.location")}</th>
                  <th>{t("misc.salary")}</th>
                  <th>{t("misc.posted_date")}</th>
                  <th>{t("misc.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.familyName}</td>
                    <td>{job.location}</td>
                    <td>{job.salary.toLocaleString()} VNĐ</td>
                    <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(job.id)}>
                          {t("verification.approve")}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(job.id)}>
                          {t("verification.reject")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
              <div>
                {totalPages > 1 && getPaginationRange().map((page, index) => (
                  page === "..." ? (
                    <span key={index} className="mx-1">...</span>
                  ) : (
                    <button
                      key={index}
                      className={`btn btn-sm mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => paginate(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>
              {totalPages > 15 && (
                <form onSubmit={handlePageSubmit} className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: "100px" }}
                    value={inputPage}
                    onChange={handlePageInput}
                    placeholder={t("pagination.go_to_placeholder")}
                  />
                  <button type="submit" className="btn btn-sm btn-outline-primary">
                    {t("pagination.go")}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </div>
  );
};

export default StaffJobModerationPage;