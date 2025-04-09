import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../assets/styles/Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      console.error(err);
      toast.error("❌ Lỗi khi duyệt công việc.");
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
      console.error(err);
      toast.error("❌ Lỗi khi từ chối công việc.");
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

  if (loading || error) {
    return (
      <div className="dashboard-container">
        {loading && (
          <>
            <span className="icon-loading" />
            <p>{t("loading_data")}</p>
          </>
        )}
        {error && <p className="error">❌ {error}</p>}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>{t("job.job_moderation_title")}</h1>

      {emptyMessage ? (
        <div className="user-verification-empty-message">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <>
          <table className="dashboard-table">
            <thead>
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
                    <button className="dashboard-btn dashboard-btn-approve" onClick={() => handleApprove(job.id)}>
                      {t("verification.approve")}
                    </button>
                    <button className="dashboard-btn dashboard-btn-reject" onClick={() => handleReject(job.id)}>
                      {t("verification.reject")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="housekeeper-pagination">
            {totalPages > 15 && (
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                &laquo;
              </button>
            )}

            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span key={index} className="dots">...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => paginate(page)}
                  className={currentPage === page ? "active-page" : ""}
                >
                  {page}
                </button>
              )
            )}

            {totalPages > 15 && (
              <>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                  &raquo;
                </button>
                <form onSubmit={handlePageSubmit} className="pagination-input-form">
                  <input
                    type="text"
                    className="pagination-input"
                    value={inputPage}
                    onChange={handlePageInput}
                    placeholder={t("pagination.go_to_placeholder")}
                  />
                  <button type="submit" className="pagination-go-btn">{t("pagination.go")}</button>
                </form>
              </>
            )}
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default StaffJobModerationPage;
