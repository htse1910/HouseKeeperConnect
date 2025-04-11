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

function HouseKeeperManagePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [accountID] = useState(localStorage.getItem("accountID"));
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const resApp = await fetch(
        `http://localhost:5280/api/Application/GetApplicationsByAccountID?uid=${accountID}&pageNumber=1&pageSize=50`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const appData = await resApp.json();

      const appsWithExtras = await Promise.all(
        appData.map(async (app) => {
          try {
            const [familyRes, jobRes] = await Promise.all([
              fetch(`http://localhost:5280/api/Families/GetFamilyByID?id=${app.familyID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              }),
              fetch(`http://localhost:5280/api/Job/GetJobDetailByID?id=${app.jobID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              }),
            ]);

            const familyData = await familyRes.json();
            const jobData = await jobRes.json();

            const accRes = await fetch(`http://localhost:5280/api/Families/GetFamilyByAccountID?id=${familyData.accountID}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });

            const accData = await accRes.json();

            return {
              ...app,
              familyName: accData.name,
              price: jobData.price,
              startDate: jobData.startDate,
              endDate: jobData.endDate,
            };
          } catch {
            return {
              ...app,
              familyName: "Không rõ",
              price: null,
            };
          }
        })
      );

      setApplications(appsWithExtras);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải công việc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountID) fetchApplications();
  }, [accountID]);

  const tabStatusMap = {
    all: null,
    pending: 1,
    accepted: 2,
    denied: 3
  };

  const visibleApplications = applications.filter(app =>
    tabStatusMap[activeTab] === null || app.status === tabStatusMap[activeTab]
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
          background-color: rgba(0,0,0,0.1);
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
      `}</style>

      <div className="card giant-card shadow-sm rounded-4 p-4 border-0">

        {/* Header */}
        <h4 className="fw-bold mb-4 text-warning text-center">Công việc của tôi</h4>

        {/* Summary Section */}
        <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
          {[{
            label: "Tổng đơn",
            count: applications.length,
            icon: <FaBriefcase size={18} className="text-warning" />
          }, {
            label: "Đang chờ",
            count: applications.filter(a => a.status === 1).length,
            icon: <FaClock size={18} className="text-info" />
          }, {
            label: "Đã chấp nhận",
            count: applications.filter(a => a.status === 2).length,
            icon: <FaCheckCircle size={18} className="text-success" />
          }, {
            label: "Đã từ chối",
            count: applications.filter(a => a.status === 3).length,
            icon: <FaTimesCircle size={18} className="text-danger" />
          }].map((item, i) => (
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
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-outline-primary fw-semibold"
            onClick={() => navigate("/housekeeper/jobs-offered")}
          >
            📄 Xem danh sách công việc được mời bởi gia đình
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex justify-content-between flex-wrap gap-3 small border-bottom pb-2 mb-3">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Đang chờ" },
            { key: "accepted", label: "Đã chấp nhận" },
            { key: "denied", label: "Đã từ chối" }
          ].map(tab => (
            <div
              key={tab.key}
              className={`tab-link ${activeTab === tab.key ? "fw-bold text-warning border-bottom border-2 border-warning" : "text-secondary"}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Application List */}
        <div className="scroll-shadow">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center text-muted py-4">Đang tải công việc...</div>
          ) : visibleApplications.length === 0 ? (
            <div className="alert alert-info small">Không có công việc phù hợp.</div>
          ) : (
            visibleApplications.map(app => (
              <div key={app.applicationID} className="card app-card mb-3 p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0"><JobName jobID={app.jobID} /></h6>
                  <span className={`badge text-white bg-${app.status === 1 ? "info" : app.status === 2 ? "success" : "danger"}`}>
                    {app.status === 1 ? "Đang chờ" : app.status === 2 ? "Đã chấp nhận" : "Đã từ chối"}
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
      </div>

      {/* Modal */}
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
