import React, { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { serviceMap } from "../utils/serviceMap";

const dayNames = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy"
];

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
          let familyName = "Coming Soon";

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
            jobName: jobDetail?.jobName || "Coming Soon",
            familyName,
            location: jobDetail?.location || "Coming Soon",
            price: jobDetail?.price ? `${jobDetail.price.toLocaleString()} VND` : "Coming Soon",
            startDate: jobDetail?.startDate ? new Date(jobDetail.startDate).toLocaleDateString() : "Coming Soon",
            endDate: jobDetail?.endDate ? new Date(jobDetail.endDate).toLocaleDateString() : "Coming Soon",
            description: jobDetail?.description || "Coming Soon",
            slot: jobDetail?.slotIDs?.map(s => `- ${slotMap[s] || `Slot ${s}`}`).join("\n") || "Coming Soon",
            days: jobDetail?.dayofWeek?.map(d => `- ${dayNames[d]}`).join("\n") || "Coming Soon",
            services: jobDetail?.serviceIDs?.map(id => `- ${serviceMap[id]}`).join("\n") || "Coming Soon"
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
    <div className="container my-4">
      <h3 className="fw-bold mb-4">Danh sách Đặt công việc</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Tên công việc</th>
              <th>Gia đình</th>
              <th>Địa điểm</th>
              <th>Mức lương</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Mô tả</th>
              <th>Slot</th>
              <th>Ngày trong tuần</th>
              <th>Dịch vụ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.bookingID}</td>
                <td>{row.jobName}</td>
                <td>{row.familyName}</td>
                <td>{row.location}</td>
                <td><FaMoneyBillWave className="text-success me-1" /> {row.price}</td>
                <td>{row.startDate}</td>
                <td>{row.endDate}</td>
                <td>{row.description}</td>
                <td style={{ whiteSpace: "pre-line" }}>{row.slot}</td>
                <td style={{ whiteSpace: "pre-line" }}>{row.days}</td>
                <td style={{ whiteSpace: "pre-line" }}>{row.services}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HousekeeperBookingManagementPage;
