import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCheckCircle,
  FaMoneyBillWave,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";
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
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [deniedCount, setDeniedCount] = useState(0);

  useEffect(() => {
    if (accountID) {
      fetchApplicationCount();
      fetchApplicationsByPage(currentPage);
    }
  }, [accountID, currentPage]);

  const fetchApplicationCount = async () => {
    const authToken = localStorage.getItem("authToken");

    const fetchCount = async (endpoint, setter) => {
      try {
        const res = await fetch(`${API_BASE_URL}/Application/${endpoint}?accountID=${accountID}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.ok) {
          const count = await res.json();
          setter(count);
        } else {
          setter(0);
        }
      } catch {
        setter(0);
      }
    };

    await Promise.all([
      fetchCount("CountApplicationsByAccountID", setApplicationCount),
      fetchCount("CountPendingApplicationsByAccountID", setPendingCount),
      fetchCount("CountAcceptedApplicationsByAccountID", setAcceptedCount),
      fetchCount("CountDeniedApplicationsByAccountID", setDeniedCount)
    ]);
  };


  const fetchApplicationsByPage = async (page) => {
    const authToken = localStorage.getItem("authToken");
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/Application/GetApplicationsByAccountID?uid=${accountID}&pageNumber=${page}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const apps = await res.json();

      const enrichedApps = apps.map((app) => ({
        ...app,
        isJobCompleted: app.status === 4,
      }));

      setApplications(enrichedApps);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Không thể tải công việc.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(applicationCount / pageSize);

  return (
    <div className="container my-4">
      <ToastContainer />
      <div className="card shadow-sm rounded-4 p-4 border-0">
        <h4 className="fw-bold mb-4 text-warning text-center">Quản lý đơn ứng tuyển của tôi</h4>

        {/* Summary Cards */}
        <div className="row row-cols-2 row-cols-md-5 g-3 mb-4">
          {[
            {
              label: "Tổng đơn",
              count: applicationCount,
              icon: <FaBriefcase size={18} className="text-warning" />
            },
            {
              label: "Đang chờ",
              count: pendingCount,
              icon: <FaClock size={18} className="text-info" />
            },
            {
              label: "Đã chấp nhận",
              count: acceptedCount,
              icon: <FaCheckCircle size={18} className="text-success" />
            },
            {
              label: "Đã từ chối",
              count: deniedCount,
              icon: <FaTimesCircle size={18} className="text-danger" />
            },
            {
              label: "Hoàn thành",
              count: Number(localStorage.getItem("jobCompleted") || 0),
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

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="alert alert-info small">Không có công việc phù hợp.</div>
        ) : (
          applications.map(app => (
            <div key={app.applicationID} className="card mb-3 p-3 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h6 className="fw-bold mb-1">#{app.jobID}</h6>
                  <div className="fw-semibold text-dark">{app.jobName}</div>
                </div>
                <span className={`badge text-white ${app.applicationStatus === 1 ? "bg-info" :
                  app.applicationStatus === 2 && app.jobStatus === 4 ? "bg-primary" : // Completed
                    app.applicationStatus === 2 && app.jobStatus === 6 ? "bg-secondary" : // ❌ Đã hủy → gray
                      app.applicationStatus === 2 ? "bg-success" :                         // ✅ Đã chấp nhận → green
                        app.applicationStatus === 3 ? "bg-danger" :
                          "bg-dark"
                  }`}>
                  {
                    app.applicationStatus === 1 ? "Đang chờ" :
                      app.applicationStatus === 2 && app.jobStatus === 4 ? "Đã hoàn thành" :
                        app.applicationStatus === 2 && app.jobStatus === 6 ? "Đã hủy" :
                          app.applicationStatus === 2 ? "Đã chấp nhận" :
                            app.applicationStatus === 3 ? "Đã từ chối" :
                              "Không xác định"
                  }
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
                  onClick={() => {
                    console.log("🔍 Clicked application:", app);
                    setSelectedApplication({ jobID: app.jobID, applicationStatus: app.applicationStatus });
                  }}
                  aria-label="Xem chi tiết công việc"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >⬅️ Trước</button>

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
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >Sau ➡️</button>
          </div>
        )}
      </div>

      {selectedApplication && (
        <JobDetailModal
          jobID={selectedApplication.jobID}
          applicationStatus={selectedApplication.applicationStatus}
          onClose={(refresh = false) => {
            setSelectedApplication(null);
            if (refresh) fetchApplicationsByPage(currentPage);
          }}
        />
      )}
    </div>
  );
}

export default HouseKeeperManagePage;