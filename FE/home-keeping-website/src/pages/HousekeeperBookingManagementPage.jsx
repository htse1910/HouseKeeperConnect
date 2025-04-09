import React, { useEffect, useState } from "react";
import BookingCard from "../components/BookingCard";
import { Modal, Button } from "react-bootstrap";
import { serviceMap } from "../utils/serviceMap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookingDetailModal from "../components/BookingDetailModal";

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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [matchedDate, setMatchedDate] = useState(null);
  const [isToday, setIsToday] = useState(false);

  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  const openDayModal = (booking, dayIndex) => {
    const start = new Date(booking.startDate.split("/").reverse().join("-"));
    const end = new Date(booking.endDate.split("/").reverse().join("-"));

    const now = new Date();
    const currentWeekDay = now.getDay();
    const diff = dayIndex - currentWeekDay;
    const matched = new Date(now);
    matched.setDate(now.getDate() + diff);

    if (matched >= start && matched <= end) {
      const today = new Date();
      const isSameDate = today.toDateString() === matched.toDateString();

      setSelectedBooking(booking);
      setSelectedDay(dayNames[dayIndex]);
      setMatchedDate(matched);
      setIsToday(isSameDate);
      setShowModal(true);
    } else {
      alert("Ngày này không nằm trong phạm vi công việc.");
    }
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(`http://localhost:5280/api/Job/CheckIn?bookingId=${selectedBooking.bookingID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (res.ok) {
        toast.success("✅ Check-in thành công!");
        setShowModal(false);
      } else {
        const errorMsg = await res.text();
        toast.error(`❌ Check-in thất bại: ${errorMsg}`);
      }
    } catch (err) {
      toast.error("🚫 Lỗi khi check-in.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5280/api/Booking/GetBookingByHousekeeperID?housekeeperId=${housekeeperID}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const bookingData = await res.json();

        const fullRows = await Promise.all(
          bookingData.map(async (booking) => {
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
              jobID: jobDetail?.jobID, // ✅ add this line
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
          })
        );

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
    <div className="container py-4">
      <ToastContainer />
      <h4 className="fw-bold mb-4 text-primary">📋 Danh sách đặt công việc</h4>

      {loading ? (
        <p className="text-muted">⏳ Đang tải dữ liệu...</p>
      ) : rows.length === 0 ? (
        <p className="text-muted">Không có công việc nào được đặt.</p>
      ) : (
        <div className="row g-3">
          {rows.map((row, idx) => (
            <div className="col-12" key={idx}>
              <BookingCard row={row} onDayClick={openDayModal} />
            </div>
          ))}
        </div>
      )}

      <BookingDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        booking={selectedBooking}
        selectedDay={selectedDay}
        matchedDate={matchedDate}
        isToday={isToday}
        onCheckIn={handleCheckIn}
      />

    </div>
  );
};

export default HousekeeperBookingManagementPage;
