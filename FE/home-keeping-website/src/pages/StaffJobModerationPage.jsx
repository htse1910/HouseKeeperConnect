import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "../config/apiConfig";

const StaffJobModerationPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const recordsPerPage = 5;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    try {
      const countRes = await axios.get(`${API_BASE_URL}/Job/CountPendingJobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalCount = countRes.data;
      setTotalPages(Math.ceil(totalCount / recordsPerPage));

      const res = await axios.get(`${API_BASE_URL}/Job/PendingJobsList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: currentPage, pageSize: recordsPerPage },
      });

      setJobs(res.data);
    } catch (err) {
      console.error("Lỗi khi tải công việc:", err);
      setError("Lỗi khi tải danh sách công việc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(`${API_BASE_URL}/Job/VerifyJob`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { jobID: id, status: 2 },
      });
      toast.success("✅ Duyệt công việc thành công!");
      fetchJobs();
    } catch (err) {
      console.error("Lỗi khi duyệt công việc:", err);
      toast.error("❌ Lỗi khi duyệt. Vui lòng thử lại.");
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
      fetchJobs();
    } catch (err) {
      console.error("Lỗi khi từ chối công việc:", err);
      toast.error("❌ Lỗi khi từ chối. Vui lòng thử lại.");
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
        ) : jobs.length === 0 ? (
          <div className="alert alert-warning">
            Hiện không có công việc nào đang chờ duyệt.
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Tên công việc</th>
                    <th>Vị trí</th>
                    <th>Lương</th>
                    <th>Ngày đăng</th>
                    <th>Địa chỉ chi tiết</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.jobID}>
                      <td>{job.jobID}</td>
                      <td>{job.jobName}</td>
                      <td>{job.location}</td>
                      <td>{job.price.toLocaleString()} VNĐ</td>
                      <td>{new Date(job.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td>{job.detailLocation}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(job.jobID)}>
                            Duyệt
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(job.jobID)}>
                            Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ⬅️ Trước
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau ➡️
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