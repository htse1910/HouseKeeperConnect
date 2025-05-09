import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "../config/apiConfig";

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
  const [jobToReject, setJobToReject] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const reloadPendingJobs = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.get(`${API_BASE_URL}/Job/PendingJobsList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const jobList = res.data;
      const jobsWithFamily = await Promise.all(
        jobList.map(async (job) => {
          try {
            const familyRes = await axios.get(`${API_BASE_URL}/Families/GetFamilyByID`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { id: job.familyID },
            });

            const accountID = familyRes.data.accountID;

            const accountRes = await axios.get(`${API_BASE_URL}/Families/GetFamilyByAccountID`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { id: accountID },
            });

            const family = accountRes.data;

            return {
              id: job.jobID,
              title: job.jobName,
              location: job.location,
              salary: job.price,
              postedDate: job.createdAt,
              familyID: job.familyID,
              familyName: family.name,
              familyNickname: family.nickname,
              familyPhone: family.phone,
              familyAddress: family.address,
            };
          } catch (e) {
            console.error(`Failed to load full family info for job ${job.jobID}:`, e);
            return {
              id: job.jobID,
              title: job.jobName,
              location: job.location,
              salary: job.price,
              postedDate: job.createdAt,
              familyID: job.familyID,
              familyName: `Gia đình #${job.familyID}`,
              familyNickname: "N/A",
              familyPhone: "N/A",
              familyAddress: "N/A",
            };
          }
        })
      );

      if (jobsWithFamily.length === 0) {
        setJobs([]);
        setEmptyMessage("Platform hiện tại chưa có công việc cần kiểm duyệt.");
      } else {
        setJobs(jobsWithFamily);
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
      await axios.put(`${API_BASE_URL}/Job/VerifyJob`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobID: id, status: 2 },
      });
      toast.success("✅ Duyệt công việc thành công!");
      await reloadPendingJobs();
    } catch (err) {
      console.error("Lỗi khi duyệt công việc:", err);
      await reloadPendingJobs();
      const jobStillExists = jobs.some((job) => job.id === id);
      if (!jobStillExists || err.response?.data?.includes("Nullable object")) {
        toast.success("✅ Duyệt công việc thành công!");
      } else {
        toast.error("❌ Lỗi khi duyệt công việc. Vui lòng thử lại.");
      }
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(`${API_BASE_URL}/Job/VerifyJob`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobID: id, status: 7 },
      });
      toast.success("✅ Đã từ chối công việc!");
      await reloadPendingJobs();
    } catch (err) {
      console.error("Lỗi khi từ chối công việc:", err);
      await reloadPendingJobs();
      const jobStillExists = jobs.some((job) => job.id === id);
      if (!jobStillExists || err.response?.data?.includes("Nullable object")) {
        toast.success("✅ Công việc đã được từ chối.");
      } else {
        toast.error("❌ Lỗi khi từ chối công việc. Vui lòng thử lại.");
      }
    }
  };

  const totalPages = Math.ceil(jobs.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = jobs.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

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
    if (/^\d*$/.test(value)) setInputPage(value);
  };

  const handlePageSubmit = (event) => {
    event.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) paginate(pageNumber);
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
                  <th>{t("misc.location")}</th>
                  <th>{t("misc.salary")}</th>
                  <th>{t("misc.posted_date")}</th>
                  <th>Gia đình</th>
                  <th>Nickname</th>
                  <th>SĐT</th>
                  <th>Địa chỉ</th>
                  <th>{t("misc.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td>{job.salary.toLocaleString()} VNĐ</td>
                    <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                    <td>{job.familyName}</td>
                    <td>{job.familyNickname}</td>
                    <td>{job.familyPhone}</td>
                    <td>{job.familyAddress}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(job.id)}>
                          {t("verification.approve")}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => {
                          setJobToReject(job.id);
                          setShowRejectConfirm(true);
                        }}>
                          {t("verification.reject")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showRejectConfirm && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Xác nhận từ chối</h5>
                      <button type="button" className="btn-close" onClick={() => setShowRejectConfirm(false)}></button>
                    </div>
                    <div className="modal-body">
                      <p>Bạn có chắc chắn muốn từ chối công việc này không?</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowRejectConfirm(false)}>Hủy</button>
                      <button className="btn btn-danger" onClick={() => {
                        setShowRejectConfirm(false);
                        handleReject(jobToReject);
                      }}>Từ chối</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
              <div className="d-flex align-items-center gap-1 flex-wrap">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  ← Trước
                </button>

                {getPaginationRange().map((page, index) =>
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
                )}

                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Tiếp →
                </button>

                <span className="mx-2 small text-muted">
                  Trang {currentPage} / {totalPages}
                </span>
              </div>

              {totalPages > 5 && (
                <form onSubmit={handlePageSubmit} className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: "100px" }}
                    value={inputPage}
                    onChange={handlePageInput}
                    placeholder="Đi đến trang..."
                  />
                  <button type="submit" className="btn btn-sm btn-outline-primary">Đi</button>
                </form>
              )}
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StaffJobModerationPage;