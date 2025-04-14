import React from "react";
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaClock
} from "react-icons/fa";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import BookingDetailItem from "./BookingDetailItem";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed
const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

const BookingCard = ({ row, onDayClick }) => {
  const handleCompleteJob = async () => {
    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/HousekeeperCompleteJob?jobId=${row.bookingID}&accountID=${accountID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );

      if (res.ok) {
        toast.success("🎉 Công việc đã hoàn thành!");
      } else {
        const msg = await res.text();
        toast.error(`❌ Không thể hoàn thành: ${msg}`);
      }
    } catch (error) {
      toast.error("🚫 Lỗi kết nối đến server.");
      console.error(error);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 p-2 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="fw-bold mb-0">
          <FaBriefcase className="me-2 text-warning" />
          {row.jobName}
        </h6>
        <span className="text-muted small">#{row.bookingID}</span>
      </div>

      <BookingDetailItem icon={FaUser} label="Gia đình:" value={row.familyName} className="mb-1 text-muted small" />

      <div className="d-flex flex-wrap mb-1">
        <BookingDetailItem icon={FaMapMarkerAlt} label="Địa điểm:" value={row.location} className="me-3 text-danger" />
        <BookingDetailItem icon={FaMoneyBillWave} label="Lương:" value={row.price} className="text-success" />
      </div>

      <div className="d-flex flex-wrap mb-1">
        <BookingDetailItem icon={FaCalendarAlt} label="Bắt đầu:" value={row.startDate} className="me-3 text-primary" />
        <BookingDetailItem icon={FaCalendarAlt} label="Kết thúc:" value={row.endDate} className="text-danger" />
      </div>

      <BookingDetailItem icon={FaFileAlt} label="Mô tả:" value={row.description} className="mb-1 text-secondary" />

      <div className="d-flex flex-wrap">
        <div className="col-12 col-md-4 small">
          <strong><FaClock className="me-1 text-info" />Ca làm việc:</strong>
          <ul className="ps-3 mb-0">
            {row.slot.map((s, i) => (
              <li key={i} className="text-info">{s}</li>
            ))}
          </ul>
        </div>
        <div className="col-12 col-md-4 small">
          <strong>📅 Thứ:</strong>
          <ul className="ps-3 mb-0">
            {row.days.map((d, i) => {
              const dayIndex = dayNames.indexOf(d);
              return (
                <li
                  key={i}
                  className="text-warning"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => onDayClick && onDayClick(row, dayIndex)}
                >
                  {d}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-12 col-md-4 small">
          <strong>🛎️ Dịch vụ:</strong>
          <ul className="ps-3 mb-0">
            {row.services.map((s, i) => (
              <li key={i} className="text-success">{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 text-end">
        <Button
          variant="outline-success"
          size="sm"
          onClick={handleCompleteJob}
        >
          ✅ Hoàn thành công việc
        </Button>
      </div>
    </div>
  );
};

export default BookingCard;
