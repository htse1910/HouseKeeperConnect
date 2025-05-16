import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCheckCircle,
  FaMoneyBillWave,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";
import JobName from "../components/JobName";
import JobDetailModal from "../components/JobDetailModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

function HouseKeeperManagePage() {
  const [accountID] = useState(localStorage.getItem("accountID"));
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [applicationCount, setApplicationCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    setCurrentPage(1);
  }, []); // no more dependency on activeTab


  const fetchAllApplications = async () => {
    const authToken = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const countRes = await fetch(
        `${API_BASE_URL}/Application/CountApplicationsByAccountID?accountID=${accountID}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const total = await countRes.json();
      setApplicationCount(total);

      const totalPages = Math.ceil(total / pageSize);
      const allApps = [];

      for (let page = 1; page <= totalPages; page++) {
        const res = await fetch(
          `${API_BASE_URL}/Application/GetApplicationsByAccountID?uid=${accountID}&pageNumber=${page}&pageSize=${pageSize}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const pageApps = await res.json();
        allApps.push(...pageApps);
      }

      const enrichedApps = await Promise.all(
        allApps.map(async (app) => {
          try {
            const [familyRes, jobRes] = await Promise.all([
              fetch(`${API_BASE_URL}/Families/GetFamilyByID?id=${app.familyID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              }),
              fetch(`${API_BASE_URL}/Job/GetJobDetailByID?id=${app.jobID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              }),
            ]);
            const familyData = await familyRes.json();
            const jobData = await jobRes.json();

            const accRes = await fetch(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${familyData.accountID}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            const accData = await accRes.json();

            const isJobCompleted = jobData.status === 4;

            return {
              ...app,
              familyName: accData.name,
              price: jobData.price,
              startDate: jobData.startDate,
              endDate: jobData.endDate,
              isJobCompleted,
            };
          } catch {
            return {
              ...app,
              familyName: "Không rõ",
              price: null,
              isJobCompleted: false
            };
          }
        })
      );

      setApplications(enrichedApps);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải công việc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountID) fetchAllApplications();
  }, [accountID]);

  const filteredApplications = applications.filter(app => {
    if (filterStatus === "all") return true;
    if (filterStatus === "completedJobs") return app.status === 2 && app.isJobCompleted;
    if (filterStatus === "accepted") return app.status === 2 && !app.isJobCompleted;
    if (filterStatus === "pending") return app.status === 1;
    if (filterStatus === "denied") return app.status === 3;
    return true;
  });

  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container my-4">
      <ToastContainer />
      <style>{`
    .scroll-shadow {
      overflow-y: auto;
      max-height: 500px;
    }

    .scroll-shadow::-webkit-scrollbar {
      width: 6px;
    }

    .scroll-shadow::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }

    .app-card {
      transition: background-color 0.3s ease;
      border-radius: 1rem;
    }

    .app-card:hover {
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

    input[type="number"]::-webkit-inner-spin-button {
      opacity: 1;
    }

    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #ffc107;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `}</style>


      <div className="card giant-card shadow-sm rounded-4 p-4 border-0">
        <h4 className="fw-bold mb-4 text-warning text-center">Quản lý đơn ứng tuyển của tôi</h4>

        {/* Summary Section */}
        <div className="row row-cols-2 row-cols-md-5 g-3 mb-4">
          {[
            {
              label: "Tổng đơn",
              count: applicationCount,
              icon: <FaBriefcase size={18} className="text-warning" />
            },
            {
              label: "Đang chờ",
              count: applications.filter(a => a.status === 1).length,
              icon: <FaClock size={18} className="text-info" />
            },
            {
              label: "Đã chấp nhận",
              count: applications.filter(a => a.status === 2).length,
              icon: <FaCheckCircle size={18} className="text-success" />
            },
            {
              label: "Đã từ chối",
              count: applications.filter(a => a.status === 3).length,
              icon: <FaTimesCircle size={18} className="text-danger" />
            },
            {
              label: "Hoàn thành",
              count: applications.filter(a => a.status === 2 && a.isJobCompleted).length,
              icon: <FaCheckCircle size={18} className="text-primary" />
            }
          ].map((item, i) => (
            <div className="col" key={i}>
              <div className="d-flex flex-column align-items-center bg-light rounded-3 p-2 shadow-sm text-center h-100">
                {item.icon}
                <div className="text-muted small mt-1">{item.label}</div>
                <div className="fw-bold fs-5">{item.count}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {/* Action Buttons Row */}
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          <button
            className="btn btn-outline-success fw-semibold"
            onClick={() => navigate("/housekeeper/bookings")}
          >
            🧹 Quản lý công việc
          </button>
          <button
            className="btn btn-outline-primary fw-semibold"
            onClick={() => navigate("/housekeeper/jobs-offered")}
          >
            📄 Xem danh sách công việc được mời bởi gia đình
          </button>
        </div>

        {/* Filter Box */}
        <div className="bg-light rounded-3 p-3 mb-3 shadow-sm">
          <div className="row align-items-center">
            <div className="col-sm-4 mb-2 mb-sm-0">
              <label htmlFor="filterStatus" className="form-label fw-semibold mb-1">
                Lọc theo trạng thái:
              </label>
              <select
                id="filterStatus"
                className="form-select"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1); // reset page on filter change
                }}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Đang chờ</option>
                <option value="accepted">Đã chấp nhận</option>
                <option value="denied">Đã từ chối</option>
                <option value="completedJobs">Công việc đã hoàn thành</option>
              </select>
            </div>
          </div>
        </div>

        {/* Application List */}
        <div className="scroll-shadow">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="spinner-container">
              <div className="loader"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="alert alert-info small">Không có công việc phù hợp.</div>
          ) : (
            paginatedApplications.map(app => (
              <div key={app.applicationID} className="card app-card mb-3 p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0"><JobName jobID={app.jobID} /></h6>
                  <span className={`badge text-white ${app.isJobCompleted ? "bg-primary" : app.status === 1 ? "bg-info" : app.status === 2 ? "bg-success" : "bg-danger"}`}>
                    {app.isJobCompleted ? "Hoàn thành" : app.status === 1 ? "Đang chờ" : app.status === 2 ? "Đã chấp nhận" : "Đã từ chối"}
                  </span>
                </div>

                <div className="text-muted small mb-2">
                  <div><strong className="me-1">👪 Gia đình:</strong>{app.familyName}</div>
                  <div><strong className="me-1">💰 Lương:</strong>{app.price?.toLocaleString() ?? "N/A"} VND</div>
                  <div>
                    <strong className="me-1">📅 Thời gian:</strong>
                    {app.startDate ? new Date(app.startDate).toLocaleDateString() : "-"} → {app.endDate ? new Date(app.endDate).toLocaleDateString() : "-"}
                  </div>
                </div>

                <div className="text-end">
                  <button
                    className="btn btn-sm btn-outline-warning fw-semibold"
                    onClick={() => setSelectedApplication({ jobID: app.jobID, status: app.status })}
                    aria-label="Xem chi tiết công việc"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <span className="me-1">⬅️</span> Trước
            </button>

            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const pageNum = parseInt(e.target.value);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                  setCurrentPage(pageNum);
                }
              }}
              className="form-control form-control-sm text-center"
              style={{ width: "60px" }}
            />

            <span className="small">/ {totalPages}</span>

            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sau <span className="ms-1">➡️</span>
            </button>
          </div>
        )}

      </div>

      {selectedApplication && (
        <JobDetailModal
          jobID={selectedApplication.jobID}
          applicationStatus={selectedApplication.status}
          onClose={() => {
            setSelectedApplication(null);
            fetchApplications();
          }}
        />
      )}
    </div>
  );
}

export default HouseKeeperManagePage;
