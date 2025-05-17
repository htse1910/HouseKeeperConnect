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
  const [totalPages, setTotalPages] = useState(1);
  const [jobToReject, setJobToReject] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const recordsPerPage = 5;

  const reloadPendingJobs = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    try {
      const countRes = await axios.get(`${API_BASE_URL}/Job/CountPendingJobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalCount = countRes.data;
      const pageCount = Math.ceil(totalCount / recordsPerPage);
      setTotalPages(pageCount);

      const jobRes = await axios.get(`${API_BASE_URL}/Job/PendingJobsList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageNumber: currentPage,
          pageSize: recordsPerPage,
        },
      });

      const jobList = jobRes.data;

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
  }, [currentPage]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(`${API_BASE_URL}/Job/VerifyJob`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobID: id, status: 2 },
      });
      toast.success("✅ Duyệt công việc thành công!");
      reloadPendingJobs();
    } catch (err) {
      console.error("Lỗi khi duyệt công việc:", err);
      reloadPendingJobs();
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
      reloadPendingJobs();
    } catch (err) {
      console.error("Lỗi khi từ chối công việc:", err);
      reloadPendingJobs();
      const jobStillExists = jobs.some((job) => job.id === id);
      if (!jobStillExists || err.response?.data?.includes("Nullable object")) {
        toast.success("✅ Công việc đã được từ chối.");
      } else {
        toast.error("❌ Lỗi khi từ chối công việc. Vui lòng thử lại.");
      }
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
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
          <>
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
                  {jobs.map((job) => (
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
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              setJobToReject(job.id);
                              setShowRejectConfirm(true);
                            }}
                          >
                            {t("verification.reject")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

            <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span role="img" aria-label="prev">⬅️</span> Trước
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau <span role="img" aria-label="next">➡️</span>
              </button>
            </div>
          </>
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default StaffJobModerationPage;