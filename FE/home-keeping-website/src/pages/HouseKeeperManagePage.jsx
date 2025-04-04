import React, { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCheckCircle,
  FaMoneyBillWave,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import JobName from "../components/JobName";
import JobDetailModal from "../components/JobDetailModal";

function HouseKeeperManagePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [housekeeperID, setHousekeeperID] = useState(localStorage.getItem("housekeeperID"));
  const [applications, setApplications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        // Fetch applications
        const resApp = await fetch(`http://localhost:5280/api/Application/GetApplicationsByAccountID?uid=${housekeeperID}&pageNumber=1&pageSize=50`, {
          headers: { "Authorization": `Bearer ${authToken}` }
        });
        const appData = await resApp.json();

        const appsWithFamilies = await Promise.all(appData.map(async (app) => {
          try {
            const familyRes = await fetch(`http://localhost:5280/api/Families/GetFamilyByID?id=${app.familyID}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            const familyData = await familyRes.json();

            const accRes = await fetch(`http://localhost:5280/api/Families/GetFamilyByAccountID?id=${familyData.accountID}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            const accData = await accRes.json();

            return { ...app, familyName: accData.name };
          } catch {
            return { ...app, familyName: "Không xác định" };
          }
        }));

        setApplications(appsWithFamilies);

        // Fetch bookings
        const resBooking = await fetch(`http://localhost:5280/api/Booking/GetBookingByHousekeeperID?housekeeperId=${housekeeperID}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const bookingData = await resBooking.json();
        setBookings(bookingData);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (housekeeperID) fetchData();
  }, [housekeeperID]);

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
        .app-card:hover {
          background-color: #fffbea;
          transition: background-color 0.3s ease;
        }
      `}</style>

      <h3 className="fw-bold mb-3">Công việc của tôi</h3>

      <div className="row g-3 mb-4">
        {[{
          label: "Tổng đơn",
          count: applications.length,
          icon: <FaBriefcase className="text-warning" size={26} />
        }, {
          label: "Đang chờ",
          count: applications.filter(a => a.status === 1).length,
          icon: <FaClock className="text-info" size={26} />
        }, {
          label: "Đã chấp nhận",
          count: applications.filter(a => a.status === 2).length,
          icon: <FaCheckCircle className="text-success" size={26} />
        }, {
          label: "Đã từ chối",
          count: applications.filter(a => a.status === 3).length,
          icon: <FaTimesCircle className="text-danger" size={26} />
        }].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm p-3 d-flex justify-content-between align-items-center flex-row bg-light">
              <div>
                <div className="text-muted">{item.label}</div>
                <h4 className="fw-bold">{item.count}</h4>
              </div>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm p-4">
        <div className="d-flex gap-4 border-bottom pb-2 mb-3">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Đang chờ" },
            { key: "accepted", label: "Đã chấp nhận" },
            { key: "denied", label: "Đã từ chối" },
            { key: "booked", label: "Các công việc đã đặt" }
          ].map(tab => (
            <div
              key={tab.key}
              className={`pb-2 ${activeTab === tab.key ? "text-warning fw-bold border-bottom border-2 border-warning" : "text-secondary"}`}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="scroll-shadow">
          {error && <div className="alert alert-danger">{error}</div>}

          {activeTab === "booked" ? (
            bookings.length === 0 ? (
              <div className="alert alert-info">Chưa có công việc nào đã đặt.</div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.bookingID} className="card app-card mb-3 p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="fw-bold mb-0">
                      <JobName jobID={booking.jobID} />
                    </h5>
                    <span className="badge bg-secondary text-white">Đã đặt</span>
                  </div>
                  <p className="text-muted small mb-1">
                    Dịch vụ: {booking.serviceIDs?.join(", ") || "Không có"} <br />
                    Thời gian: {new Date(booking.jobDetail.startDate).toLocaleDateString()} → {new Date(booking.jobDetail.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )
          ) : (
            visibleApplications.length === 0 ? (
              <div className="alert alert-info">Không có công việc phù hợp.</div>
            ) : (
              visibleApplications.map(app => (
                <div key={app.applicationID} className="card app-card mb-3 p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="fw-bold mb-0"><JobName jobID={app.jobID} /></h5>
                    <span className={`badge text-white bg-${app.status === 1 ? "info" : app.status === 2 ? "success" : "danger"}`}>
                      {app.status === 1 ? "Đang chờ" : app.status === 2 ? "Đã chấp nhận" : "Đã từ chối"}
                    </span>
                  </div>
                  <p className="text-muted small mb-2">
                    <strong>Gia đình:</strong> {app.familyName || "Không xác định"} | <FaMoneyBillWave className="text-success mx-1" />
                    Dịch vụ: {app.services?.join(", ") || "Không có"} | 
                    Từ: {new Date(app.startDate).toLocaleDateString()} đến {new Date(app.endDate).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => setSelectedApplication({ jobID: app.jobID, status: app.status })}
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {selectedApplication && (
        <JobDetailModal
          jobID={selectedApplication.jobID}
          applicationStatus={selectedApplication.status}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}

export default HouseKeeperManagePage;
