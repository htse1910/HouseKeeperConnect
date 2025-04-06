import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaClock
} from "react-icons/fa";
import { serviceMap } from "../utils/serviceMap";

const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const slotMap = {
  1: "8H - 9H",
  2: "10H - 11H",
  3: "12H - 13H",
  4: "14H - 15H",
  5: "16H - 17H",
  6: "18H - 19H",
  7: "20H - 21H"
};

const HousekeeperBookingManagementPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5280/api/Booking/GetBookingByHousekeeperID?housekeeperId=${housekeeperID}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const bookingData = await res.json();

        const fullRows = await Promise.all(bookingData.map(async (booking) => {
          let jobDetail = null;
          let familyName = "Đang cập nhật";

          try {
            const jobRes = await fetch(`http://localhost:5280/api/Job/GetJobDetailByID?id=${booking.jobID}`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            jobDetail = await jobRes.json();

            const familyRes = await fetch(`http://localhost:5280/api/Families/GetFamilyByID?id=${jobDetail.familyID}`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            const familyData = await familyRes.json();

            const accountRes = await fetch(`http://localhost:5280/api/Account/GetAccount?id=${familyData.accountID}`, {
              headers: { Authorization: `Bearer ${authToken}` }
            });
            const accountData = await accountRes.json();

            familyName = accountData.name;
          } catch (error) {
            console.warn("Some data missing", error);
          }

          return {
            bookingID: booking.bookingID,
            jobName: jobDetail?.jobName || "Đang cập nhật",
            familyName,
            location: jobDetail?.location || "Đang cập nhật",
            price: jobDetail?.price ? `${jobDetail.price.toLocaleString()} VND` : "Đang cập nhật",
            startDate: jobDetail?.startDate ? new Date(jobDetail.startDate).toLocaleDateString("vi-VN") : "Đang cập nhật",
            endDate: jobDetail?.endDate ? new Date(jobDetail.endDate).toLocaleDateString("vi-VN") : "Đang cập nhật",
            description: jobDetail?.description || "Đang cập nhật",
            slot: Array.isArray(jobDetail?.slotIDs) ? jobDetail.slotIDs.map(s => slotMap[s] || `Slot ${s}`) : [],
            days: Array.isArray(jobDetail?.dayofWeek) ? jobDetail.dayofWeek.map(d => dayNames[d]) : [],
            services: Array.isArray(jobDetail?.serviceIDs) ? jobDetail.serviceIDs.map(id => serviceMap[id]) : []
          };
        }));

        setRows(fullRows);
      } catch (err) {
        console.error("Error fetching booking data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (housekeeperID && authToken) fetchData();
  }, [housekeeperID, authToken]);

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4 text-primary">📋 Danh sách đặt công việc</h3>
      {loading ? (
        <p className="text-muted">⏳ Đang tải dữ liệu...</p>
      ) : rows.length === 0 ? (
        <p className="text-muted">Không có công việc nào được đặt.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded border">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-light text-center">
              <tr>
                <th>#</th>
                <th><FaBriefcase className="me-1 text-secondary" />Công việc</th>
                <th><FaUser className="me-1 text-secondary" />Gia đình</th>
                <th><FaMapMarkerAlt className="me-1 text-danger" />Địa điểm</th>
                <th><FaMoneyBillWave className="me-1 text-success" />Lương</th>
                <th><FaCalendarAlt className="me-1 text-primary" />Bắt đầu</th>
                <th><FaCalendarAlt className="me-1 text-danger" />Kết thúc</th>
                <th><FaFileAlt className="me-1 text-secondary" />Mô tả</th>
                <th><FaClock className="me-1 text-info" />Slot</th>
                <th>📅 Thứ</th>
                <th>🛎️ Dịch vụ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center fw-bold">{row.bookingID}</td>
                  <td>{row.jobName}</td>
                  <td>{row.familyName}</td>
                  <td><span className="badge bg-light text-dark">{row.location}</span></td>
                  <td><span className="badge bg-success-subtle text-success">{row.price}</span></td>
                  <td><span className="badge bg-primary-subtle text-primary">{row.startDate}</span></td>
                  <td><span className="badge bg-danger-subtle text-danger">{row.endDate}</span></td>
                  <td className="small">{row.description}</td>
                  <td className="small">
                    <ul className="ps-3 mb-0">
                      {row.slot.map((s, i) => <li key={i} className="text-info">{s}</li>)}
                    </ul>
                  </td>
                  <td className="small">
                    <ul className="ps-3 mb-0">
                      {row.days.map((d, i) => <li key={i} className="text-warning">{d}</li>)}
                    </ul>
                  </td>
                  <td className="small">
                    <ul className="ps-3 mb-0">
                      {row.services.map((s, i) => <li key={i} className="text-success">{s}</li>)}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HousekeeperBookingManagementPage;
