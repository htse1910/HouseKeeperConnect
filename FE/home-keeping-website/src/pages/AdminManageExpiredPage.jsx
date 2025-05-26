import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";

const PAGE_SIZE = 5;

const formatVietnamTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });
};

const AdminManageExpiredPage = () => {
  const [expiredJobs, setExpiredJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(totalJobs / PAGE_SIZE);

  const getJobStatusText = (status) => {
    switch (status) {
      case 1: return "🕐 Đang chờ duyệt";
      case 2: return "📋 Đã duyệt";
      case 3: return "✔️ Đã nhận";
      case 4: return "✅ Hoàn thành";
      case 5: return "⌛ Đã hết hạn";
      case 6: return "❌ Đã hủy";
      case 7: return "🚫 Không được phép";
      case 8: return "⏳ Chờ gia đình xác nhận";
      case 9: return "🚪 Người giúp việc đã bỏ việc";
      default: return "Không rõ";
    }
  };

  const fetchExpiredJobs = async (page = 1) => {
    setLoading(true);
    try {
      const [countRes, jobsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Job/CountExpiredJobs`),
        fetch(`${API_BASE_URL}/Job/GetExpiredJobs?pageNumber=${page}&pageSize=${PAGE_SIZE}`),
      ]);

      const countData = await countRes.json();
      const jobsData = await jobsRes.json();

      setTotalJobs(countData);
      setExpiredJobs(jobsData);
    } catch (err) {
      console.error("Lỗi khi tải công việc:", err);
      toast.error("Không thể tải danh sách công việc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiredJobs(currentPage);
  }, [currentPage]);

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        .card-custom {
          border: 2px solid #dc3545;
          border-radius: 1rem;
          background: #fff0f0;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.07);
          padding: 24px;
        }
        .table thead th {
          background-color: #ffe5e5;
          color: #dc3545;
        }
        .table tbody tr:nth-child(odd) td {
          background-color: #fffafa;
        }
        .table tbody tr:hover td {
          background-color: #ffeaea;
          transition: background-color 0.3s ease;
        }
        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: white;
        }
      `}</style>

      <div className="row">
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>

        <div className="col-md-10 py-5">
          <h2 className="fw-bold mb-4 text-danger text-center">📅 Quản lý công việc hết hạn</h2>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <>
              <div className="card-custom">
                <div className="table-responsive">
                  <Table bordered hover className="align-middle">
                    <thead className="text-center">
                      <tr>
                        <th>ID</th>
                        <th>Tên công việc</th>
                        <th>Loại</th>
                        <th>Địa điểm</th>
                        <th>Giá</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th> {/* 👈 New column */}
                      </tr>
                    </thead>
                    <tbody>
                      {expiredJobs.map((job) => (
                        <tr key={job.jobID} className="text-center">
                          <td>{job.jobID}</td>
                          <td>{job.jobName}</td>
                          <td>{job.jobType === 1 ? "Một lần duy nhất" : "Định kỳ"}</td>
                          <td>{job.detailLocation}, {job.location}</td>
                          <td>{job.price.toLocaleString()} đ</td>
                          <td>{formatVietnamTime(job.createdAt)}</td>
                          <td>{getJobStatusText(job.status)}</td> {/* 👈 Status */}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalJobs > PAGE_SIZE && (
                  <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <button
                      className="btn btn-outline-danger"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <span className="me-1">&larr;</span> Trước
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = Number(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className="form-control text-center"
                      style={{ width: "70px" }}
                    />

                    <span className="fw-bold">/ {totalPages}</span>

                    <button
                      className="btn btn-outline-danger"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Sau <span className="ms-1">&rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageExpiredPage;
